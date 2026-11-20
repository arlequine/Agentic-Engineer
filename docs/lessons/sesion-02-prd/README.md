# Sesión 2 · Del problema al PRD y al backlog

| Campo | Valor |
|---|---|
| Módulo | 1 · Desarrollo con agentes de IA |
| Rama | `sesion-02-prd` |
| Tiempo estimado | 3 h (ver `PLAN.md`) |
| Estado | Completada (2026-11-19) · PR pendiente de fusionar en `main` |

## Antes de empezar
- [x] Harness de la Sesión 1 en `main` y rama `sesion-02-prd` creada.
- [x] Repaso de JTBD, Given/When/Then, MVP y priorización básica: se hace dentro de cada tema, no como bloque aparte.

## Punto de partida
Harness de la Sesión 1: `CLAUDE.md`, hooks `proteger-git` y `estado-actual`, skill `cierre-de-sesion`, subagente `pr-review` y MCP con Playwright. Todavía no hay producto definido.

## Temas
- [x] Mentalidad de producto: del developer que implementa al que decide qué se construye
- [x] Job-to-be-done, benchmark, competencia y pricing con deep research
- [x] El PRD versionado como fuente de verdad del proyecto
- [x] Épicas, historias de usuario y criterios Given/When/Then
- [x] Requisitos no funcionales y tickets con prioridad y dependencias

## Ejercicios
Uno por tema, propuesto antes de resolverlo.

1. **Mentalidad de producto:** formular el problema en una frase JTBD.
   - v1: un solo JTBD para el residente de una privada (reservar amenidades y autorizar accesos).
   - Revisión: eran dos jobs, la frase traía la solución ("desde mi celular") y faltaban actores (caseta, administración, visitante).
   - Decisión: separar en **Job A (accesos)** y **Job B (amenidades)**, y trabajar primero el Job A.

## Entregable de salida
- `docs/research/`: JTBD, competencia y pricing.
- `docs/prd/`: PRD versionado.
- `docs/backlog/`: épicas, historias con criterios Given/When/Then, RNF y tickets con prioridad y dependencias.

**Hecho cuando:** cada historia tiene criterios G/W/T y cada ticket tiene prioridad y dependencias.

## Conexión con lo siguiente
Las historias se convierten en specs (S3); los criterios G/W/T, en tests (S4); los RNF, en seguridad y SLOs (S13–S14).

## Notas de la sesión
- Producto: **CondominIA**, app de gestión de accesos y amenidades para privadas residenciales. TaskFlow AI queda como nombre del proyecto de aprendizaje. *Pendiente al cierre:* reflejarlo en `CONTEXT.md` y `README.md`. *Pendiente para S9–S10:* el reglamento de la privada como corpus de RAG y un asistente para dar de alta visitas como agente propio.
- Calendario: la sesión arranca con unas dos sesiones de atraso respecto a `PLAN.md` (estaba planeada para el 13 nov). El reajuste se propone al cerrar.
