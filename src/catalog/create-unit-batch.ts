// Use case: register a batch of units in a subdivision (spec §5.4, validation order §5.7).
import { canManageSubdivision } from "./authorization.ts";
import { MAX_BATCH_SIZE, MAX_LABEL_LENGTH } from "./limits.ts";
import { messages } from "./messages.ts";
import { hasForbiddenCharacters, normalizeLabel, textLength, visibleText } from "./normalize.ts";
import type { UnitDeps } from "./ports.ts";
import { err, ok } from "./types.ts";
import type { Actor, LabelPair, Result, SubdivisionId, Unit } from "./types.ts";

export interface CreateUnitBatchCommand {
  actor: Actor;
  subdivisionId: SubdivisionId;
  labels: string[];
}

export interface UnitBatchCreated {
  subdivisionId: SubdivisionId;
  units: Unit[];
}

export type RejectionReason =
  | "EMPTY"
  | "TOO_LONG"
  | "INVALID_CHARACTERS"
  | "DUPLICATE_IN_BATCH"
  | "ALREADY_EXISTS";

export interface UnitProblem {
  reason: RejectionReason;
  label: string; // as typed, for display
  message: string;
}

export type CreateUnitBatchError =
  | { type: "FORBIDDEN"; message: string }
  | { type: "EMPTY_BATCH"; message: string }
  | { type: "BATCH_TOO_LARGE"; message: string; max: number }
  | { type: "SUBDIVISION_NOT_FOUND"; message: string }
  | { type: "BATCH_REJECTED"; problems: UnitProblem[] };

/** Per-label checks (R-04, R-05, R-06). Pure. At most one problem per label, in batch order. */
export function validateBatch(
  labels: string[],
  existing: Set<string>,
): Result<LabelPair[], CreateUnitBatchError> {
  const problems: UnitProblem[] = [];
  const pairs: LabelPair[] = [];
  const seen = new Set<string>();

  for (const label of labels) {
    const normalizedLabel = normalizeLabel(label);
    const problem = findProblem(label, normalizedLabel, seen, existing);
    if (problem !== null) {
      problems.push(problem);
    } else {
      pairs.push({ label, normalizedLabel });
    }
    if (normalizedLabel !== "") seen.add(normalizedLabel);
  }

  return problems.length > 0 ? err({ type: "BATCH_REJECTED", problems }) : ok(pairs);
}

function findProblem(
  label: string,
  normalized: string,
  seen: Set<string>,
  existing: Set<string>,
): UnitProblem | null {
  if (normalized === "") {
    return { reason: "EMPTY", label, message: messages.emptyLabel() };
  }
  if (textLength(normalized) > MAX_LABEL_LENGTH) {
    return { reason: "TOO_LONG", label, message: messages.labelTooLong(normalized) };
  }
  if (hasForbiddenCharacters(normalized)) {
    return { reason: "INVALID_CHARACTERS", label, message: messages.invalidCharacters(visibleText(normalized)) };
  }
  if (seen.has(normalized)) {
    return { reason: "DUPLICATE_IN_BATCH", label, message: messages.duplicateInBatch(normalized) };
  }
  if (existing.has(normalized)) {
    return { reason: "ALREADY_EXISTS", label, message: messages.unitAlreadyExists(normalized) };
  }
  return null;
}

export async function createUnitBatch(
  cmd: CreateUnitBatchCommand,
  deps: UnitDeps,
): Promise<Result<UnitBatchCreated, CreateUnitBatchError>> {
  // 1. Role (R-14), no lookups.
  if (cmd.actor.role !== "admin") {
    return err({ type: "FORBIDDEN", message: messages.forbidden() });
  }

  // 2. Batch size (R-07, R-11), no lookups.
  if (cmd.labels.length === 0) {
    return err({ type: "EMPTY_BATCH", message: messages.emptyBatch() });
  }
  if (cmd.labels.length > MAX_BATCH_SIZE) {
    return err({ type: "BATCH_TOO_LARGE", message: messages.batchTooLarge(), max: MAX_BATCH_SIZE });
  }

  // 3. Existence and scope look the same from outside (R-13, R-15).
  const location = await deps.repo.findSubdivision(cmd.subdivisionId);
  if (location === null || !canManageSubdivision(cmd.actor, location)) {
    return err({ type: "SUBDIVISION_NOT_FOUND", message: messages.subdivisionNotFound() });
  }

  // 4. Per-label checks against what is already stored (R-04 to R-06).
  const normalized = [...new Set(cmd.labels.map(normalizeLabel))];
  const existing = await deps.repo.findExistingNormalizedLabels(cmd.subdivisionId, normalized);
  const validated = validateBatch(cmd.labels, existing);
  if (!validated.ok) return validated;

  // 5. Atomic save with its audit entry (R-05, R-12, R-16).
  const units: Unit[] = validated.value.map((pair) => ({
    id: deps.ids.newUnitId(),
    subdivisionId: cmd.subdivisionId,
    ...pair,
  }));
  const saved = await deps.repo.saveBatch(units, {
    id: deps.ids.newAuditEntryId(),
    actorId: cmd.actor.id,
    occurredAt: deps.clock.now(),
    action: "UNIT_BATCH_CREATED",
    subdivisionId: cmd.subdivisionId,
    labels: units.map((unit) => unit.label),
  });
  if (!saved.ok) {
    // Lost a race: report it exactly like a regular duplicate (R-12).
    const conflicts = new Set(saved.error.conflicts);
    const problems: UnitProblem[] = units
      .filter((unit) => conflicts.has(unit.normalizedLabel))
      .map((unit) => ({
        reason: "ALREADY_EXISTS",
        label: unit.label,
        message: messages.unitAlreadyExists(unit.normalizedLabel),
      }));
    return err({ type: "BATCH_REJECTED", problems });
  }
  return ok({ subdivisionId: cmd.subdivisionId, units });
}
