---
name: revisar-spec
description: Revisa una spec de historia de CondominIA (carpeta specs/) antes de implementarla. Aplica cinco lentes (estructura y trazabilidad, reglas y criterios, lenguaje y coherencia con el PRD, seguridad y privacidad, alcance), reporta hallazgos con evidencia y corrección mínima, y asigna una nota de A a D. Úsala al terminar o cambiar una spec, y siempre antes de implementarla. Para crear una spec nueva, parte de plantilla-spec.md.
---

# Revisar spec

## Propósito
Responder con evidencia: **¿un agente podría implementar y verificar esta spec sin adivinar nada y sin este chat?**

La skill **no reescribe la spec**. Señala los vacíos y propone la corrección mínima; los cambios los decide el estudiante.

## Entradas
Localízalas sin inventar rutas:
- La spec que se revisa: `specs/<archivo>.md`. Si no se indica cuál, pregunta.
- Su historia en `docs/backlog/historias.md` y su ticket en `docs/backlog/tickets.md`.
- `docs/prd/prd.md`: RF, RN, RNF, actores y preguntas abiertas.
- `plantilla-spec.md` y `seguridad.md`, que están en esta misma carpeta.
- Otras specs de `specs/` que la spec cite o de las que dependa.

Si falta un artefacto, regístralo como hallazgo. No lo reconstruyas de memoria.

## Proceso
1. Lee la spec completa y luego la historia, el ticket y las secciones del PRD que cita.
2. Aplica las cinco lentes en orden. Cada criterio queda como **Cumple**, **Parcial**, **Falta** o **N/A**, con evidencia (sección o ID de la spec o del PRD).
3. Para cada Parcial o Falta, redacta un hallazgo con su severidad y su corrección mínima.
4. Asigna la nota.
5. Entrega el reporte en el chat. No escribas archivos ni modifiques la spec salvo que te lo pidan.

## Lentes
Los criterios con (*) son críticos.

### 1. Estructura y trazabilidad
| Criterio | Qué buscar |
|---|---|
| E1 (*) Secciones | Están todas las secciones de `plantilla-spec.md`. Si una sección se aplaza, lo dice de forma explícita (por ejemplo, "se define en el tema 2"). |
| E2 (*) Origen | Cabecera con historia, ticket, RF que implementa, versión y estado. |
| E3 Reglas trazadas | Cada regla que viene del PRD cita su RF, RN o RNF. Las reglas propias de la spec se reconocen como tales. |
| E4 (*) Escenarios trazados | Cada escenario nuevo indica las reglas que cubre. Los escenarios de la historia original se conservan sin cambios. |
| E5 Historial | Cada cambio de versión tiene fecha y descripción. |

### 2. Reglas y criterios
| Criterio | Qué buscar |
|---|---|
| R1 (*) Reglas declarativas | Cada regla usa "siempre", "nunca", "exactamente", "es único dentro de…". Nada de "se puede" ni "debería, si es posible". |
| R2 (*) Sin contradicciones | Ninguna regla contradice a otra, ni a un escenario, ni al PRD. |
| R3 (*) Cobertura | **Toda regla tiene al menos un escenario** que la ejercita. Arma la matriz regla × escenario e informa las reglas huérfanas. |
| R4 (*) Bordes | Hay escenarios para: vacío, duplicado, normalización, límites (mínimo y máximo), fallo parcial y estado sin cambios tras un error. |
| R5 Errores literales | Cada error tiene su texto exacto entre comillas, entendible para el usuario y sin jerga técnica. El mismo motivo usa siempre el mismo texto. |
| R6 Observable | Cada "Entonces" se puede comprobar desde fuera: un dato, un mensaje o un estado. No vale "el sistema procesa correctamente". |

### 3. Lenguaje y coherencia
| Criterio | Qué buscar |
|---|---|
| L1 (*) Glosario | Todo término de dominio está en el glosario de la spec y se usa igual en todo el documento. |
| L2 Lenguaje del PRD | Los términos coinciden con el PRD (actores: administración, residente, guardia). Si la spec introduce un término nuevo, lo marca. |
| L3 (*) Cambios pendientes del PRD | Todo lo que la spec decide y el PRD no refleja aparece en "Preguntas abiertas y cambios pendientes". |
| L4 Preguntas abiertas | Ninguna decisión queda escondida en el texto. Cada pregunta tiene su estado: abierta, resuelta o planificada. |

### 4. Seguridad y privacidad
Aplica `seguridad.md` completo. Cada punto queda como Cumple, Parcial, Falta o N/A, y todo N/A lleva su motivo. Es Falta crítica si la spec no dice **quién** puede ejecutar la operación (aunque lo delegue a otra spec, la referencia tiene que existir) o si deja abierta una vía para tocar datos de otra privada o de otra vivienda.

### 5. Alcance
| Criterio | Qué buscar |
|---|---|
| A1 (*) Dentro y fuera | "Alcance" y "Fuera de alcance" son explícitos y no se solapan. |
| A2 Sesión | No se cuela trabajo de otra sesión del temario (persistencia real → S7, interfaz → S8, seguridad avanzada → S13). Si aparece, márcalo. |
| A3 Supuestos | Cada supuesto está escrito como tal y se puede aceptar o rechazar. |

## Severidad de los hallazgos
| Severidad | Significado |
|---|---|
| **Bloqueante** | Falta un crítico: el agente tendría que adivinar algo que cambia el comportamiento o la seguridad. |
| **Importante** | Parcial en un crítico o Falta en uno no crítico: se puede implementar con un supuesto escrito. |
| **Menor** | Redacción, consistencia o trazabilidad que no cambia el comportamiento. |

## Nota
| Nota | Significado | Siguiente paso |
|---|---|---|
| **A** | Lista. Todos los críticos cumplen. | Implementar. |
| **B** | Lista con supuestos. Ningún bloqueante; los importantes tienen un supuesto escrito y aceptado. | Implementar y dejar los supuestos registrados en la spec. |
| **C** | Necesita decisiones. Hay al menos un bloqueante, pero el alcance existe. | Resolver los bloqueantes y volver a revisar. |
| **D** | Todavía no es una spec. No hay alcance o no hay criterios verificables. | Volver a la historia. |

Solo una spec con nota **A** o **B** pasa a implementación.

## Formato de salida
1. **Nota** y una frase que la justifique.
2. **Hallazgos**, ordenados de bloqueante a menor: `ID · severidad · lente/criterio · evidencia · corrección mínima`.
3. **Matriz de cobertura** regla × escenario, con las reglas huérfanas resaltadas.
4. **Tabla por lente**: criterio · estado · evidencia.
5. **Preguntas para el estudiante**: las decisiones que solo él puede tomar, en una lista corta.

## Reglas
- No apruebes un criterio sin evidencia citada.
- No inventes requisitos ni decisiones. Si algo no está, es un hallazgo.
- Sugiere la corrección **mínima**; no rediseñes la historia.
- Si propones una regla nueva, márcala como *propuesta, pendiente de aprobación*.
- Español, Markdown limpio.
