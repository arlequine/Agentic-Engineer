// Verifies specs/hu-01-alta-privada-viviendas.md v0.2: one test per scenario, named after it.
import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createSubdivision } from "./create-subdivision.ts";
import { createUnitBatch } from "./create-unit-batch.ts";
import type { CreateUnitBatchError } from "./create-unit-batch.ts";
import { FixedClock, InMemoryCatalog, SequentialIds } from "./in-memory/in-memory-catalog.ts";
import type { Actor, ResidentialId, SectionId, Subdivision, SubdivisionId, UserId } from "./types.ts";

const RESIDENTIAL = "residential-1" as ResidentialId;
const NORTE = "section-norte" as SectionId;
const SUR = "section-sur" as SectionId;

const admin: Actor = { id: "user-admin" as UserId, role: "admin", scopes: [{ kind: "section", id: NORTE }] };

const range = (from: number, to: number): string[] =>
  Array.from({ length: to - from + 1 }, (_, i) => String(from + i));

/** World from §4: the admin has scope over "Norte", where "Los Robles" is. "Sur" is out of scope. */
async function world() {
  const repo = new InMemoryCatalog();
  repo.addSection(NORTE, RESIDENTIAL);
  repo.addSection(SUR, RESIDENTIAL);
  const clock = new FixedClock(new Date("2026-11-23T08:00:00"));
  const deps = { repo, ids: new SequentialIds(), clock };

  const subdivision = async (name: string, sectionId: SectionId = NORTE, actor: Actor = admin) => {
    const superAdmin: Actor = { ...actor, scopes: [{ kind: "residential", id: RESIDENTIAL }] };
    const result = await createSubdivision({ actor: superAdmin, sectionId, name }, deps);
    assert.ok(result.ok, "fixture subdivision must be created");
    return result.value;
  };
  const losRobles = await subdivision("Los Robles");
  const addUnits = (labels: string[], target: Subdivision = losRobles, actor: Actor = admin) =>
    createUnitBatch({ actor, subdivisionId: target.id, labels }, deps);

  return { repo, clock, deps, losRobles, subdivision, addUnits };
}

function rejectedMessages(error: CreateUnitBatchError): string[] {
  assert.equal(error.type, "BATCH_REJECTED");
  return error.type === "BATCH_REJECTED" ? error.problems.map((p) => p.message) : [];
}

describe("HU-01 · alta de viviendas", () => {
  test("Escenario 1: alta de viviendas", async () => {
    const { repo, losRobles, addUnits } = await world();
    const result = await addUnits(range(1, 40));
    assert.ok(result.ok);
    assert.equal(repo.unitsOf(losRobles.id).length, 40);
  });

  test("Escenario 2: vivienda duplicada", async () => {
    const { repo, losRobles, addUnits } = await world();
    await addUnits(["14"]);
    const result = await addUnits(["14"]);
    assert.ok(!result.ok);
    assert.deepEqual(rejectedMessages(result.error), ["La vivienda 14 ya existe"]);
    assert.equal(repo.unitsOf(losRobles.id).length, 1);
  });

  test("Escenario 3: lote con un duplicado", async () => {
    const { repo, losRobles, addUnits } = await world();
    await addUnits(["14"]);
    const before = repo.unitsOf(losRobles.id);
    const result = await addUnits(range(10, 20));
    assert.ok(!result.ok);
    assert.deepEqual(rejectedMessages(result.error), ["La vivienda 14 ya existe"]);
    assert.deepEqual(repo.unitsOf(losRobles.id), before);
  });

  test("Escenario 4: duplicado por normalización", async () => {
    const { addUnits } = await world();
    await addUnits(["14-B"]);
    const result = await addUnits([" 14-b "]);
    assert.ok(!result.ok);
    assert.deepEqual(rejectedMessages(result.error), ["La vivienda 14-B ya existe"]);
  });

  test("Escenario 5: duplicado dentro del mismo lote", async () => {
    const { repo, losRobles, addUnits } = await world();
    const result = await addUnits(["7", "8", "7"]);
    assert.ok(!result.ok);
    assert.deepEqual(rejectedMessages(result.error), ["La vivienda 7 está repetida en el lote"]);
    assert.equal(repo.unitsOf(losRobles.id).length, 0);
  });

  test("Escenario 6: mismo identificador en otra privada", async () => {
    const { repo, subdivision, addUnits } = await world();
    await addUnits(["14"]);
    const lasPalmas = await subdivision("Las Palmas");
    const result = await addUnits(["14"], lasPalmas);
    assert.ok(result.ok);
    assert.deepEqual(repo.unitsOf(lasPalmas.id).map((u) => u.label), ["14"]);
  });

  test("Escenario 8: ceros a la izquierda", async () => {
    const { addUnits } = await world();
    await addUnits(["14"]);
    const result = await addUnits(["014"]);
    assert.ok(!result.ok);
    assert.deepEqual(rejectedMessages(result.error), ["La vivienda 14 ya existe"]);
  });

  test("Escenario 9: privada inexistente", async () => {
    const { repo, deps } = await world();
    const ghost = "subdivision-ghost" as SubdivisionId;
    const result = await createUnitBatch({ actor: admin, subdivisionId: ghost, labels: ["1"] }, deps);
    assert.ok(!result.ok);
    assert.equal(result.error.type, "SUBDIVISION_NOT_FOUND");
    assert.equal("message" in result.error && result.error.message, "La privada no existe");
    assert.equal(repo.unitsOf(ghost).length, 0);
  });

  test("Escenario 10: lote demasiado grande", async () => {
    const { repo, losRobles, addUnits } = await world();
    const result = await addUnits(range(1, 501));
    assert.ok(!result.ok);
    assert.deepEqual(result.error, {
      type: "BATCH_TOO_LARGE",
      message: "Un lote admite como máximo 500 viviendas",
      max: 500,
    });
    assert.equal(repo.unitsOf(losRobles.id).length, 0);
  });

  test("Escenario 11: lote vacío", async () => {
    const { repo, losRobles, addUnits } = await world();
    const result = await addUnits([]);
    assert.ok(!result.ok);
    assert.deepEqual(result.error, { type: "EMPTY_BATCH", message: "Indica al menos una vivienda" });
    assert.equal(repo.unitsOf(losRobles.id).length, 0);
  });

  test("Escenario 12: identificador vacío", async () => {
    const { repo, losRobles, addUnits } = await world();
    const result = await addUnits(["1", "  ", "3"]);
    assert.ok(!result.ok);
    assert.deepEqual(rejectedMessages(result.error), ["Hay una vivienda sin identificador"]);
    assert.equal(repo.unitsOf(losRobles.id).length, 0);
  });

  test("Escenario 13: alta simultánea", async () => {
    // In S3 the race is reproduced against the in-memory store; the real UNIQUE is tested in S7.
    const { repo, losRobles, addUnits } = await world();
    const results = await Promise.all([addUnits(["14"]), addUnits(["14"])]);
    assert.equal(repo.unitsOf(losRobles.id).filter((u) => u.normalizedLabel === "14").length, 1);
    const failures = results.filter((r) => !r.ok);
    assert.equal(failures.length, 1);
    const failure = failures[0];
    assert.ok(failure && !failure.ok);
    assert.deepEqual(rejectedMessages(failure.error), ["La vivienda 14 ya existe"]);
  });

  test("Escenario 14: lote en el límite", async () => {
    const { repo, losRobles, addUnits } = await world();
    const result = await addUnits(range(1, 500));
    assert.ok(result.ok);
    assert.equal(repo.unitsOf(losRobles.id).length, 500);
  });

  test("Escenario 15: varios problemas a la vez", async () => {
    const { repo, losRobles, addUnits } = await world();
    await addUnits(["14"]);
    const result = await addUnits(["13", "14", "13", "  "]);
    assert.ok(!result.ok);
    assert.deepEqual(rejectedMessages(result.error), [
      "La vivienda 14 ya existe",
      "La vivienda 13 está repetida en el lote",
      "Hay una vivienda sin identificador",
    ]);
    assert.deepEqual(repo.unitsOf(losRobles.id).map((u) => u.label), ["14"]);
  });

  test("Escenario 16: se conserva el texto original", async () => {
    const { repo, losRobles, addUnits } = await world();
    await addUnits(["Casa 7a"]);
    assert.deepEqual(repo.unitsOf(losRobles.id).map((u) => u.label), ["Casa 7a"]);
    const result = await addUnits(["CASA 7A"]);
    assert.ok(!result.ok);
    assert.deepEqual(rejectedMessages(result.error), ["La vivienda CASA 7A ya existe"]);
  });

  test("Escenario 17: identificador demasiado largo", async () => {
    const { repo, losRobles, addUnits } = await world();
    const result = await addUnits(["1234567890123456789012"]);
    assert.ok(!result.ok);
    assert.deepEqual(rejectedMessages(result.error), [
      "La vivienda 1234567890123456789012 supera los 20 caracteres",
    ]);
    assert.equal(repo.unitsOf(losRobles.id).length, 0);
  });

  test("Escenario 18: caracteres invisibles", async () => {
    const { repo, losRobles, addUnits } = await world();
    const result = await addUnits(["1​4"]);
    assert.ok(!result.ok);
    assert.deepEqual(rejectedMessages(result.error), ["La vivienda 14 tiene caracteres no permitidos"]);
    assert.equal(repo.unitsOf(losRobles.id).length, 0);
  });

  test("Escenario 23: rol sin permiso", async () => {
    const { repo, losRobles, addUnits } = await world();
    const resident: Actor = { id: "user-resident" as UserId, role: "resident", scopes: [] };
    const result = await addUnits(["41"], losRobles, resident);
    assert.ok(!result.ok);
    assert.deepEqual(result.error, {
      type: "FORBIDDEN",
      message: "No tienes permiso para dar de alta privadas ni viviendas",
    });
    assert.equal(repo.unitsOf(losRobles.id).length, 0);
  });

  test("Escenario 24: privada de otro ámbito", async () => {
    const { repo, subdivision, addUnits } = await world();
    const lasLomas = await subdivision("Las Lomas", SUR);
    const result = await addUnits(["1"], lasLomas);
    assert.ok(!result.ok);
    assert.deepEqual(result.error, { type: "SUBDIVISION_NOT_FOUND", message: "La privada no existe" });
    assert.equal(repo.unitsOf(lasLomas.id).length, 0);
  });

  test("Escenario 26: el ámbito de residencial cubre lo de abajo", async () => {
    const { repo, losRobles, addUnits } = await world();
    const residentialAdmin: Actor = {
      id: "user-residential" as UserId,
      role: "admin",
      scopes: [{ kind: "residential", id: RESIDENTIAL }],
    };
    const result = await addUnits(["41"], losRobles, residentialAdmin);
    assert.ok(result.ok);
    assert.deepEqual(repo.unitsOf(losRobles.id).map((u) => u.label), ["41"]);
  });

  test("Escenario 27: el alta deja rastro", async () => {
    const { repo, clock, losRobles, addUnits } = await world();
    const at = new Date("2026-11-23T10:00:00");
    clock.set(at);
    const before = repo.auditEntries().length;
    await addUnits(["1", "2", "3"]);
    const entries = repo.auditEntries().slice(before);
    assert.equal(entries.length, 1);
    assert.deepEqual(entries[0], {
      id: entries[0]?.id,
      actorId: admin.id,
      occurredAt: at,
      action: "UNIT_BATCH_CREATED",
      subdivisionId: losRobles.id,
      labels: ["1", "2", "3"],
    });
  });

  test("Escenario 28: un rechazo no deja cambios", async () => {
    const { repo, losRobles, addUnits } = await world();
    await addUnits(["14"]);
    const auditBefore = repo.auditEntries().length;
    const result = await addUnits(["13", "14"]);
    assert.ok(!result.ok);
    assert.deepEqual(repo.unitsOf(losRobles.id).map((u) => u.label), ["14"]);
    assert.equal(repo.auditEntries().length, auditBefore);
  });
});

describe("HU-01 · alta de privada", () => {
  test("Escenario 7: privada duplicada en la sección", async () => {
    const { deps } = await world();
    const result = await createSubdivision({ actor: admin, sectionId: NORTE, name: " los robles " }, deps);
    assert.ok(!result.ok);
    assert.deepEqual(result.error, {
      type: "ALREADY_EXISTS",
      message: "La privada Los Robles ya existe en esta sección",
    });
  });

  test("Escenario 19: nombre de privada vacío", async () => {
    const { repo, deps } = await world();
    const before = repo.subdivisionsOf(NORTE).length;
    const result = await createSubdivision({ actor: admin, sectionId: NORTE, name: "   " }, deps);
    assert.ok(!result.ok);
    assert.deepEqual(result.error, { type: "EMPTY_NAME", message: "Indica el nombre de la privada" });
    assert.equal(repo.subdivisionsOf(NORTE).length, before);
  });

  test("Escenario 20: nombre de privada demasiado largo", async () => {
    const { repo, deps } = await world();
    const before = repo.subdivisionsOf(NORTE).length;
    const result = await createSubdivision({ actor: admin, sectionId: NORTE, name: "a".repeat(81) }, deps);
    assert.ok(!result.ok);
    assert.deepEqual(result.error, {
      type: "NAME_TOO_LONG",
      message: "El nombre de la privada admite como máximo 80 caracteres",
    });
    assert.equal(repo.subdivisionsOf(NORTE).length, before);
  });

  test("Escenario 21: los acentos distinguen", async () => {
    const { repo, deps } = await world();
    await createSubdivision({ actor: admin, sectionId: NORTE, name: "Los Álamos" }, deps);
    // "Los Álamos" written with a combining accent must still collide with itself (NFC, R-02 step 1).
    const decomposed = await createSubdivision({ actor: admin, sectionId: NORTE, name: "Los Álamos" }, deps);
    assert.ok(!decomposed.ok);
    const result = await createSubdivision({ actor: admin, sectionId: NORTE, name: "Los Alamos" }, deps);
    assert.ok(result.ok);
    const names = repo.subdivisionsOf(NORTE).map((s) => s.name);
    assert.ok(names.includes("Los Álamos") && names.includes("Los Alamos"));
  });

  test("Escenario 22: sección inexistente", async () => {
    const { deps } = await world();
    const ghost = "section-ghost" as SectionId;
    const result = await createSubdivision({ actor: admin, sectionId: ghost, name: "Nueva" }, deps);
    assert.ok(!result.ok);
    assert.deepEqual(result.error, { type: "SECTION_NOT_FOUND", message: "La sección no existe" });
  });

  test("Escenario 25: sección de otro ámbito", async () => {
    const { repo, deps } = await world();
    const before = repo.subdivisionsOf(SUR).length;
    const result = await createSubdivision({ actor: admin, sectionId: SUR, name: "Nueva" }, deps);
    assert.ok(!result.ok);
    assert.deepEqual(result.error, { type: "SECTION_NOT_FOUND", message: "La sección no existe" });
    assert.equal(repo.subdivisionsOf(SUR).length, before);
  });

  test("Escenario 29: registrar la privada deja rastro", async () => {
    const { repo, clock, deps } = await world();
    const at = new Date("2026-11-23T09:00:00");
    clock.set(at);
    const before = repo.auditEntries().length;
    const result = await createSubdivision({ actor: admin, sectionId: NORTE, name: "Las Palmas" }, deps);
    assert.ok(result.ok);
    const entries = repo.auditEntries().slice(before);
    assert.equal(entries.length, 1);
    assert.deepEqual(entries[0], {
      id: entries[0]?.id,
      actorId: admin.id,
      occurredAt: at,
      action: "SUBDIVISION_CREATED",
      subdivisionId: result.value.id,
      sectionId: NORTE,
      name: "Las Palmas",
    });
  });
});
