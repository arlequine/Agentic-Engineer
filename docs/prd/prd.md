# PRD · CondominIA

| Campo | Valor |
|---|---|
| Versión | 0.3 |
| Estado | Borrador |
| Fecha | 2026-11-19 |
| Fuentes | [`jtbd.md`](../research/jtbd.md), [`competencia.md`](../research/competencia.md) |

> Este documento es la fuente de verdad del producto. Cada requisito tiene un ID estable (`RF-xx`, `RNF-xx`, `M-xx`) que se arrastra a historias, specs y tests. Los cambios de alcance se hacen por PR y se anotan en el changelog.

## 1. Problema

En las privadas residenciales, los accesos se gestionan con llamadas de la caseta al residente, con avisos en grupos de WhatsApp y con bitácoras en papel. Eso tiene tres consecuencias:
- se forman filas en caseta;
- el residente tiene que estar pendiente de cada llegada;
- no queda un registro confiable de quién entró, cuándo y con permiso de quién.

## 2. Propuesta de valor

> **Para** administraciones de privadas residenciales **que** sufren filas en caseta, accesos sin registro confiable y avisos de visitas dispersos en llamadas y chats, **CondominIA es** una app de control de accesos **que** permite al residente autorizar visitas con solo decirlo ("viene mi mamá el sábado a las 5") y al guardia validarlas en segundos; **a diferencia de** Residentfy o ComunidadFeliz, que se basan en formularios (*hipótesis*), **CondominIA** combina un asistente conversacional para residentes y guardias con una caseta diseñada para el guardia, aun con mala conectividad.

**Precio objetivo:** $60 MXN por vivienda al mes, que paga la administración.

## 3. Usuarios

| Actor | Rol | Job principal |
|---|---|---|
| Residente | Usuario principal: autoriza los accesos | Dejar resuelta de antemano la entrada de quien espera, sin estar pendiente |
| Guardia de caseta | Usuario secundario: ejecuta los accesos | Confirmar en segundos que el acceso está autorizado y no cargar con la responsabilidad |
| Administración | Comprador | Saber quién entró, cuándo y quién lo autorizó, para responder ante incidentes |
| Visitante | Beneficiario, sin cuenta | Entrar rápido |

## 4. Métricas de éxito (a 3 meses del lanzamiento)

| ID | Actor | Métrica | Meta |
|---|---|---|---|
| M-01 | Guardia | Tiempo de validación en caseta | < 30 s en el 90 % de las visitas |
| M-02 | Residente | Visitas pre-autorizadas a través del asistente | ≥ 60 % del total |
| M-03 | Administración | Viviendas activas (≥ 1 visita autorizada al mes) | ≥ 70 % |

**Guardrail:** reducir un 80 % las llamadas de caseta a residentes.

## 5. Alcance

### Dentro del MVP
- Visita puntual.
- Servicio recurrente (personal doméstico o de servicio con días y horario fijos).
- Asistente conversacional para el residente y para el guardia.
- Registro de incidencias en caseta.
- Bitácora de accesos para la administración.

### Fuera del MVP
| Qué | Cuándo |
|---|---|
| Paquetería (no se sabe quién llega ni a qué hora) | Por definir |
| **Job B · Amenidades** (reservas) | Fase 2 |
| Integración con portones o hardware | Por definir |
| Pagos de cuota de mantenimiento | No previsto |

## 6. Requisitos funcionales

De alto nivel. Se descomponen en historias en [`docs/backlog/`](../backlog/).

| ID | Actor | Requisito |
|---|---|---|
| RF-01 | Administración | Dar de alta la privada, sus viviendas, residentes y guardias |
| RF-02 | Residente | Pre-autorizar una visita puntual (nombre, fecha y una ventana horaria o el día completo) y obtener un pase para compartirlo con el visitante |
| RF-03 | Residente | Crear un pase recurrente para servicio (días, horario y vigencia) |
| RF-04 | Residente | Consultar, modificar y revocar sus pases |
| RF-05 | Residente | Crear y modificar pases conversando con el asistente, que pide confirmación antes de guardar |
| RF-06 | Guardia | Validar un pase en caseta y registrar la entrada |
| RF-07 | Residente | Recibir una notificación cuando su visita entra |
| RF-08 | Guardia | Consultar al asistente el itinerario de visitas del día |
| RF-09 | Guardia | Registrar una incidencia, con el asistente o con un formulario |
| RF-10 | Administración | Consultar la bitácora de accesos (quién, cuándo, quién autorizó) y las incidencias |

### Reglas de negocio
| ID | Regla |
|---|---|
| RN-01 | **Sin pase no hay acceso.** Toda visita tiene que estar registrada por un residente antes de entrar. Si llega alguien sin pase, el residente lo genera en ese momento (RF-02 o RF-05) |
| RN-02 | **Toda entrada notifica al residente.** Cuando el guardia escanea un pase y registra la entrada (RF-06), el sistema avisa en ese momento al residente que su visita llegó (RF-07) |
| RN-03 | **Toda denegación notifica al residente.** Si se deniega un pase, el guardia ve el motivo y el residente recibe un aviso con ese mismo motivo, para que pueda generar un pase nuevo si procede (RN-01) |
| RN-04 | **Tolerancia horaria.** Un pase con ventana horaria se acepta desde 15 minutos antes de su inicio y hasta su fin, sin tolerancia después. Un pase de día completo vale de 00:00 a 23:59 del día elegido |

## 7. Requisitos no funcionales

Cada RNF tiene un umbral y una forma de verificarlo. En S13–S14 se convierten en controles y SLOs del pipeline.

| ID | Categoría | Requisito | Verificación | Origen |
|---|---|---|---|---|
| RNF-01 | Disponibilidad | **Operación sin red:** la caseta valida pases y registra entradas e incidencias durante al menos 24 h sin conexión. Al reconectar: 0 registros perdidos, sincronización en < 5 min, cada registro con su hora real y envío de las notificaciones pendientes. Si un pase se revocó mientras la caseta estaba offline, la entrada se acepta con la copia local y, al sincronizar, queda marcada en la bitácora como "aceptada offline con pase revocado" y se avisa a la administración | Prueba de corte de red de 24 h con registros simulados | R-02, HU-10 |
| RNF-02 | Rendimiento | La respuesta del sistema al validar un pase llega en < 2 s en el p95, con o sin red | Medición en caseta y en tests de carga | M-01 |
| RNF-03 | Seguridad | El pase no se puede falsificar (está firmado por el sistema), el de visita puntual es de un solo uso y ningún pase vale fuera de su vigencia | Tests de pase alterado, reutilizado y vencido | R-05, HU-09 |
| RNF-04 | Auditoría | La bitácora es de solo escritura: nadie, ni la administración, puede editar o borrar una entrada, denegación o incidencia. Las correcciones se registran como entradas nuevas que referencian a la original | Test de que no existe ninguna operación de edición ni de borrado | HU-11 |
| RNF-05 | Privacidad | Aviso de privacidad conforme a la LFPDPPP. Del visitante solo se guarda el nombre. Los datos se retienen 12 meses y hay aislamiento estricto entre viviendas y entre privadas. El detalle legal se ve en la S13 | Revisión del aviso y tests de aislamiento | HU-05, HU-02 |
| RNF-06 | Costo | El costo del LLM es ≤ $15 MXN por vivienda al mes (25 % del precio objetivo de $60) | Reporte mensual de uso y costo por privada | Pricing |
| RNF-07 | Rendimiento | El asistente da su primera respuesta en < 5 s en el p95 | Medición en producción | HU-06, HU-07 |
| RNF-08 | Usabilidad | Un guardia nuevo completa su primera validación sin ayuda y en < 2 min, sin capacitación previa | Prueba con un guardia en el piloto | R-01 |

## 8. Supuestos y riesgos

| # | Supuesto o riesgo | Mitigación |
|---|---|---|
| R-01 | El guardia adopta la app aunque haya rotación de personal y poca capacitación | Caseta con el mínimo de pasos; se valida en el piloto |
| R-02 | **La conectividad en caseta es mala, pero el asistente necesita red** | La validación de pases (RF-06) no depende del asistente. Las entradas e incidencias registradas sin red no se pierden (RNF-01). La arquitectura se analiza en la S7 |
| R-03 | El residente prefiere hablar con el asistente antes que llenar un formulario | M-02 lo mide; si falla, la propuesta de valor se revisa |
| R-04 | La administración paga $60 cuando hay opciones de $9–15, es decir, entre 4 y 6 veces más | El diferenciador tiene que ser visible en la demo; se valida con cotizaciones reales |
| R-05 | Un pase compartido puede reenviarse a terceros | Vigencia acotada y un solo uso para la visita puntual (se detalla en la spec) |

## 9. Preguntas abiertas
- **Línea base:** ¿cuánto tarda hoy una validación en caseta? Hay que medirlo en una privada piloto antes de lanzar.
- ¿Se registra también la salida de los visitantes?
- ¿El guardia verifica la identidad del visitante (INE) o basta con el pase?
- ¿Qué datos personales de visitantes se guardan y cuánto tiempo? Se cubre en los RNF y en la S13.
- Precios reales de la competencia: confirmar con cotizaciones (ver [`competencia.md`](../research/competencia.md)).

## Changelog
| Versión | Fecha | Cambio |
|---|---|---|
| 0.1 | 2026-11-19 | Borrador inicial: problema, propuesta de valor, usuarios, métricas, alcance del MVP y requisitos funcionales del Job A, reglas RN-01 (sin pase no hay acceso) y RN-02 (toda entrada notifica al residente) |
| 0.2 | 2026-11-19 | RN-03 (toda denegación notifica), RN-04 (tolerancia de 15 min y pase de día completo); RF-02 admite el día completo. Origen: refinamiento de HU-09 |
| 0.3 | 2026-11-19 | RNF-01 a RNF-08, incluida la política de pases revocados con la caseta offline y el tope de costo del LLM. Precio objetivo: de $40 a $60; tope del LLM: de $4 a $15 por vivienda al mes |
