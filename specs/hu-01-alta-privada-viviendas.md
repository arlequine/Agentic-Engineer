# Spec · HU-01 · Dar de alta la privada y sus viviendas

| Campo | Valor |
|---|---|
| Versión | 0.1 (borrador, pendiente de revisión) |
| Fecha | 2026-11-20 |
| Historia | [HU-01](../docs/backlog/historias.md) · Ticket T-01 |
| Implementa | RF-01 (parcial: privada y viviendas) |
| Estado | Borrador |

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

| Término | Significado |
|---|---|
| Residencial | Conjunto que agrupa secciones |
| Sección | Agrupación de privadas dentro de una residencial |
| Privada | Unidad de operación. Tiene guardias, viviendas y una caseta |
| Vivienda | Casa dentro de una privada, identificada por su **identificador** (texto) |
| Identificador normalizado | Forma canónica del identificador, la que se usa para comparar |
| Lote | Conjunto de identificadores que se dan de alta en una sola operación |
| Administración | Rol que gestiona el catálogo de la privada |

## 3. Reglas

| ID | Regla |
|---|---|
| R-01 | Toda vivienda pertenece exactamente a una privada, y toda privada a exactamente una sección. |
| R-02 | El identificador de una vivienda es **texto**. Para comparar se usa su forma normalizada: se quitan los espacios al inicio y al final, los espacios internos se colapsan a uno y todo se pasa a mayúsculas. Ejemplo: `" 14-b "` → `"14-B"`. |
| R-03 | El identificador normalizado es **único dentro de su privada**. Dos privadas distintas sí pueden tener una vivienda `"14"` cada una. |
| R-04 | Un identificador vacío después de normalizar no es válido. |
| R-05 | El alta de un lote es **todo o nada**. Si un solo identificador del lote es inválido, ya existe en la privada o se repite dentro del mismo lote, no se crea ninguna vivienda. |
| R-06 | Si el lote se rechaza, el error enumera **todos** los identificadores problemáticos, no solo el primero. |
| R-07 | Un lote vacío no es válido. |
| R-08 | El nombre de la privada es obligatorio y, normalizado igual que en R-02, es **único dentro de su sección**. |
| R-09 | Se guarda el identificador tal como se escribió, para mostrarlo, y también su forma normalizada, para comparar. |

## 4. Criterios de aceptación

Los escenarios 1 y 2 vienen de HU-01. Del 3 al 7 salen de las reglas.

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
```

## 5. Contrato de datos e interfaz

*Se define en el tema 2 de la sesión.*

## 6. Preguntas abiertas y cambios pendientes

| # | Tema | Estado |
|---|---|---|
| P-01 | ¿`"014"` y `"14"` son la misma vivienda? Con R-02 tal como está, **no**. | Abierta |
| P-02 | La jerarquía residencial → sección → privada **no está en el PRD v0.3**. Hay que reflejarla en el PRD (§ actores y RF-01). | Cambio pendiente del PRD |
| P-03 | Renombrar o dar de baja una vivienda, con su registro en la bitácora. Está decidido; queda para la v0.2 de esta spec (tema 4). | Planificada |
| P-04 | Autenticación (login, activación y recuperación de acceso): ninguna historia la especifica. | Cambio pendiente del PRD |

## 7. Historial

| Versión | Fecha | Cambio |
|---|---|---|
| 0.1 | 2026-11-20 | Primera versión: contexto, reglas R-01 a R-09 y escenarios 1 a 7 |
