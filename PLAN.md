# PLAN.md · Plan de estudio semanal

> Plan para recorrer las 15 sesiones del temario. Está pensado para que cualquier persona lo adapte: cambia los [parámetros](#1-parámetros), recalcula con la [guía de adaptación](#5-cómo-adaptar-este-plan) y ajusta las fechas.
> Contenido de cada sesión, dependencias y entregables detallados: ver [`CONTEXT.md`](CONTEXT.md).

## Índice
- [1. Parámetros](#1-parámetros)
- [2. Calendario](#2-calendario)
- [3. Detalle por sesión](#3-detalle-por-sesión)
- [4. Rutina de cada sesión](#4-rutina-de-cada-sesión)
- [5. Cómo adaptar este plan](#5-cómo-adaptar-este-plan)
- [6. Si te atrasas](#6-si-te-atrasas)

---

## 1. Parámetros

Valores del plan actual. Quien lo adapte cambia solo esta tabla y recalcula.

| Parámetro | Valor actual |
|---|---|
| Perfil | Full-stack senior |
| Horas por semana | 10 h |
| Sesiones por semana | 3 |
| Días de estudio | Lunes, miércoles y viernes; sábado como reserva (la semana de arranque usa jueves y viernes) |
| Fecha de inicio | Jueves 2026-11-12 (el repaso de prerrequisitos va en los primeros 30 min de S1) |
| Fecha de término | Lunes 2026-12-14 (S15) |
| Fecha objetivo | Antes del 2026-12-31 |
| Semanas necesarias | 5 (más la semana de arranque) |
| Holgura | Del 15 al 31 de diciembre |

**Horas estimadas por sesión (perfil senior).** Son estimaciones de partida, no medidas. Al cerrar cada sesión, anota las horas reales en la bitácora de `CONTEXT.md` para corregirlas.

| Sesión | h | Sesión | h | Sesión | h |
|---|---|---|---|---|---|
| S1 | 2.5 | S6 | 4 | S11 | 3 |
| S2 | 3 | S7 | 3.5 | S12 | 3.5 |
| S3 | 3.5 | S8 | 3.5 | S13 | 3 |
| S4 | 4 | S9 | 3 | S14 | 4 |
| S5 | 3.5 | S10 | 4 | S15 | 2 |

**Total estimado: ~50 h** (≈ 10 h/semana × 5 semanas).

---

## 2. Calendario

| Semana | Fechas | Sesiones | Horas | Checkpoints que se alcanzan |
|---|---|---|---|---|
| Arranque | 12–14 nov | S1 (jue 12) · S2 (vie 13) | 5.5 | — |
| 1 | 16–21 nov | S3 (lun 16) · S4 (mié 18) · S5 (vie 20) | 11 ⚠️ | **Módulo 1** (lun 16): harness, PRD, backlog y primera historia desde spec |
| 2 | 23–28 nov | S6 (lun 23) · S7 (mié 25) · S8 (vie 27) | 11 ⚠️ | **Módulo 2** (lun 23): TDD, MCP, skills y guardarraíles en CI · **Módulo 3** (vie 27): app completa con E2E |
| 3 | 30 nov–5 dic | S9 (lun 30) · S10 (mié 2) · S11 (vie 4) | 10 | — |
| 4 | 7–12 dic | S12 (lun 7) · S13 (mié 9) · S14 (vie 11) | 10.5 | **Módulo 4** (lun 7): agente con memoria, controles y evals · **Módulo 5** (vie 11): pipeline y observabilidad |
| 5 | 14 dic | S15 (lun 14) | 2 | **Módulo 6** (lun 14): versión final |
| Holgura | 15–31 dic | — | — | Recuperar atrasos; sesión abierta del Módulo 6 por cuenta propia |

⚠️ **Las semanas 1 y 2 rondan 11 h**, una más que tu límite. Usa los sábados 21 y 28 de noviembre como reserva, o pasa lo que no alcance a la holgura. La semana de arranque, más ligera, ayuda a llegar con ventaja.

---

## 3. Detalle por sesión

Formato: **objetivo** · **entregable** (cómo saber que está hecho) · **rama** · **preparación** (de la sección 10 de `CONTEXT.md`).

### Módulo 1 · S1–S3 (12–16 nov)

| Sesión | Objetivo | Entregable / hecho cuando… | Rama | Preparación |
|---|---|---|---|---|
| S1 Harness | Entender y montar el harness de Claude Code | `CLAUDE.md` + `.claude/` versionados, comparativa con/sin harness, 1 PR con revisión automática | `sesion-01-harness` | Conceptos de LLM; Claude Code instalado |
| S2 PRD | Pasar del problema al PRD y al backlog | `docs/prd/` versionado; backlog con historias G/W/T, prioridad y dependencias | `sesion-02-prd` | JTBD, G/W/T, MVP y priorización básica |
| S3 SDD | Implementar una historia desde su spec | `specs/` con una historia implementada que cumple sus criterios | `sesion-03-sdd` | — |

### Módulo 2 · S4–S6 (18–23 nov)

| Sesión | Objetivo | Entregable / hecho cuando… | Rama | Preparación |
|---|---|---|---|---|
| S4 TDD | Tests como contrato y revisión adversarial | Suite Vitest en verde, sin falsa cobertura; ADR y docs en el PR | `sesion-04-tdd` | Vitest; mutation testing (concepto) |
| S5 MCP y Skills | Extender el harness | Servidor MCP propio conectado; Skill de Tech Lead que produce hallazgos | `sesion-05-mcp-skills` | Especificación MCP |
| S6 Guardarraíles y evals | Medir si el harness funciona | CI con guardarraíles; evals con/sin harness. Un PR que rompe una regla queda bloqueado | `sesion-06-guardarrailes-evals` | — |

### Módulo 3 · S7–S8 (25–27 nov) y arranque del Módulo 4 · S9 (30 nov)

| Sesión | Objetivo | Entregable / hecho cuando… | Rama | Preparación |
|---|---|---|---|---|
| S7 Backend | Ejecutar el contrato de datos | Migraciones aplicadas; capa de dominio; tests de RLS en verde; seed | `sesion-07-backend` | Next.js 16; RLS |
| S8 Frontend | Del boceto al design system | UI conectada sin errores silenciosos; design system; E2E en verde | `sesion-08-frontend` | — |
| S9 RAG | Darle memoria propia al producto | Búsqueda semántica que respeta RLS; indexación automática | `sesion-09-rag` | Embeddings; índices vectoriales |

### Módulo 4 · S10–S12 (2–7 dic)

| Sesión | Objetivo | Entregable / hecho cuando… | Rama | Preparación |
|---|---|---|---|---|
| S10 Agente | Construir el bucle del agente | Agente en el website con búsqueda y MCP; cambio de modelo probado | `sesion-10-agente` | Modelo de LangGraph |
| S11 Memoria | Memoria y aprobación humana | Retoma conversaciones; pausa ante acciones sensibles | `sesion-11-memoria` | — |
| S12 Controles | Controlar y evaluar el agente | Middleware y controles activos; trazas; 20 casos evaluados con juez | `sesion-12-controles-evals` | OWASP para LLM |

### Módulos 5 y 6 · S13–S15 (9–14 dic)

| Sesión | Objetivo | Entregable / hecho cuando… | Rama | Preparación |
|---|---|---|---|---|
| S13 Seguridad | Reporte de seguridad del producto y del agente | Reporte en `docs/security/`; sin secretos expuestos | `sesion-13-seguridad` | Prompt injection |
| S14 CI/CD | Pipeline con puertas y observabilidad | Pipeline completo; merges bloqueados por umbral; tablero | `sesion-14-cicd-observabilidad` | SLOs; Core Web Vitals |
| S15 War Room | Ensayo completo de spec a producción | Funcionalidad urgente en producción; postmortem; versión final etiquetada | `sesion-15-war-room` | Repasar todo `CONTEXT.md` |

---

## 4. Rutina de cada sesión

Reparto sugerido para una sesión de ~3.3 h:

| Bloque | Tiempo | Qué se hace |
|---|---|---|
| Arranque | 10 min | Leer `CONTEXT.md`, crear la rama `sesion-NN-slug` desde `main`, confirmar el punto de partida |
| Teoría | 30–40 min | Explicación de los temas y ejercicio corto por tema |
| Construcción | 2 h | Construir el entregable paso a paso |
| Verificación | 20 min | Comprobar el entregable contra el hilo conductor |
| Cierre | 15 min | Actualizar `CONTEXT.md` (estado, casilla, bitácora con horas reales), PR a `main` sin borrar la rama |

---

## 5. Cómo adaptar este plan

1. **Copia el repositorio** (fork) y vacía la bitácora de `CONTEXT.md`.
2. **Llena tus parámetros** en la [sección 1](#1-parámetros) y el perfil en `CONTEXT.md`.
3. **Ajusta las horas por sesión** según tu perfil (multiplicadores *sugeridos*, a calibrar con tus horas reales):

   | Perfil | Multiplicador | Total aprox. |
   |---|---|---|
   | Senior con experiencia en agentes | × 0.8 | ~40 h |
   | Full-stack senior | × 1.0 | ~50 h |
   | Full-stack intermedio | × 1.4 | ~70 h |
   | Junior o sin experiencia en backend | × 2.0 | ~100 h |

4. **Calcula las semanas:** `semanas = total de horas ÷ horas por semana`, redondeando hacia arriba. Agrega una semana de holgura.
5. **Elige el ritmo** según cuántos días puedes estudiar:

   | Sesiones por semana | Semanas para 15 sesiones | Horas por sesión (con 10 h/sem) |
   |---|---|---|
   | 2 | 8 | ~5 |
   | 3 | 5 | ~3.3 |
   | 4 | 4 | ~2.5 (sesiones largas pueden partirse en dos días) |

6. **Respeta el orden y las dependencias** (sección 5 de `CONTEXT.md`). Si alguien ya domina un tema (por ejemplo, TDD), puede comprimir esa sesión, pero no saltarse su entregable, porque la siguiente sesión lo usa.
7. **Reasigna las fechas** en el [calendario](#2-calendario) y las ramas se mantienen igual.

---

## 6. Si te atrasas

- **1 sesión de atraso:** usa el día de reserva de la semana (sábado).
- **2 o más:** usa la holgura de fin de mes; no comprimas dos sesiones pesadas el mismo día.
- **Recorte permitido:** reduce la teoría y los ejercicios opcionales. **Nunca recortes el entregable de salida**: es la entrada de la siguiente sesión.
- **Registra el ajuste** en la bitácora de `CONTEXT.md` con la decisión y su motivo.
