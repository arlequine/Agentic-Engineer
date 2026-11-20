# Backlog · Tickets de CondominIA (MVP)

> Fuente: [`historias.md`](historias.md) y [`docs/prd/prd.md`](../prd/prd.md) v0.3.
> Un ticket es una unidad de trabajo que se cierra en un PR. Cada uno remite a las historias (HU), requisitos (RF, RN, RNF) y escenarios G/W/T que lo definen como terminado.
> Los tickets no dependen del stack: la arquitectura y los contratos de datos se definen en las sesiones S3 y S7.

## Criterio de prioridad (MoSCoW) para el piloto

| Prioridad | Significado |
|---|---|
| **Must** | Sin esto no hay piloto. Incluye el asistente del residente, porque es la propuesta de valor y lo mide M-02 |
| **Should** | Importante, pero el piloto sobrevive sin esto. Incluye la operación sin red, que se pospone por decisión del 2026-11-19 |
| **Could** | Solo si sobra tiempo |
| **Won't** | Fuera del MVP: paquetería y Job B (amenidades), según el PRD §5 |

## Tickets

| ID | Ticket | Prioridad | Depende de | Remite a | Hecho cuando |
|---|---|---|---|---|---|
| T-01 | Alta de la privada y sus viviendas | Must | — | HU-01 · RF-01 | Pasan los escenarios 1–2 de HU-01 |
| T-02 | Invitación y desactivación de residentes y guardias | Must | T-01 | HU-02 · RF-01 | Pasan los escenarios 1–2 de HU-02 |
| T-03 | Aislamiento de datos por vivienda y por privada | Must | T-02 | RNF-05 · HU-05 esc. 3 | Ningún usuario lee ni modifica datos de otra vivienda o privada (tests de aislamiento) |
| T-04 | Crear un pase de visita puntual, con ventana horaria o día completo | Must | T-03 | HU-03 · RF-02 · RN-04 | Pasan los escenarios 1–4 de HU-03 |
| T-05 | Firma y verificación de pases | Must | T-04 | RNF-03 | Un pase alterado, reutilizado o vencido no se acepta |
| T-06 | Consultar, modificar y revocar pases | Must | T-04 | HU-05 · RF-04 | Pasan los escenarios 1–2 de HU-05 |
| T-07 | Validar un pase en caseta (con red) y registrar en la bitácora de solo escritura | Must | T-05, T-06 | HU-09 · RF-06 · RN-01, RN-03, RN-04 · RNF-02, RNF-04 | Pasan los escenarios 1–4 y 6–8 de HU-09; validación en < 2 s en el p95 |
| T-08 | Notificaciones de entrada y de denegación | Must | T-07 | HU-10 · RF-07 · RN-02, RN-03 | Pasan los escenarios 1–2 de HU-10 |
| T-09 | Asistente del residente: crear pases conversando, con confirmación | Must | T-04 | HU-06 · RF-05 · RNF-07 | Pasan los escenarios 1–3 de HU-06; primera respuesta en < 5 s en el p95 |
| T-10 | Bitácora de accesos e incidencias para la administración | Must | T-07 | HU-11 · RF-10 · RNF-04 | Pasan los escenarios 1, 2 y 4 de HU-11 (el 3 llega con T-13) |
| T-11 | Medición del costo del LLM por privada | Must | T-09 | RNF-06 | Hay un reporte mensual del costo por vivienda frente al tope de $15 |
| T-12 | Pase recurrente para servicio | Should | T-04, T-07, T-09 | HU-04 · RF-03 · HU-06 esc. 4 · HU-09 esc. 5 | Pasan los escenarios 1–3 de HU-04, el 4 de HU-06 y el 5 de HU-09 |
| T-13 | Registrar incidencias con formulario | Should | T-02 | HU-08 · RF-09 | Pasan los escenarios 2–3 de HU-08 y el 3 de HU-11 |
| T-14 | Itinerario del día para el guardia, con el asistente | Should | T-04, T-09 | HU-07 · RF-08 | Pasan los escenarios 1–3 de HU-07 |
| T-15 | Operación de caseta sin red y sincronización | Should (pospuesto) | T-07, T-08 | RNF-01 · HU-10 esc. 3 | 24 h offline con 0 registros perdidos y sincronización en < 5 min |
| T-16 | Aviso de privacidad y retención de 12 meses | Should | T-03 | RNF-05 | Aviso publicado y datos de más de 12 meses depurados (el detalle legal se ve en la S13) |
| T-17 | Registrar incidencias con el asistente | Could | T-09, T-13 | HU-08 esc. 1 | Pasa el escenario 1 de HU-08 |

## Orden sugerido de implementación

```
Must:    T-01 → T-02 → T-03 → T-04 ─┬→ T-05 ─┐
                                    ├→ T-06 ─┴→ T-07 ─┬→ T-08
                                    │                 └→ T-10
                                    └→ T-09 → T-11
Should:  T-12, T-13, T-14, T-16, T-15
Could:   T-17
```

T-04 desbloquea dos ramas independientes: la caseta (T-05 → T-07) y el asistente (T-09). Las dos pueden avanzar en paralelo.

## Fuera de esta lista (no son tickets de desarrollo)
- **RNF-08 (usabilidad del guardia):** se valida con una prueba en el piloto, no con un PR.
- **Métricas M-01 a M-03:** requieren instrumentación, que se define en la S14 (observabilidad).

## Consecuencia de posponer T-15
Mientras T-15 no esté hecho, **el piloto necesita una privada con conectividad estable en caseta**. Si la red se cae, la caseta no puede validar pases. Esto contradice temporalmente la mitigación de R-02 y hay que tenerlo en cuenta al elegir la privada piloto.
