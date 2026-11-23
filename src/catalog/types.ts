// Domain types for HU-01 (spec §5.1). Terms follow the spec glossary (§2).

export type ResidentialId = string & { readonly __brand: "ResidentialId" };
export type SectionId = string & { readonly __brand: "SectionId" };
export type SubdivisionId = string & { readonly __brand: "SubdivisionId" };
export type UnitId = string & { readonly __brand: "UnitId" };
export type UserId = string & { readonly __brand: "UserId" };
export type AuditEntryId = string & { readonly __brand: "AuditEntryId" };

export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export const ok = <T>(value: T): { ok: true; value: T } => ({ ok: true, value });
export const err = <E>(error: E): { ok: false; error: E } => ({ ok: false, error });

export type Role = "admin" | "resident" | "guard";

export type AdminScope =
  | { kind: "residential"; id: ResidentialId }
  | { kind: "section"; id: SectionId }
  | { kind: "subdivision"; id: SubdivisionId };

export interface Actor {
  id: UserId;
  role: Role;
  scopes: AdminScope[]; // empty unless role is "admin"
}

export interface Subdivision {
  id: SubdivisionId;
  sectionId: SectionId;
  name: string; // as typed (R-09)
  normalizedName: string; // for comparison (R-08)
}

export interface Unit {
  id: UnitId;
  subdivisionId: SubdivisionId;
  label: string; // as typed (R-09)
  normalizedLabel: string; // for comparison (R-02, R-03)
}

export interface LabelPair {
  label: string;
  normalizedLabel: string;
}

export type AuditEntry =
  | {
      id: AuditEntryId;
      actorId: UserId;
      occurredAt: Date;
      action: "SUBDIVISION_CREATED";
      subdivisionId: SubdivisionId;
      sectionId: SectionId;
      name: string;
    }
  | {
      id: AuditEntryId;
      actorId: UserId;
      occurredAt: Date;
      action: "UNIT_BATCH_CREATED";
      subdivisionId: SubdivisionId;
      labels: string[];
    };

/** Where an object sits in the hierarchy (spec §5.2). */
export interface SectionLocation {
  sectionId: SectionId;
  residentialId: ResidentialId;
}

export interface SubdivisionLocation {
  subdivisionId: SubdivisionId;
  sectionId: SectionId;
  residentialId: ResidentialId;
}
