# Backlog · Historias de usuario de CondominIA (MVP)

> Fuente: [`docs/prd/prd.md`](../prd/prd.md) v0.2. Cada historia indica los `RF` y `RN` que implementa.
> Los criterios Given/When/Then son el contrato que la Sesión 3 convierte en specs y la Sesión 4 en tests: tienen que ser **observables, atómicos y con los casos borde explícitos**.
> Convención: los ejemplos usan la casa 14 y fechas relativas a "hoy".

## Mapa

| Épica | Historias | Requisitos |
|---|---|---|
| E1 · Gestión de la privada | HU-01, HU-02 | RF-01 |
| E2 · Pases de acceso | HU-03, HU-04, HU-05 | RF-02, RF-03, RF-04, RN-04 |
| E3 · Asistente conversacional | HU-06, HU-07, HU-08 | RF-05, RF-08, RF-09 |
| E4 · Operación en caseta | HU-09, HU-10 | RF-06, RF-07, RN-01, RN-02, RN-03, RN-04 |
| E5 · Bitácora y auditoría | HU-11 | RF-10 |

---

## E1 · Gestión de la privada

### HU-01 · Dar de alta la privada y sus viviendas

**Implementa:** RF-01

> **Como** administración, **quiero** registrar la privada y sus viviendas, **para** que cada pase y cada entrada queden ligados a una casa concreta.

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
```

### HU-02 · Dar de alta residentes y guardias

**Implementa:** RF-01

> **Como** administración, **quiero** invitar a residentes y guardias y desactivarlos cuando se van, **para** que solo personas autorizadas puedan crear o validar pases.

```gherkin
Escenario 1: invitar a un residente
  Dado que existe la vivienda 14
  Cuando la administración invita a un residente a la vivienda 14
  Entonces el residente recibe una invitación para activar su cuenta
  Y, una vez activada, solo ve y gestiona pases de la vivienda 14

Escenario 2: guardia desactivado
  Dado que la administración desactivó al guardia Pedro
  Cuando Pedro intenta validar un pase
  Entonces ve "Cuenta desactivada"
  Y no se registra ninguna entrada
```

---

## E2 · Pases de acceso

### HU-03 · Crear un pase de visita puntual

**Implementa:** RF-02, RN-04

> **Como** residente, **quiero** registrar con anticipación a una visita, **para** que entre sin que yo tenga que estar pendiente.

```gherkin
Escenario 1: pase con ventana horaria
  Dado que soy residente de la casa 14
  Cuando creo un pase para "Ana López" para mañana de 16:00 a 20:00
  Entonces obtengo un pase para compartir con el visitante
  Y el pase aparece en mis pases como "Vigente"

Escenario 2: pase de día completo
  Dado que soy residente de la casa 14
  Cuando creo un pase para "Ana López" para mañana y marco "Todo el día"
  Entonces el pase vale de 00:00 a 23:59 de mañana

Escenario 3: ventana en el pasado
  Dado que son las 18:00 de hoy
  Cuando intento crear un pase para hoy de 10:00 a 12:00
  Entonces veo el error "La ventana horaria ya pasó"
  Y no se crea ningún pase

Escenario 4: datos incompletos
  Cuando intento crear un pase sin el nombre del visitante
  Entonces veo el error "Indica el nombre del visitante"
  Y no se crea ningún pase
```

### HU-04 · Crear un pase recurrente para servicio

**Implementa:** RF-03, RN-04

> **Como** residente, **quiero** autorizar una sola vez al personal que viene cada semana, **para** no tener que generar un pase en cada visita.

```gherkin
Escenario 1: pase recurrente
  Dado que soy residente de la casa 14
  Cuando creo un pase recurrente para "María Pérez" los martes y jueves de 08:00 a 14:00, vigente hasta el 31 de marzo
  Entonces el pase aparece en mis pases como "Recurrente · Vigente"
  Y se puede validar cada martes y jueves dentro de ese horario

Escenario 2: sin días seleccionados
  Cuando intento crear un pase recurrente sin elegir ningún día
  Entonces veo el error "Elige al menos un día"
  Y no se crea ningún pase

Escenario 3: vigencia terminada
  Dado que un pase recurrente tenía vigencia hasta ayer
  Cuando consulto mis pases
  Entonces el pase aparece como "Vencido"
```

### HU-05 · Consultar, modificar y revocar pases

**Implementa:** RF-04

> **Como** residente, **quiero** ver y cambiar mis pases, **para** corregir errores o cancelar una visita que ya no viene.

```gherkin
Escenario 1: revocar un pase
  Dado que tengo un pase vigente para "Ana López"
  Cuando lo revoco
  Entonces el pase aparece como "Revocado"
  Y cualquier validación posterior se deniega (ver HU-09, escenario 3)

Escenario 2: modificar la ventana horaria
  Dado que tengo un pase para mañana de 16:00 a 20:00
  Cuando cambio la ventana a 18:00 a 22:00
  Entonces el pase vale solo de 18:00 a 22:00 (con la tolerancia de RN-04)

Escenario 3: aislamiento entre viviendas
  Dado que soy residente de la casa 14
  Cuando consulto mis pases
  Entonces solo veo los pases de la casa 14
```

---

## E3 · Asistente conversacional

### HU-06 · Crear pases conversando con el asistente

**Implementa:** RF-05 (reutiliza las reglas de HU-03 y HU-04)

> **Como** residente, **quiero** decirle al asistente a quién espero, **para** autorizar una visita sin llenar un formulario.

```gherkin
Escenario 1: petición completa
  Dado que soy residente de la casa 14
  Cuando le escribo al asistente "viene mi mamá, Rosa Díaz, el sábado a las 5 de la tarde"
  Entonces el asistente me muestra un resumen: visitante "Rosa Díaz", sábado, ventana horaria propuesta
  Y me pide confirmar antes de crear el pase

Escenario 2: sin confirmación no hay pase
  Dado que el asistente me mostró el resumen de un pase
  Cuando respondo "no" o no confirmo
  Entonces no se crea ningún pase

Escenario 3: falta un dato
  Cuando le escribo al asistente "viene mi mamá el sábado"
  Entonces el asistente me pregunta el nombre del visitante y si es en un horario o todo el día
  Y no propone el pase hasta tener los datos obligatorios de HU-03

Escenario 4: pase recurrente
  Cuando le escribo "María viene a limpiar martes y jueves de 8 a 2 hasta fin de marzo"
  Entonces el asistente propone un pase recurrente con esos días, horario y vigencia
  Y me pide confirmar antes de crearlo
```

### HU-07 · Consultar el itinerario de visitas del día

**Implementa:** RF-08

> **Como** guardia, **quiero** preguntar qué visitas se esperan hoy, **para** organizar la caseta sin llamar a los residentes.

```gherkin
Escenario 1: itinerario del día
  Dado que hoy hay 3 pases vigentes y 1 revocado
  Cuando le pregunto al asistente "¿quién viene hoy?"
  Entonces veo las 3 visitas vigentes con su nombre, casa y ventana horaria
  Y no aparece el pase revocado

Escenario 2: consulta por casa
  Cuando le pregunto "¿quién viene hoy a la casa 14?"
  Entonces solo veo las visitas vigentes de la casa 14

Escenario 3: sin visitas
  Dado que hoy no hay pases vigentes
  Cuando pregunto por el itinerario
  Entonces el asistente responde "No hay visitas programadas para hoy"
```

### HU-08 · Registrar una incidencia

**Implementa:** RF-09

> **Como** guardia, **quiero** registrar una incidencia en el momento, **para** que la administración tenga constancia sin depender de una bitácora en papel.

```gherkin
Escenario 1: incidencia con el asistente
  Cuando le escribo al asistente "un visitante de la casa 14 se negó a mostrar el pase, 18:20"
  Entonces el asistente me muestra un resumen con la casa, la hora y la descripción
  Y, al confirmar, la incidencia queda registrada a mi nombre

Escenario 2: incidencia con formulario
  Cuando registro una incidencia desde el formulario con casa, hora y descripción
  Entonces la incidencia queda registrada a mi nombre

Escenario 3: descripción vacía
  Cuando intento registrar una incidencia sin descripción
  Entonces veo el error "Describe la incidencia"
  Y no se registra nada
```

---

## E4 · Operación en caseta

### HU-09 · Validar un pase en caseta

**Implementa:** RF-06, RN-01, RN-02, RN-03, RN-04

> **Como** guardia de caseta, **quiero** validar el pase de un visitante, **para** dejarlo pasar en segundos, sin llamadas y con la entrada registrada a nombre del residente que lo autorizó.

```gherkin
Escenario 1: pase válido y vigente
  Dado que existe un pase de visita puntual para la casa 14, vigente hoy de 16:00 a 20:00
  Cuando el guardia valida el pase a las 17:00
  Entonces el guardia ve "Acceso autorizado" con el nombre del visitante y la casa
  Y la entrada queda registrada con fecha, hora, guardia y residente que autorizó
  Y el residente recibe la notificación "Tu visita llegó"

Escenario 2: fuera de la ventana horaria
  Dado que existe un pase para la casa 14, vigente hoy de 16:00 a 20:00
  Cuando el guardia valida el pase a las 20:30
  Entonces el guardia ve "Acceso denegado: fuera de horario"
  Y no se registra ninguna entrada
  Y el residente recibe la notificación "Tu visita llegó fuera de horario"

Escenario 3: pase revocado
  Dado que el residente revocó el pase de la casa 14 a las 16:00
  Cuando el guardia valida ese pase a las 17:00
  Entonces el guardia ve "Acceso denegado: pase revocado"
  Y no se registra ninguna entrada
  Y el residente recibe la notificación "Se denegó el acceso a tu visita: pase revocado"

Escenario 4: visita puntual ya usada
  Dado que un pase de visita puntual ya registró una entrada hoy a las 16:30
  Cuando el guardia vuelve a validar ese pase a las 18:00
  Entonces el guardia ve "Acceso denegado: pase ya utilizado"
  Y no se registra ninguna entrada
  Y el residente recibe la notificación "Se denegó el acceso a tu visita: pase ya utilizado"

Escenario 5: pase recurrente en un día que no le toca
  Dado que existe un pase recurrente para la casa 14, válido martes y jueves
  Cuando el guardia valida el pase un miércoles
  Entonces el guardia ve "Acceso denegado: día no autorizado"
  Y no se registra ninguna entrada
  Y el residente recibe la notificación "Se denegó el acceso a tu visita: día no autorizado"

Escenario 6: llegada dentro de la tolerancia
  Dado que existe un pase para la casa 14, vigente hoy de 16:00 a 20:00
  Cuando el guardia valida el pase a las 15:50
  Entonces el guardia ve "Acceso autorizado"
  Y la entrada queda registrada

Escenario 7: llegada antes de la tolerancia
  Dado que existe un pase para la casa 14, vigente hoy de 16:00 a 20:00
  Cuando el guardia valida el pase a las 15:40
  Entonces el guardia ve "Acceso denegado: antes de horario (desde las 15:45)"
  Y no se registra ninguna entrada
  Y el residente recibe la notificación "Tu visita llegó antes de horario"

Escenario 8: pase no reconocido
  Cuando el guardia valida un código que no corresponde a ningún pase
  Entonces el guardia ve "Pase no válido"
  Y no se registra ninguna entrada
  Y no se notifica a ningún residente
```

### HU-10 · Notificar al residente

**Implementa:** RF-07, RN-02, RN-03

> **Como** residente, **quiero** enterarme de cuándo llega mi visita o de cuándo se le niega el acceso, **para** recibirla o resolver el problema sin que me llame la caseta.

```gherkin
Escenario 1: notificación de entrada
  Dado que la entrada de mi visita quedó registrada en caseta
  Entonces recibo "Tu visita llegó" con el nombre del visitante y la hora

Escenario 2: notificación de denegación con motivo
  Dado que se denegó el acceso a mi visita por "fuera de horario"
  Entonces recibo el aviso con ese motivo
  Y desde el aviso puedo crear un pase nuevo (RN-01)

Escenario 3: caseta sin conexión
  Dado que la caseta registró una entrada sin conexión a internet
  Cuando la caseta recupera la conexión
  Entonces la entrada se sincroniza sin perderse
  Y recibo la notificación con la hora real de la entrada
```

> Nota: el escenario 3 implementa RNF-01; la arquitectura se define en la S7.

---

## E5 · Bitácora y auditoría

### HU-11 · Consultar la bitácora de accesos e incidencias

**Implementa:** RF-10

> **Como** administración, **quiero** consultar quién entró, cuándo y quién lo autorizó, **para** responder ante un incidente con datos y no con suposiciones.

```gherkin
Escenario 1: bitácora filtrada
  Dado que hubo 50 entradas esta semana, 6 de ellas a la casa 14
  Cuando la administración filtra por la casa 14 y esta semana
  Entonces ve las 6 entradas con visitante, fecha, hora, guardia y residente que autorizó

Escenario 2: denegaciones visibles
  Dado que hoy se denegaron 2 accesos
  Cuando la administración consulta la bitácora de hoy
  Entonces ve las 2 denegaciones con su motivo

Escenario 3: incidencias
  Dado que el guardia registró una incidencia hoy
  Cuando la administración consulta las incidencias de hoy
  Entonces ve la incidencia con la casa, la hora, la descripción y el guardia

Escenario 4: acceso restringido
  Cuando un residente o un guardia intenta abrir la bitácora completa
  Entonces ve "No tienes permiso"
```
