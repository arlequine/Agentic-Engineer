# Sesión 1 · Harness Engineering: el entorno de trabajo del agente

| Campo | Valor |
|---|---|
| Módulo | 1 · Desarrollo con agentes de IA |
| Rama | `sesion-01-harness` |
| Tiempo estimado | 2.5 h (ver `PLAN.md`) |
| Estado | Completada (2026-11-12) · PR #1 fusionado en `main` |

## Antes de empezar (≤ 30 min)
- [ ] Repasar conceptos de LLM: tokens, ventana de contexto y su degradación, tool use, costo por token.
- [ ] Claude Code instalado y probado en este repositorio.
- [ ] Estar en la rama `sesion-01-harness`.

## Punto de partida
Repositorio con `CONTEXT.md`, `PLAN.md`, `README.md` y un `CLAUDE.md` mínimo.

## Temas
- [x] Claude Code pieza por pieza: CLAUDE.md, skills, hooks, subagentes, plan mode y MCP — *plan mode queda como lectura pendiente*
- [x] Qué es un harness y por qué cambia el resultado al trabajar con agentes
- [x] Demo comparada: la misma tarea de TaskFlow AI con y sin harness
- [x] Del ticket al pull request: plan, implementación y revisión automática
- [ ] Panorama de agentes de código y criterio para elegir entre ellos — *lectura pendiente*

## Ejercicios
_Se definen al iniciar la sesión, uno por tema._

## Entregable de salida
- `CLAUDE.md` ampliado y carpeta `.claude/` versionados (skills, hooks, subagentes, configuración MCP).
- Comparativa documentada de la misma tarea con y sin harness.
- Un PR con plan, implementación y revisión automática.

**Hecho cuando:** el PR existe y la revisión automática corrió.

## Conexión con lo siguiente
El harness se usa en todas las sesiones; sus reglas se auditan contra el historial de git en la Sesión 6.

## Notas de la sesión
- Comparativa con y sin harness: [`comparativa.md`](comparativa.md).
- Revisión automática del PR: comentario de `pr-review` en el PR #1.
- Detalle del cierre: bitácora de `CONTEXT.md` (2026-11-12).
