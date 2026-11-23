// Scope checks (R-14). A scope covers everything below it.
import type { Actor, SectionLocation, SubdivisionLocation } from "./types.ts";

export function canManageSection(actor: Actor, at: SectionLocation): boolean {
  if (actor.role !== "admin") return false;
  return actor.scopes.some(
    (scope) =>
      (scope.kind === "residential" && scope.id === at.residentialId) ||
      (scope.kind === "section" && scope.id === at.sectionId),
  );
}

export function canManageSubdivision(actor: Actor, at: SubdivisionLocation): boolean {
  if (actor.role !== "admin") return false;
  return actor.scopes.some(
    (scope) =>
      (scope.kind === "residential" && scope.id === at.residentialId) ||
      (scope.kind === "section" && scope.id === at.sectionId) ||
      (scope.kind === "subdivision" && scope.id === at.subdivisionId),
  );
}
