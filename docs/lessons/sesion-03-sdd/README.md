# Sesión 3 · Spec Driven Development: de la spec al código

| Campo | Valor |
|---|---|
| Módulo | 1 · Desarrollo con agentes de IA |
| Rama | `sesion-03-sdd` |
| Tiempo estimado | 3.5 h (ver `PLAN.md`) |
| Estado | Completada (2026-11-23) |

## Antes de empezar
- [x] Sesión 2 fusionada en `main` (PR #3) y rama `sesion-03-sdd` creada.
- [x] Releer [`docs/backlog/tickets.md`](https://github.com/arlequine/condominia/blob/main/docs/backlog/tickets.md) y la cadena Must T-01 → T-04.
- [x] Decidir el reajuste del calendario (ver las notas de la sesión).

## Punto de partida
- PRD v0.3 de CondominIA en [`docs/prd/prd.md`](https://github.com/arlequine/condominia/blob/main/docs/prd/prd.md).
- 11 historias con criterios G/W/T en [`docs/backlog/historias.md`](https://github.com/arlequine/condominia/blob/main/docs/backlog/historias.md).
- 17 tickets con prioridad y dependencias.
- Todavía no hay código ni stack definido.

## Temas
- [x] La spec como contrato: contexto, reglas y criterios de aceptación
- [x] Contratos de datos e interfaces antes de la lógica
- [x] Implementar una historia: proponer, revisar el contrato y aplicar
- [x] Evolucionar una spec existente y verificar que el código la cumple
- [x] Cuándo no conviene usar Spec Driven Development

## Ejercicios
Se definen al iniciar cada tema, uno por tema.

**Ejercicio de calentamiento (para empezar temprano):** antes de abrir la sesión, contesta en 2–3 líneas: *¿qué historia elegirías para implementar primero desde una spec, y por qué?* Las candidatas naturales son:
- **HU-01** (T-01): la primera de la cadena y sin dependencias;
- **HU-03** (T-04): el núcleo de los pases y lo que desbloquea la caseta y el asistente.

Piensa en dos cosas: cuál tiene reglas más interesantes para una spec y cuál se puede implementar sin decidir media arquitectura.

## Entregable de salida
- `specs/` con al menos una historia implementada que cumple su spec (en el repo [`condominia`](https://github.com/arlequine/condominia)).
- Un criterio escrito de cuándo no usar SDD.

**Hecho cuando:** el código satisface los criterios de la spec.

## Conexión con lo siguiente
Los contratos se convierten en migraciones (S7) y los criterios, en tests (S4).

## Notas de la sesión
- **Separación de repositorios (2026-11-23):** el producto se mudó al repo privado [`condominia`](https://github.com/arlequine/condominia) (`~/condominia`), con su historial: `docs/prd`, `docs/backlog`, `docs/research`, `specs/` y `src/`. El repo nuevo tiene su propio harness: `CLAUDE.md`, el hook de git, la skill `revisar-spec` y el agente `pr-review`. Aquí quedan las lecciones, `CONTEXT.md`, `PLAN.md` y la skill `cierre-de-sesion`. Es un cambio *sugerido*, fuera del temario.
- **Alcance acordado (2026-11-20):** spec de E1 (HU-01 completa y HU-02 como contrato de roles y permisos); se implementa **HU-01** como lógica de dominio pura en TypeScript, sin framework ni BD. Fuera de alcance: login, sesiones e invitación real (S7), RLS y aislamiento T-03 (S7), seguridad (S13).
- **Vacío detectado en el PRD:** ninguna historia especifica la autenticación (login, sesión, recuperación de acceso). Se registra como cambio pendiente; candidato para el tema 4 (evolucionar una spec).
- **Alcance a vigilar:** la S3 necesita algo de código para "implementar una historia", pero el stack completo (Next.js y Supabase) llega en la S7. Al iniciar hay que acordar el mínimo de stack que pide la historia elegida, sin adelantar la S7.
- **Propuesta de reajuste del calendario**, *aprobada el 2026-11-24 con una variante: corrida un día (S4 mar 24, S5 jue 26, S6 sáb 28); el calendario vigente está en `PLAN.md` §2*. Vamos unas tres sesiones atrasados: S3, S4 y S5 tocaban del 16 al 20 de noviembre. Siguiendo `PLAN.md` §6 (usar la holgura y no comprimir dos sesiones pesadas el mismo día), se desplaza todo una semana:

  | Semana | Sesiones |
  |---|---|
  | 16–21 nov | S3 (vie 20) · sábado 21 de reserva |
  | 23–28 nov | S4 (lun 23) · S5 (mié 25) · S6 (vie 27) |
  | 30 nov–5 dic | S7 (lun 30) · S8 (mié 2) · S9 (vie 4) |
  | 7–12 dic | S10 (lun 7) · S11 (mié 9) · S12 (vie 11) |
  | 14–19 dic | S13 (lun 14) · S14 (mié 16) · S15 (vie 18) |
  | 19–31 dic | Holgura |

  Así se sigue terminando antes del 31 de diciembre. Si se aprueba, se aplica a `PLAN.md` y se registra en la bitácora.
