# Sesión 2 · Del problema al PRD y al backlog

| Campo | Valor |
|---|---|
| Módulo | 1 · Desarrollo con agentes de IA |
| Rama | `sesion-02-prd` |
| Tiempo estimado | 3 h (ver `PLAN.md`) |
| Estado | En curso (iniciada 2026-11-19) |

## Antes de empezar (≤ 30 min)
- [ ] Repasar JTBD, formato de historias Given/When/Then, qué es un MVP y priorización básica (se repasa dentro de cada tema).
- [x] Harness de la Sesión 1 funcionando.
- [x] Estar en la rama `sesion-02-prd`.

## Punto de partida
Harness de la Sesión 1 en `main`: `CLAUDE.md`, hooks (`proteger-git`, `estado-actual`), skill `cierre-de-sesion`, subagente `pr-review` y MCP con Playwright.

## Temas
- [ ] Mentalidad de producto: del developer que implementa al que decide qué se construye
- [ ] Job-to-be-done, benchmark, competencia y pricing con deep research
- [ ] El PRD versionado como fuente de verdad del proyecto
- [ ] Épicas, historias de usuario y criterios Given/When/Then
- [ ] Requisitos no funcionales y tickets con prioridad y dependencias

## Ejercicios
_Se definen al iniciar cada tema, uno por tema._

1. **Mentalidad de producto:** formular el problema de TaskFlow AI en una frase JTBD.

## Entregable de salida
- `docs/research/`: JTBD, competencia y pricing.
- `docs/prd/`: PRD versionado.
- `docs/backlog/`: épicas, historias con criterios Given/When/Then, RNF y tickets con prioridad y dependencias.

**Hecho cuando:** cada historia tiene criterios G/W/T y cada ticket tiene prioridad y dependencias.

## Conexión con lo siguiente
Las historias se convierten en specs (S3); los criterios G/W/T, en tests (S4); los RNF, en seguridad y SLOs (S13–S14).

## Notas de la sesión
- Calendario: la sesión empieza con unas dos sesiones de atraso respecto a `PLAN.md` (planeada para el 13 nov). El reajuste se propone al cerrar.
