# Spec · HU-01 · Dar de alta la privada y sus viviendas

| Campo | Valor |
|---|---|
| Versión | 0.2 |
| Fecha | 2026-11-23 |
| Historia | [HU-01](../docs/backlog/historias.md) · Ticket T-01 |
| Implementa | RF-01 (parcial: privada y viviendas), RNF-04 (auditoría del alta), RNF-05 (aislamiento del alta) |
| Estado | Implementada (2026-11-23) |
| Código | [`src/catalog/`](../src/catalog/) · verificación: `npm run check` (29 escenarios, un test cada uno) |

## 1. Contexto

La privada es la unidad de operación de CondominIA. Cada pase, entrada e incidencia queda ligada a **una vivienda** de **una privada**. Esta historia crea ese catálogo. Sin él no se puede invitar a nadie (HU-02) ni crear pases (HU-03).

**Ubicación jerárquica:** una privada pertenece a una **sección** y una sección pertenece a una **residencial**. Por debajo de la privada solo hay viviendas: no se modelan calles.

**Supuestos de esta versión:**
- S-01. La residencial y la sección ya existen y llegan como referencia. Esta historia no las crea.
- S-02. El actor llega **autenticado y activo**. La autenticación y la desactivación de cuentas (HU-02, escenario 2) se resuelven antes de llegar a esta operación (S7). Esta spec sí decide la **autorización**: qué puede hacer ese actor.

**Alcance de esta versión:**
- Dar de alta una privada dentro de una sección.
- Dar de alta un lote de viviendas en una privada.
- Autorizar ambas operaciones según el rol y el ámbito del actor.
- Dejar un registro de auditoría de cada alta.

**Fuera de alcance:**
- Renombrar o dar de baja viviendas, con su registro en la bitácora. Está decidido y queda para la v0.3 de esta spec (P-03).
- Asignar ámbitos a las administraciones e invitar usuarios (HU-02).
- La persistencia real, la interfaz de usuario y la autenticación (S7 y S8).

## 2. Lenguaje del dominio

El código se escribe en inglés. Esta tabla es la equivalencia oficial: no se usan sinónimos.

| Término | En código | Significado |
|---|---|---|
| Residencial | `Residential` | Conjunto que agrupa secciones |
| Sección | `Section` | Agrupación de privadas dentro de una residencial |
| Privada | `Subdivision` | Unidad de operación. Tiene guardias, viviendas y una caseta |
| Vivienda | `Unit` | Casa dentro de una privada, identificada por su **identificador** (texto) |
| Vivienda disponible | — | Vivienda sin residentes asignados. Toda vivienda recién creada está disponible |
| Identificador | `label` | Texto de la vivienda tal como se escribió |
| Identificador normalizado | `normalizedLabel` | Forma canónica del identificador, la que se usa para comparar |
| Lote | `batch` | Conjunto de identificadores que se dan de alta en una sola operación |
| Administración | `admin` | Rol que gestiona el catálogo (PRD §3) |
| Residente | `resident` | Rol de quien vive en una vivienda (PRD §3) |
| Guardia | `guard` | Rol de quien opera la caseta (PRD §3) |
| Actor | `Actor` | Usuario autenticado que ejecuta la operación, con su rol y sus ámbitos |
| Ámbito | `AdminScope` | Residencial, sección o privada sobre la que una administración tiene autoridad. Un ámbito cubre todo lo que está debajo de él |
| Registro de auditoría | `AuditEntry` | Constancia de solo escritura de quién hizo qué, sobre qué y cuándo (RNF-04) |

`Community` no se usa: es ambiguo entre privada, sección y residencial.

## 3. Reglas

Origen: **PRD** cuando viene de un RF, RN o RNF; **HU-01** cuando sale de la historia; **Spec** cuando es una decisión propia de esta spec.

| ID | Regla | Origen |
|---|---|---|
| R-01 | Toda vivienda pertenece exactamente a una privada, y toda privada a exactamente una sección. | RF-01 |
| R-02 | El identificador de una vivienda es **texto**. Para comparar se usa su forma normalizada, que se obtiene en este orden: (1) normalización Unicode NFC; (2) cualquier espacio Unicode pasa a espacio normal; (3) se quitan los espacios al inicio y al final y los internos se colapsan a uno; (4) todo se pasa a mayúsculas; (5) se eliminan los ceros a la izquierda y, si el identificador es solo ceros, queda `"0"`. Ejemplos: `" 14-b "` → `"14-B"`, `"014"` → `"14"`. | Spec |
| R-03 | El identificador normalizado es **único dentro de su privada**. Dos privadas distintas sí pueden tener una vivienda `"14"` cada una. | HU-01 |
| R-04 | Un identificador es válido solo si, normalizado, tiene **de 1 a 20 caracteres** y **no contiene caracteres de control ni invisibles** (categorías Unicode Cc y Cf). | Spec |
| R-05 | El alta de un lote es **todo o nada**. Si un solo identificador del lote es inválido, ya existe en la privada o se repite dentro del mismo lote, no se crea ninguna vivienda. | HU-01 |
| R-06 | Si el lote se rechaza, el error enumera **todos** los identificadores problemáticos, en el orden en que aparecen en el lote, y cada uno con su motivo. | Spec |
| R-07 | Un lote vacío no es válido. | Spec |
| R-08 | El nombre de la privada es obligatorio, tiene **de 1 a 80 caracteres**, no contiene caracteres Cc ni Cf y es **único dentro de su sección**. Para comparar se aplican los pasos 1 a 4 de R-02: **no** se eliminan ceros y **los acentos se conservan**, así que "Los Álamos" y "Los Alamos" son privadas distintas. | Spec |
| R-09 | Se guarda el identificador tal como se escribió, para mostrarlo, y también su forma normalizada, para comparar. Lo mismo vale para el nombre de la privada. | Spec |
| R-10 | El nombre de la sección es único dentro de su residencial. Esta historia no crea secciones: la regla se garantiza donde se den de alta (fuera de alcance). | Spec |
| R-11 | Un lote admite como máximo **500** identificadores. | Spec |
| R-12 | La unicidad (R-03 y R-08) la garantiza la **persistencia**, no solo la validación previa. Si dos altas simultáneas chocan, la que pierde se rechaza con el mismo error y el mismo mensaje que un duplicado normal. | Spec |
| R-13 | El lote se da de alta en una privada existente, y la privada se da de alta en una sección existente. | Spec |
| R-14 | Solo el rol **administración** puede dar de alta privadas y viviendas. Para crear una privada hace falta un ámbito que cubra su **sección** (la propia sección o su residencial). Para dar de alta un lote hace falta un ámbito que cubra la **privada** (la propia privada, su sección o su residencial). | RF-01 |
| R-15 | Una sección o una privada fuera del ámbito del actor se trata **igual que si no existiera**: mismo error y mismo mensaje. Nunca se revela que existe. | RNF-05 |
| R-16 | Toda alta exitosa deja **exactamente un** registro de auditoría con el actor, la acción, el objeto y la fecha y hora. El registro se guarda en la misma operación atómica que el alta: o se guardan los dos o ninguno. Un alta rechazada no crea ni modifica nada. | RNF-04 |

## 4. Criterios de aceptación

Los escenarios 1 y 2 vienen de HU-01 sin cambios. Del 3 en adelante salen de las reglas.

Salvo que se diga otra cosa, "la administración" tiene ámbito sobre la sección "Norte", donde está la privada "Los Robles".

```gherkin
Escenario 1: alta de viviendas
  Dado que la administración registró la privada "Los Robles"
  Cuando da de alta las viviendas 1 a 40
  Entonces la privada muestra 40 viviendas disponibles para asignar residentes

Escenario 2: vivienda duplicada
  Dado que la vivienda 14 ya existe en "Los Robles"
  Cuando la administración intenta dar de alta otra vivienda 14
  Entonces ve el error "La vivienda 14 ya existe"
  Y no se crea ninguna vivienda nueva

Escenario 3: lote con un duplicado (R-05, R-06)
  Dado que la vivienda 14 ya existe en "Los Robles"
  Cuando la administración da de alta las viviendas 10 a 20
  Entonces ve el error "La vivienda 14 ya existe"
  Y "Los Robles" sigue con las mismas viviendas que antes

Escenario 4: duplicado por normalización (R-02, R-03)
  Dado que la vivienda "14-B" ya existe en "Los Robles"
  Cuando la administración intenta dar de alta la vivienda " 14-b "
  Entonces ve el error "La vivienda 14-B ya existe"

Escenario 5: duplicado dentro del mismo lote (R-05)
  Cuando la administración da de alta las viviendas "7", "8" y "7"
  Entonces ve el error "La vivienda 7 está repetida en el lote"
  Y no se crea ninguna vivienda

Escenario 6: mismo identificador en otra privada (R-03)
  Dado que la vivienda 14 existe en "Los Robles"
  Y que "Las Palmas" también está en la sección "Norte"
  Cuando la administración da de alta la vivienda 14 en "Las Palmas"
  Entonces "Las Palmas" tiene la vivienda 14

Escenario 7: privada duplicada en la sección (R-08)
  Dado que la sección "Norte" ya tiene la privada "Los Robles"
  Cuando la administración intenta registrar " los robles " en "Norte"
  Entonces ve el error "La privada Los Robles ya existe en esta sección"

Escenario 8: ceros a la izquierda (R-02, R-03)
  Dado que la vivienda 14 ya existe en "Los Robles"
  Cuando la administración intenta dar de alta la vivienda "014"
  Entonces ve el error "La vivienda 14 ya existe"

Escenario 9: privada inexistente (R-13)
  Cuando la administración da de alta viviendas en una privada que no existe
  Entonces ve el error "La privada no existe"
  Y no se crea ninguna vivienda

Escenario 10: lote demasiado grande (R-11)
  Cuando la administración da de alta las viviendas 1 a 501 en "Los Robles"
  Entonces ve el error "Un lote admite como máximo 500 viviendas"
  Y no se crea ninguna vivienda

Escenario 11: lote vacío (R-07)
  Cuando la administración da de alta un lote sin viviendas
  Entonces ve el error "Indica al menos una vivienda"
  Y no se crea ninguna vivienda

Escenario 12: identificador vacío (R-04, R-05)
  Cuando la administración da de alta las viviendas "1", "  " y "3"
  Entonces ve el error "Hay una vivienda sin identificador"
  Y no se crea ninguna vivienda

Escenario 13: alta simultánea (R-12)
  Dado que dos administradores dan de alta la vivienda 14 en "Los Robles" al mismo tiempo
  Cuando ambas operaciones terminan
  Entonces "Los Robles" tiene una sola vivienda 14
  Y una de las dos operaciones ve el error "La vivienda 14 ya existe"

Escenario 14: lote en el límite (R-11)
  Cuando la administración da de alta las viviendas 1 a 500 en "Los Robles"
  Entonces "Los Robles" tiene 500 viviendas disponibles

Escenario 15: varios problemas a la vez (R-05, R-06)
  Dado que la vivienda 14 ya existe en "Los Robles"
  Cuando la administración da de alta las viviendas "13", "14", "13" y "  "
  Entonces ve, en este orden, los errores:
    | La vivienda 14 ya existe              |
    | La vivienda 13 está repetida en el lote |
    | Hay una vivienda sin identificador    |
  Y no se crea ninguna vivienda

Escenario 16: se conserva el texto original (R-09)
  Cuando la administración da de alta la vivienda "Casa 7a" en "Los Robles"
  Entonces la vivienda se muestra como "Casa 7a"
  Y un alta posterior de "CASA 7A" ve el error "La vivienda CASA 7A ya existe"

Escenario 17: identificador demasiado largo (R-04)
  Cuando la administración da de alta la vivienda "1234567890123456789012"
  Entonces ve el error "La vivienda 1234567890123456789012 supera los 20 caracteres"
  Y no se crea ninguna vivienda

Escenario 18: caracteres invisibles (R-04)
  Cuando la administración da de alta un identificador con un carácter invisible entre "1" y "4"
  Entonces ve el error "La vivienda 14 tiene caracteres no permitidos"
  Y no se crea ninguna vivienda

Escenario 19: nombre de privada vacío (R-08)
  Cuando la administración intenta registrar una privada sin nombre en "Norte"
  Entonces ve el error "Indica el nombre de la privada"
  Y no se crea ninguna privada

Escenario 20: nombre de privada demasiado largo (R-08)
  Cuando la administración intenta registrar en "Norte" una privada con un nombre de 81 caracteres
  Entonces ve el error "El nombre de la privada admite como máximo 80 caracteres"
  Y no se crea ninguna privada

Escenario 21: los acentos distinguen (R-08)
  Dado que la sección "Norte" ya tiene la privada "Los Álamos"
  Cuando la administración registra la privada "Los Alamos" en "Norte"
  Entonces la sección "Norte" tiene las dos privadas

Escenario 22: sección inexistente (R-13)
  Cuando la administración intenta registrar una privada en una sección que no existe
  Entonces ve el error "La sección no existe"
  Y no se crea ninguna privada

Escenario 23: rol sin permiso (R-14)
  Dado que soy residente de la casa 14 de "Los Robles"
  Cuando intento dar de alta la vivienda 41 en "Los Robles"
  Entonces veo el error "No tienes permiso para dar de alta privadas ni viviendas"
  Y no se crea ninguna vivienda

Escenario 24: privada de otro ámbito (R-14, R-15)
  Dado que la privada "Las Lomas" está en la sección "Sur"
  Y que la administración solo tiene ámbito sobre la sección "Norte"
  Cuando la administración da de alta la vivienda 1 en "Las Lomas"
  Entonces ve el error "La privada no existe"
  Y "Las Lomas" sigue con las mismas viviendas que antes

Escenario 25: sección de otro ámbito (R-14, R-15)
  Dado que la administración solo tiene ámbito sobre la sección "Norte"
  Cuando intenta registrar una privada en la sección "Sur"
  Entonces ve el error "La sección no existe"
  Y no se crea ninguna privada

Escenario 26: el ámbito de residencial cubre lo de abajo (R-14)
  Dado que una administración tiene ámbito sobre la residencial que contiene "Norte"
  Cuando da de alta la vivienda 41 en "Los Robles"
  Entonces "Los Robles" tiene la vivienda 41

Escenario 27: el alta deja rastro (R-16)
  Dado que son las 10:00 del 2026-11-23
  Cuando la administración da de alta las viviendas 1 a 3 en "Los Robles"
  Entonces existe exactamente un registro de auditoría con esa administración, la acción "alta de viviendas", la privada "Los Robles", las viviendas 1, 2 y 3 y la hora 10:00

Escenario 28: un rechazo no deja cambios (R-16)
  Dado que la vivienda 14 ya existe en "Los Robles"
  Cuando la administración da de alta las viviendas 13 y 14
  Entonces no se crea ninguna vivienda
  Y no se crea ningún registro de auditoría

Escenario 29: registrar la privada deja rastro (R-16)
  Dado que son las 09:00 del 2026-11-23
  Cuando la administración registra la privada "Las Palmas" en "Norte"
  Entonces existe exactamente un registro de auditoría con esa administración, la acción "alta de privada", la privada "Las Palmas", la sección "Norte" y la hora 09:00
```

**Verificación del escenario 13 en esta sesión:** se comprueba con un repositorio falso cuyo `saveBatch` devuelve `conflicts`. La garantía real (`UNIQUE` en la base de datos) se prueba en la S7.

## 5. Contrato de datos e interfaz

Solo firmas y tipos. Los errores de negocio son **valores** (`Result`). Las fallas de infraestructura (por ejemplo, la base de datos caída) se lanzan como excepciones y no forman parte de este contrato.

### 5.1 Tipos

```ts
type ResidentialId = string & { readonly __brand: "ResidentialId" };
type SectionId     = string & { readonly __brand: "SectionId" };
type SubdivisionId = string & { readonly __brand: "SubdivisionId" };
type UnitId        = string & { readonly __brand: "UnitId" };
type UserId        = string & { readonly __brand: "UserId" };
type AuditEntryId  = string & { readonly __brand: "AuditEntryId" };

type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

type Role = "admin" | "resident" | "guard";

type AdminScope =
  | { kind: "residential"; id: ResidentialId }
  | { kind: "section";     id: SectionId }
  | { kind: "subdivision"; id: SubdivisionId };

interface Actor {
  id: UserId;
  role: Role;
  scopes: AdminScope[]; // vacío si el rol no es "admin"
}

interface Subdivision {
  id: SubdivisionId;
  sectionId: SectionId;
  name: string;           // tal como se escribió (R-09)
  normalizedName: string; // para comparar (R-08)
}

interface Unit {
  id: UnitId;
  subdivisionId: SubdivisionId;
  label: string;           // tal como se escribió (R-09)
  normalizedLabel: string; // para comparar (R-02, R-03)
}

interface LabelPair { label: string; normalizedLabel: string; }

type AuditEntry =
  | { id: AuditEntryId; actorId: UserId; occurredAt: Date;
      action: "SUBDIVISION_CREATED"; subdivisionId: SubdivisionId; sectionId: SectionId; name: string }
  | { id: AuditEntryId; actorId: UserId; occurredAt: Date;
      action: "UNIT_BATCH_CREATED"; subdivisionId: SubdivisionId; labels: string[] };
```

### 5.2 Ubicación y autorización

```ts
/** Dónde está un objeto dentro de la jerarquía. */
interface SectionLocation     { sectionId: SectionId; residentialId: ResidentialId; }
interface SubdivisionLocation { subdivisionId: SubdivisionId; sectionId: SectionId; residentialId: ResidentialId; }

/** Puro. R-14: un ámbito cubre todo lo que está debajo de él. */
function canManageSection(actor: Actor, at: SectionLocation): boolean;
function canManageSubdivision(actor: Actor, at: SubdivisionLocation): boolean;
```

### 5.3 Alta de privada

```ts
interface CreateSubdivisionCommand { actor: Actor; sectionId: SectionId; name: string; }

type CreateSubdivisionError =
  | { type: "FORBIDDEN";         message: string } // "No tienes permiso para dar de alta privadas ni viviendas"
  | { type: "EMPTY_NAME";        message: string } // "Indica el nombre de la privada"
  | { type: "NAME_TOO_LONG";     message: string } // "El nombre de la privada admite como máximo 80 caracteres"
  | { type: "INVALID_NAME";      message: string } // "El nombre de la privada tiene caracteres no permitidos"
  | { type: "SECTION_NOT_FOUND"; message: string } // "La sección no existe" (también fuera de ámbito, R-15)
  | { type: "ALREADY_EXISTS";    message: string }; // "La privada Los Robles ya existe en esta sección"

const MAX_NAME_LENGTH = 80; // R-08

function normalizeName(raw: string): string; // R-08: pasos 1 a 4 de R-02
function createSubdivision(cmd: CreateSubdivisionCommand, deps: SubdivisionDeps)
  : Promise<Result<Subdivision, CreateSubdivisionError>>;
```

### 5.4 Alta de lote de viviendas

```ts
interface CreateUnitBatchCommand { actor: Actor; subdivisionId: SubdivisionId; labels: string[]; }
interface UnitBatchCreated       { subdivisionId: SubdivisionId; units: Unit[]; }

type RejectionReason = "EMPTY" | "TOO_LONG" | "INVALID_CHARACTERS" | "DUPLICATE_IN_BATCH" | "ALREADY_EXISTS";

interface UnitProblem {
  reason: RejectionReason;
  label: string;   // tal como se escribió, para mostrar
  message: string;
}

const MAX_BATCH_SIZE = 500;  // R-11
const MAX_LABEL_LENGTH = 20; // R-04

type CreateUnitBatchError =
  | { type: "FORBIDDEN";             message: string }               // R-14
  | { type: "EMPTY_BATCH";           message: string }               // R-07
  | { type: "BATCH_TOO_LARGE";       message: string; max: number }  // R-11
  | { type: "SUBDIVISION_NOT_FOUND"; message: string }               // R-13, R-15
  | { type: "BATCH_REJECTED";        problems: UnitProblem[] };      // R-05, R-06

function normalizeLabel(raw: string): string;                   // R-02
function validateBatch(labels: string[], existing: Set<string>) // puro
  : Result<LabelPair[], CreateUnitBatchError>;
function createUnitBatch(cmd: CreateUnitBatchCommand, deps: UnitDeps)
  : Promise<Result<UnitBatchCreated, CreateUnitBatchError>>;
```

### 5.5 Mensajes

| Código | Mensaje |
|---|---|
| `FORBIDDEN` | "No tienes permiso para dar de alta privadas ni viviendas" |
| `EMPTY_NAME` | "Indica el nombre de la privada" |
| `NAME_TOO_LONG` | "El nombre de la privada admite como máximo 80 caracteres" |
| `INVALID_NAME` | "El nombre de la privada tiene caracteres no permitidos" |
| `SECTION_NOT_FOUND` | "La sección no existe" |
| `ALREADY_EXISTS` (privada) | "La privada {nombre} ya existe en esta sección" |
| `EMPTY_BATCH` | "Indica al menos una vivienda" |
| `BATCH_TOO_LARGE` | "Un lote admite como máximo 500 viviendas" |
| `SUBDIVISION_NOT_FOUND` | "La privada no existe" |
| `EMPTY` | "Hay una vivienda sin identificador" |
| `TOO_LONG` | "La vivienda {identificador} supera los 20 caracteres" |
| `INVALID_CHARACTERS` | "La vivienda {identificador visible} tiene caracteres no permitidos" |
| `DUPLICATE_IN_BATCH` | "La vivienda {identificador} está repetida en el lote" |
| `ALREADY_EXISTS` (vivienda) | "La vivienda {identificador} ya existe" |

`{identificador}` es el identificador normalizado. `{identificador visible}` es el normalizado sin los caracteres Cc y Cf. `{nombre}` es el nombre tal como ya estaba guardado.

### 5.6 Puertos

```ts
interface SubdivisionRepository {
  findSection(id: SectionId): Promise<SectionLocation | null>;
  findByNormalizedName(sectionId: SectionId, normalizedName: string): Promise<Subdivision | null>;
  /** Atómico con su registro de auditoría (R-16). Si viola la unicidad (R-12), devuelve conflicto y no guarda nada. */
  save(s: Subdivision, audit: AuditEntry): Promise<Result<void, { conflict: true }>>;
}

interface UnitRepository {
  findSubdivision(id: SubdivisionId): Promise<SubdivisionLocation | null>;
  findExistingNormalizedLabels(id: SubdivisionId, normalized: string[]): Promise<Set<string>>;
  /** Atómico, todo o nada, con su registro de auditoría (R-05, R-16). Si viola la unicidad (R-12), devuelve las etiquetas en conflicto y no guarda nada. */
  saveBatch(units: Unit[], audit: AuditEntry): Promise<Result<void, { conflicts: string[] }>>;
}

interface IdGenerator {
  newSubdivisionId(): SubdivisionId;
  newUnitId(): UnitId;
  newAuditEntryId(): AuditEntryId;
}

interface Clock { now(): Date; }

interface SubdivisionDeps { repo: SubdivisionRepository; ids: IdGenerator; clock: Clock; }
interface UnitDeps        { repo: UnitRepository;        ids: IdGenerator; clock: Clock; }
```

### 5.7 Orden de validación

**Alta de lote:**
1. `FORBIDDEN` si el rol no es `admin`. Se comprueba sin consultar nada.
2. `EMPTY_BATCH` y `BATCH_TOO_LARGE`, también sin consultar nada.
3. `SUBDIVISION_NOT_FOUND` si la privada no existe **o** si `canManageSubdivision` es falso (R-15).
4. Por cada identificador, en orden: `EMPTY`, `TOO_LONG` o `INVALID_CHARACTERS`; después `DUPLICATE_IN_BATCH` (solo a partir de la segunda aparición) y `ALREADY_EXISTS` contra lo guardado. Cada identificador aporta como máximo un problema. Todos se acumulan en `BATCH_REJECTED`, en el orden del lote (R-06).
5. `saveBatch`. Si hay `conflicts`, se traducen a `ALREADY_EXISTS` dentro de `BATCH_REJECTED` (R-12).

**Alta de privada:**
1. `FORBIDDEN` si el rol no es `admin`.
2. `EMPTY_NAME`, `NAME_TOO_LONG` e `INVALID_NAME`, sin consultar nada.
3. `SECTION_NOT_FOUND` si la sección no existe **o** si `canManageSection` es falso (R-15).
4. `ALREADY_EXISTS` si ya hay una privada con ese nombre normalizado en la sección.
5. `save`. Si hay `conflict`, se traduce a `ALREADY_EXISTS` (R-12).

## 6. Seguridad y privacidad

| Punto | Decisión |
|---|---|
| **Autorización** | Solo la administración, y solo dentro de su ámbito (R-14). Residente y guardia reciben `FORBIDDEN` (escenario 23). La cuenta desactivada se filtra antes de llegar aquí (S-02, HU-02 escenario 2). |
| **Aislamiento** (RNF-05) | Todo identificador de sección o de privada que llega en un comando se verifica contra el ámbito del actor (§5.7, paso 3). Lo que está fuera del ámbito responde igual que lo inexistente (R-15). Ningún mensaje menciona datos de otra privada. |
| **Datos personales** | N/A: esta historia no pide ni guarda datos personales. Los datos de residentes son de HU-02 y se revisan contra RNF-05 (minimización). |
| **Auditoría** (RNF-04) | Cada alta exitosa deja exactamente un `AuditEntry`, de forma atómica con el alta (R-16). Esta historia no edita ni borra registros. |
| **Límites de entrada** | Lote de 1 a 500 (R-07, R-11); identificador de 1 a 20 caracteres (R-04); nombre de 1 a 80 (R-08); se rechazan los caracteres Cc y Cf; normalización NFC y de espacios Unicode (R-02). |
| **Concurrencia** | La unicidad la garantiza la persistencia (R-12) y los lotes son atómicos (R-05). |
| **Credenciales y secretos** | N/A: la historia no maneja credenciales. |
| **Pases y caseta** | N/A: la historia no toca pases. |
| **Abuso y costo** | El tamaño del lote está acotado (R-11). No hay límite de operaciones por actor (P-06). |
| **Inyección de prompt** | N/A en esta versión: ningún texto de esta historia llega a un prompt. Cuando el asistente lea nombres o identificadores (S10), se revisará. |

## 7. Preguntas abiertas y cambios pendientes

| # | Tema | Estado |
|---|---|---|
| P-01 | ¿`"014"` y `"14"` son la misma vivienda? **Sí**: se eliminan los ceros a la izquierda (R-02, escenario 8). | Resuelta |
| P-02 | La jerarquía residencial → sección → privada **no está en el PRD v0.3**. Hay que reflejarla en el PRD (§3 y RF-01). | Cambio pendiente del PRD |
| P-03 | Renombrar o dar de baja una vivienda, con su registro en la bitácora. Está decidido; queda para la v0.3 de esta spec (tema 4). | Planificada |
| P-04 | Autenticación (login, activación y recuperación de acceso): ninguna historia la especifica. | Cambio pendiente del PRD |
| P-05 | ¿Se registran también los intentos **rechazados** (por ejemplo, fuera de ámbito) como señal de seguridad? En esta versión, no. | Abierta (S13) |
| P-06 | ¿Hace falta un límite de operaciones por actor y por tiempo? | Abierta (S13) |
| P-07 | Los ámbitos de la administración (`AdminScope`) y quién los asigna tienen que aparecer en HU-02 y en el PRD. | Cambio pendiente del PRD |
| P-08 | ¿Hace falta un **rol de plataforma** (operador de CondominIA) que dé de alta la residencial, sus secciones y su primera administración o mesa directiva, y que configure sus reglas? ¿"Mesa directiva" es lo mismo que "administración"? Hoy lo cubre el supuesto S-01. | Cambio pendiente del PRD |
| P-09 | Hallado al implementar: R-02 elimina los ceros **después** de quitar espacios, así que `"0 14"` queda `" 14"`, con un espacio al inicio. ¿Se vuelve a recortar o se rechaza? El código aplica R-02 tal como está escrita. | Abierta |

## 8. Historial

| Versión | Fecha | Cambio |
|---|---|---|
| 0.2 | 2026-11-23 | Implementada en `src/catalog/` con sus 29 escenarios en verde. Se añaden P-08 (rol de plataforma) y P-09 (ceros y espacios) |
| 0.2 | 2026-11-23 | Resultado de `revisar-spec` (nota C): actor y ámbitos (R-14), aislamiento sin revelar existencia (R-15), auditoría atómica (R-16), longitudes y caracteres (R-04, R-08), NFC y acentos (R-02, R-08), columna de origen, sección de seguridad, escenarios 14 a 29 y contrato ampliado (§5.2, §5.5, `Clock`) |
| 0.1 | 2026-11-20 | Contrato de datos e interfaz (§5) en inglés con glosario de equivalencias; R-08 sin eliminar ceros; R-11 (máx. 500), R-12 (unicidad en persistencia), R-13 (existencia); escenarios 9 a 13 |
| 0.1 | 2026-11-20 | Primera versión: contexto, reglas R-01 a R-10 y escenarios 1 a 8. En la revisión se confirmó R-08, se añadió R-10 y se resolvió P-01 (ceros a la izquierda) |
