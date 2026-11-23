// In-memory adapters for the ports (spec §5.6). Used to verify the spec in S3; replaced by Supabase in S7.
import type { Clock, IdGenerator, SubdivisionRepository, UnitRepository } from "../ports.ts";
import { err, ok } from "../types.ts";
import type {
  AuditEntry,
  AuditEntryId,
  ResidentialId,
  Result,
  SectionId,
  SectionLocation,
  Subdivision,
  SubdivisionId,
  SubdivisionLocation,
  Unit,
  UnitId,
} from "../types.ts";

/**
 * One store backs both repositories, like one database would.
 * Each save checks uniqueness and writes in a single synchronous step, so it is atomic
 * the way a transaction with a UNIQUE constraint would be (R-05, R-12, R-16).
 */
export class InMemoryCatalog implements SubdivisionRepository, UnitRepository {
  private readonly sections = new Map<SectionId, ResidentialId>();
  private readonly subdivisions = new Map<SubdivisionId, Subdivision>();
  private readonly units: Unit[] = [];
  private readonly audit: AuditEntry[] = [];

  addSection(sectionId: SectionId, residentialId: ResidentialId): void {
    this.sections.set(sectionId, residentialId);
  }

  // --- SubdivisionRepository ---

  async findSection(id: SectionId): Promise<SectionLocation | null> {
    const residentialId = this.sections.get(id);
    return residentialId === undefined ? null : { sectionId: id, residentialId };
  }

  async findByNormalizedName(sectionId: SectionId, normalizedName: string): Promise<Subdivision | null> {
    return this.findSubdivisionByName(sectionId, normalizedName) ?? null;
  }

  async save(subdivision: Subdivision, audit: AuditEntry): Promise<Result<void, { conflict: true }>> {
    if (this.findSubdivisionByName(subdivision.sectionId, subdivision.normalizedName)) {
      return err({ conflict: true });
    }
    this.subdivisions.set(subdivision.id, subdivision);
    this.audit.push(audit);
    return ok(undefined);
  }

  // --- UnitRepository ---

  async findSubdivision(id: SubdivisionId): Promise<SubdivisionLocation | null> {
    const subdivision = this.subdivisions.get(id);
    if (subdivision === undefined) return null;
    const residentialId = this.sections.get(subdivision.sectionId);
    if (residentialId === undefined) return null;
    return { subdivisionId: id, sectionId: subdivision.sectionId, residentialId };
  }

  async findExistingNormalizedLabels(id: SubdivisionId, normalized: string[]): Promise<Set<string>> {
    const wanted = new Set(normalized);
    return new Set(
      this.units
        .filter((unit) => unit.subdivisionId === id && wanted.has(unit.normalizedLabel))
        .map((unit) => unit.normalizedLabel),
    );
  }

  async saveBatch(units: Unit[], audit: AuditEntry): Promise<Result<void, { conflicts: string[] }>> {
    const conflicts = units
      .filter((unit) =>
        this.units.some(
          (stored) => stored.subdivisionId === unit.subdivisionId && stored.normalizedLabel === unit.normalizedLabel,
        ),
      )
      .map((unit) => unit.normalizedLabel);
    if (conflicts.length > 0) return err({ conflicts });
    this.units.push(...units);
    this.audit.push(audit);
    return ok(undefined);
  }

  // --- Read helpers for tests (not part of the ports) ---

  unitsOf(id: SubdivisionId): Unit[] {
    return this.units.filter((unit) => unit.subdivisionId === id);
  }

  subdivisionsOf(sectionId: SectionId): Subdivision[] {
    return [...this.subdivisions.values()].filter((s) => s.sectionId === sectionId);
  }

  auditEntries(): AuditEntry[] {
    return [...this.audit];
  }

  private findSubdivisionByName(sectionId: SectionId, normalizedName: string): Subdivision | undefined {
    return [...this.subdivisions.values()].find(
      (s) => s.sectionId === sectionId && s.normalizedName === normalizedName,
    );
  }
}

/** Predictable ids so tests can assert exact values. */
export class SequentialIds implements IdGenerator {
  private next = 1;
  newSubdivisionId(): SubdivisionId {
    return `subdivision-${this.next++}` as SubdivisionId;
  }
  newUnitId(): UnitId {
    return `unit-${this.next++}` as UnitId;
  }
  newAuditEntryId(): AuditEntryId {
    return `audit-${this.next++}` as AuditEntryId;
  }
}

export class FixedClock implements Clock {
  private current: Date;
  constructor(start: Date) {
    this.current = start;
  }
  now(): Date {
    return this.current;
  }
  set(date: Date): void {
    this.current = date;
  }
}
