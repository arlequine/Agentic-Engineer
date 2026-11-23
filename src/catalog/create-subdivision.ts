// Use case: register a subdivision in a section (spec §5.3, validation order §5.7).
import { canManageSection } from "./authorization.ts";
import { MAX_NAME_LENGTH } from "./limits.ts";
import { messages } from "./messages.ts";
import { hasForbiddenCharacters, normalizeName, textLength } from "./normalize.ts";
import type { SubdivisionDeps } from "./ports.ts";
import { err, ok } from "./types.ts";
import type { Actor, Result, SectionId, Subdivision } from "./types.ts";

export interface CreateSubdivisionCommand {
  actor: Actor;
  sectionId: SectionId;
  name: string;
}

export type CreateSubdivisionError =
  | { type: "FORBIDDEN"; message: string }
  | { type: "EMPTY_NAME"; message: string }
  | { type: "NAME_TOO_LONG"; message: string }
  | { type: "INVALID_NAME"; message: string }
  | { type: "SECTION_NOT_FOUND"; message: string }
  | { type: "ALREADY_EXISTS"; message: string };

export async function createSubdivision(
  cmd: CreateSubdivisionCommand,
  deps: SubdivisionDeps,
): Promise<Result<Subdivision, CreateSubdivisionError>> {
  // 1. Role (R-14), no lookups.
  if (cmd.actor.role !== "admin") {
    return err({ type: "FORBIDDEN", message: messages.forbidden() });
  }

  // 2. Name shape (R-08), no lookups.
  const normalizedName = normalizeName(cmd.name);
  if (normalizedName === "") {
    return err({ type: "EMPTY_NAME", message: messages.emptyName() });
  }
  if (textLength(normalizedName) > MAX_NAME_LENGTH) {
    return err({ type: "NAME_TOO_LONG", message: messages.nameTooLong() });
  }
  if (hasForbiddenCharacters(normalizedName)) {
    return err({ type: "INVALID_NAME", message: messages.invalidName() });
  }

  // 3. Existence and scope look the same from outside (R-13, R-15).
  const section = await deps.repo.findSection(cmd.sectionId);
  if (section === null || !canManageSection(cmd.actor, section)) {
    return err({ type: "SECTION_NOT_FOUND", message: messages.sectionNotFound() });
  }

  // 4. Uniqueness inside the section (R-08).
  const existing = await deps.repo.findByNormalizedName(cmd.sectionId, normalizedName);
  if (existing !== null) {
    return err({ type: "ALREADY_EXISTS", message: messages.subdivisionAlreadyExists(existing.name) });
  }

  // 5. Atomic save with its audit entry (R-12, R-16).
  const subdivision: Subdivision = {
    id: deps.ids.newSubdivisionId(),
    sectionId: cmd.sectionId,
    name: cmd.name,
    normalizedName,
  };
  const saved = await deps.repo.save(subdivision, {
    id: deps.ids.newAuditEntryId(),
    actorId: cmd.actor.id,
    occurredAt: deps.clock.now(),
    action: "SUBDIVISION_CREATED",
    subdivisionId: subdivision.id,
    sectionId: subdivision.sectionId,
    name: subdivision.name,
  });
  if (!saved.ok) {
    // Lost a race: report it exactly like a regular duplicate (R-12).
    const winner = await deps.repo.findByNormalizedName(cmd.sectionId, normalizedName);
    const shownName = winner?.name ?? cmd.name;
    return err({ type: "ALREADY_EXISTS", message: messages.subdivisionAlreadyExists(shownName) });
  }
  return ok(subdivision);
}
