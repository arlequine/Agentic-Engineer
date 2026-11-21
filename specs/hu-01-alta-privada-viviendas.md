# Spec · HU-01 · Dar de alta la privada y sus viviendas

| Campo | Valor |
|---|---|
| Versión | 0.1 |
| Fecha | 2026-11-20 |
| Historia | [HU-01](../docs/backlog/historias.md) · Ticket T-01 |
| Implementa | RF-01 (parcial: privada y viviendas) |
| Estado | Aprobada (2026-11-20) |

## 1. Contexto

La privada es la unidad de operación de CondominIA. Cada pase, entrada e incidencia queda ligada a **una vivienda** de **una privada**. Esta historia crea ese catálogo. Sin él no se puede invitar a nadie (HU-02) ni crear pases (HU-03).

**Ubicación jerárquica:** una privada pertenece a una **sección** y una sección pertenece a una **residencial**. Por debajo de la privada solo hay viviendas: no se modelan calles.

**Supuesto de esta versión:** la residencial y la sección ya existen y llegan como referencia. Esta historia no las crea.

**Alcance de esta versión:**
- Dar de alta una privada dentro de una sección.
- Dar de alta un lote de viviendas en una privada.

**Fuera de alcance:**
- Renombrar o dar de baja viviendas, con su registro en la bitácora. Está decidido y queda para la v0.2 de esta spec.
- La autorización: quién puede ejecutar el alta se define en el contrato de roles de HU-02.
- La persistencia, la interfaz de usuario y la autenticación (S7 y S8).

## 2. Lenguaje del dominio

El código se escribe en inglés. Esta tabla es la equivalencia oficial: no se usan sinónimos.

| Término | En código | Significado |
|---|---|---|
| Residencial | `Residential` | Conjunto que agrupa secciones |
| Sección | `Section` | Agrupación de privadas dentro de una residencial |
| Privada | `Subdivision` | Unidad de operación. Tiene guardias, viviendas y una caseta |
| Vivienda | `Unit` | Casa dentro de una privada, identificada por su **identificador** (texto) |
| Identificador | `label` | Texto de la vivienda tal como se escribió |
| Identificador normalizado | `normalizedLabel` | Forma canónica del identificador, la que se usa para comparar |
| Lote | `batch` | Conjunto de identificadores que se dan de alta en una sola operación |
| Administración | `admin` | Rol que gestiona el catálogo de la privada |

`Community` no se usa: es ambiguo entre privada, sección y residencial.

## 3. Reglas

| ID | Regla |
|---|---|
| R-01 | Toda vivienda pertenece exactamente a una privada, y toda privada a exactamente una sección. |
| R-02 | El identificador de una vivienda es **texto**. Para comparar se usa su forma normalizada: se quitan los espacios al inicio y al final, los espacios internos se colapsan a uno y todo se pasa a mayúsculas y se eliminan los ceros a la izquierda; si el identificador es solo ceros, queda `"0"`. Ejemplos: `" 14-b "` → `"14-B"`, `"014"` → `"14"`. |
| R-03 | El identificador normalizado es **único dentro de su privada**. Dos privadas distintas sí pueden tener una vivienda `"14"` cada una. |
| R-04 | Un identificador vacío después de normalizar no es válido. |
| R-05 | El alta de un lote es **todo o nada**. Si un solo identificador del lote es inválido, ya existe en la privada o se repite dentro del mismo lote, no se crea ninguna vivienda. |
| R-06 | Si el lote se rechaza, el error enumera **todos** los identificadores problemáticos, no solo el primero. |
| R-07 | Un lote vacío no es válido. |
| R-08 | El nombre de la privada es obligatorio y es **único dentro de su sección**. Para comparar nombres se quitan los espacios al inicio y al final, los internos se colapsan a uno y todo se pasa a mayúsculas. A diferencia de R-02, **no** se eliminan ceros. |
| R-09 | Se guarda el identificador tal como se escribió, para mostrarlo, y también su forma normalizada, para comparar. |
| R-10 | El nombre de la sección es único dentro de su residencial. Esta historia no crea secciones: la regla se garantiza donde se den de alta (fuera de alcance). |
| R-11 | Un lote admite como máximo **500** identificadores. |
| R-12 | La unicidad (R-03 y R-08) la garantiza la **persistencia**, no solo la validación previa. Si dos altas simultáneas chocan, la que pierde se rechaza con el mismo error y el mismo mensaje que un duplicado normal. |
| R-13 | El lote se da de alta en una privada existente, y la privada se da de alta en una sección existente. |

## 4. Criterios de aceptación

Los escenarios 1 y 2 vienen de HU-01. Del 3 al 13 salen de las reglas.

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

Escenario 12: identificador vacío (R-04, R-05)
  Cuando la administración da de alta las viviendas "1", "  " y "3"
  Entonces ve el error "Hay una vivienda sin identificador"
  Y no se crea ninguna vivienda

Escenario 13: alta simultánea (R-12)
  Dado que dos administradores dan de alta la vivienda 14 en "Los Robles" al mismo tiempo
  Cuando ambas operaciones terminan
  Entonces "Los Robles" tiene una sola vivienda 14
  Y una de las dos operaciones ve el error "La vivienda 14 ya existe"
```

## 5. Contrato de datos e interfaz

Solo firmas y tipos. Los errores de negocio son **valores** (`Result`). Las fallas de infraestructura (por ejemplo, la base de datos caída) se lanzan como excepciones y no forman parte de este contrato.

### 5.1 Tipos

```ts
type SectionId     = string & { readonly __brand: "SectionId" };
type SubdivisionId = string & { readonly __brand: "SubdivisionId" };
type UnitId        = string & { readonly __brand: "UnitId" };

type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

interface Subdivision {
  id: SubdivisionId;
  sectionId: SectionId;
  name: string;            // tal como se escribió
  normalizedName: string;  // R-08
}

interface Unit {
  id: UnitId;
  subdivisionId: SubdivisionId;
  label: string;           // tal como se escribió (R-09)
  normalizedLabel: string; // para comparar (R-02, R-03)
}

interface LabelPair { label: string; normalizedLabel: string; }
```

### 5.2 Alta de privada

```ts
interface CreateSubdivisionCommand { sectionId: SectionId; name: string; }

type CreateSubdivisionError =
  | { type: "EMPTY_NAME";        message: string }  // "Indica el nombre de la privada"
  | { type: "SECTION_NOT_FOUND"; message: string }  // "La sección no existe"
  | { type: "ALREADY_EXISTS";    message: string }; // "La privada Los Robles ya existe en esta sección"

function normalizeName(raw: string): string;                                   // R-08
function createSubdivision(cmd: CreateSubdivisionCommand, deps: { repo: SubdivisionRepository; ids: IdGenerator })
  : Promise<Result<Subdivision, CreateSubdivisionError>>;
```

### 5.3 Alta de lote de viviendas

```ts
interface CreateUnitBatchCommand { subdivisionId: SubdivisionId; labels: string[]; }
interface UnitBatchCreated       { subdivisionId: SubdivisionId; units: Unit[]; }

type RejectionReason = "INVALID" | "ALREADY_EXISTS" | "DUPLICATE_IN_BATCH";

interface UnitProblem {
  reason: RejectionReason;
  label: string;   // original, para mostrar
  message: string; // "La vivienda 14 ya existe"
}

const MAX_BATCH_SIZE = 500; // R-11

type CreateUnitBatchError =
  | { type: "EMPTY_BATCH";           message: string }               // R-07
  | { type: "BATCH_TOO_LARGE";       message: string; max: number }  // R-11
  | { type: "SUBDIVISION_NOT_FOUND"; message: string }               // R-13
  | { type: "BATCH_REJECTED";        problems: UnitProblem[] };      // R-05, R-06: todos

function normalizeLabel(raw: string): string;                                  // R-02
function validateBatch(labels: string[], existing: Set<string>)                // puro
  : Result<LabelPair[], CreateUnitBatchError>;
function createUnitBatch(cmd: CreateUnitBatchCommand, deps: { repo: UnitRepository; ids: IdGenerator })
  : Promise<Result<UnitBatchCreated, CreateUnitBatchError>>;
```

### 5.4 Puertos

```ts
interface SubdivisionRepository {
  sectionExists(id: SectionId): Promise<boolean>;
  existsByNormalizedName(sectionId: SectionId, normalizedName: string): Promise<boolean>;
  /** Atómico. Si viola la unicidad (R-12), devuelve conflicto. */
  save(s: Subdivision): Promise<Result<void, { conflict: true }>>;
}

interface UnitRepository {
  subdivisionExists(id: SubdivisionId): Promise<boolean>;
  findExistingNormalizedLabels(id: SubdivisionId, normalized: string[]): Promise<Set<string>>;
  /** Atómico, todo o nada (R-05). Si viola la unicidad (R-12), devuelve las etiquetas en conflicto. */
  saveBatch(units: Unit[]): Promise<Result<void, { conflicts: string[] }>>;
}

interface IdGenerator {
  newSubdivisionId(): SubdivisionId;
  newUnitId(): UnitId;
}
```

### 5.5 Orden de validación

1. `EMPTY_BATCH` y `BATCH_TOO_LARGE`: se comprueban sin consultar nada.
2. `SUBDIVISION_NOT_FOUND`.
3. Por cada identificador, `INVALID` y `DUPLICATE_IN_BATCH`; después `ALREADY_EXISTS` contra lo que ya está guardado. Todos se acumulan en `BATCH_REJECTED`.
4. `saveBatch`. Si hay `conflicts`, se traducen a `ALREADY_EXISTS` dentro de `BATCH_REJECTED` (R-12).

## 6. Preguntas abiertas y cambios pendientes

| # | Tema | Estado |
|---|---|---|
| P-01 | ¿`"014"` y `"14"` son la misma vivienda? **Sí**: se eliminan los ceros a la izquierda (R-02, escenario 8). | Resuelta |
| P-02 | La jerarquía residencial → sección → privada **no está en el PRD v0.3**. Hay que reflejarla en el PRD (§ actores y RF-01). | Cambio pendiente del PRD |
| P-03 | Renombrar o dar de baja una vivienda, con su registro en la bitácora. Está decidido; queda para la v0.2 de esta spec (tema 4). | Planificada |
| P-04 | Autenticación (login, activación y recuperación de acceso): ninguna historia la especifica. | Cambio pendiente del PRD |

## 7. Historial

| Versión | Fecha | Cambio |
|---|---|---|
| 0.1 | 2026-11-20 | Contrato de datos e interfaz (§5) en inglés con glosario de equivalencias; R-08 sin eliminar ceros; R-11 (máx. 500), R-12 (unicidad en persistencia), R-13 (existencia); escenarios 9 a 13 |
| 0.1 | 2026-11-20 | Primera versión: contexto, reglas R-01 a R-10 y escenarios 1 a 8. En la revisión se confirmó R-08, se añadió R-10 y se resolvió P-01 (ceros a la izquierda) |
