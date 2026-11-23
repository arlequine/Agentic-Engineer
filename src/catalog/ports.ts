// Ports the use cases need from the outside (spec §5.6).
import type {
  AuditEntry,
  AuditEntryId,
  Result,
  SectionId,
  SectionLocation,
  Subdivision,
  SubdivisionId,
  SubdivisionLocation,
  Unit,
  UnitId,
} from "./types.ts";

export interface SubdivisionRepository {
  findSection(id: SectionId): Promise<SectionLocation | null>;
  findByNormalizedName(sectionId: SectionId, normalizedName: string): Promise<Subdivision | null>;
  /** Atomic with its audit entry (R-16). On a uniqueness violation (R-12) returns a conflict and saves nothing. */
  save(subdivision: Subdivision, audit: AuditEntry): Promise<Result<void, { conflict: true }>>;
}

export interface UnitRepository {
  findSubdivision(id: SubdivisionId): Promise<SubdivisionLocation | null>;
  findExistingNormalizedLabels(id: SubdivisionId, normalized: string[]): Promise<Set<string>>;
  /** Atomic, all or nothing, with its audit entry (R-05, R-16). On a uniqueness violation (R-12) returns the conflicting labels and saves nothing. */
  saveBatch(units: Unit[], audit: AuditEntry): Promise<Result<void, { conflicts: string[] }>>;
}

export interface IdGenerator {
  newSubdivisionId(): SubdivisionId;
  newUnitId(): UnitId;
  newAuditEntryId(): AuditEntryId;
}

export interface Clock {
  now(): Date;
}

export interface SubdivisionDeps {
  repo: SubdivisionRepository;
  ids: IdGenerator;
  clock: Clock;
}

export interface UnitDeps {
  repo: UnitRepository;
  ids: IdGenerator;
  clock: Clock;
}
