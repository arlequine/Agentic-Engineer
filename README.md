# Agentic Engineer

Proyecto de estudio y portafolio sobre **desarrollo de software con agentes de IA**: harness de Claude Code, producto (PRD y specs), calidad (TDD, evals, guardarraíles), producto con IA (RAG y agente propio) y DevSecOps.

El proyecto de práctica es **TaskFlow AI**. Se construye una sesión a la vez: cada sesión agrega lo suyo al repositorio y queda guardada en su propia rama.

## Cómo está organizado

| Archivo / carpeta | Para qué sirve |
|---|---|
| [`CONTEXT.md`](CONTEXT.md) | Fuente de verdad del aprendizaje: estado actual, temario, glosario, dependencias, hilo conductor y bitácora |
| [`PLAN.md`](PLAN.md) | Calendario semanal y guía para adaptarlo a otra persona |
| [`CLAUDE.md`](CLAUDE.md) | Instrucciones que el agente carga en cada sesión |
| `docs/lessons/` | Notas, ejercicios y verificación de cada sesión (vive en las ramas de sesión) |

El resto de carpetas aparece conforme avanzan las sesiones. La estructura final esperada está en la sección 7 de `CONTEXT.md`.

## Una rama por sesión

`main` tiene el estado más reciente. Cada sesión se trabaja en `sesion-NN-slug`, se integra a `main` con un PR y la rama se conserva como foto de ese momento.

| Módulo | Sesión | Rama | Estado |
|---|---|---|---|
| 1 · Desarrollo con agentes de IA | S1 Harness Engineering | `sesion-01-harness` | En preparación |
| | S2 Del problema al PRD y al backlog | `sesion-02-prd` | Pendiente |
| | S3 Spec Driven Development | `sesion-03-sdd` | Pendiente |
| 2 · Calidad y gobierno del agente | S4 Revisión adversarial, TDD y documentación viva | `sesion-04-tdd` | Pendiente |
| | S5 MCP y Skills propios | `sesion-05-mcp-skills` | Pendiente |
| | S6 Guardarraíles y evals del harness | `sesion-06-guardarrailes-evals` | Pendiente |
| 3 · Backend y frontend | S7 Backend | `sesion-07-backend` | Pendiente |
| | S8 Frontend y design system | `sesion-08-frontend` | Pendiente |
| 4 · RAG y agente propio | S9 RAG y pgvector | `sesion-09-rag` | Pendiente |
| | S10 Del chatbot al agente | `sesion-10-agente` | Pendiente |
| | S11 Memoria y aprobación humana | `sesion-11-memoria` | Pendiente |
| | S12 Controles y evaluación del agente | `sesion-12-controles-evals` | Pendiente |
| 5 · DevSecOps | S13 Seguridad del producto y del agente | `sesion-13-seguridad` | Pendiente |
| | S14 CI/CD y observabilidad | `sesion-14-cicd-observabilidad` | Pendiente |
| 6 · Pipeline completo | S15 War Room | `sesion-15-war-room` | Pendiente |

## Usar este repositorio para estudiar

1. Haz un fork y vacía la bitácora de `CONTEXT.md`.
2. Llena tu perfil en `CONTEXT.md` y tus parámetros en `PLAN.md`.
3. Abre el repositorio con Claude Code. `CLAUDE.md` le indica leer `CONTEXT.md` y trabajar una sesión a la vez.
