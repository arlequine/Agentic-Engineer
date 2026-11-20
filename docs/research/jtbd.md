# Jobs-to-be-done · TaskFlow AI

> Dominio: gestión de accesos y amenidades en privadas residenciales.
> Los jobs no mencionan la solución. Las soluciones aparecen solo como hipótesis y se desarrollan en el PRD.

## Job A · Accesos

### Residente (actor principal)
> Cuando espero a alguien en mi casa (una visita, un proveedor o personal de servicio), quiero dejar su entrada resuelta de antemano y no tener que estar pendiente cuando llegue, para que entre sin demoras y quede constancia de quién entró, cuándo y con permiso de quién.

### Guardia de caseta (actor secundario)
> Cuando alguien llega a la caseta, quiero confirmar en segundos que un residente lo autorizó, para dejarlo pasar sin hacer llamadas y sin cargar con la responsabilidad si algo sale mal.

### Administración o mesa directiva (comprador)
> Cuando hay un incidente o una queja de seguridad, quiero saber quién entró, cuándo y quién lo autorizó, para responder a los residentes y justificar en qué se usa la cuota.

### Usuario y comprador
- **Usa el producto:** el residente, que autoriza, y el guardia, que ejecuta.
- **Decide la compra:** la administración, que maneja la cuota de mantenimiento.
- **Lo financia:** los residentes, de forma indirecta, a través de la cuota.

### Alternativas actuales (la competencia real)
- Llamada de la caseta al residente.
- Avisos por grupos de WhatsApp.
- Bitácora en papel en la caseta.

### Alcance del MVP
| Tipo de acceso | En el MVP | Motivo |
|---|---|---|
| Visita puntual | Sí | El residente conoce de antemano a quién espera y cuándo |
| Servicio recurrente | Sí | Mismo job con otra frecuencia: necesita un pase recurrente |
| Paquetería | No | No se sabe quién llega ni a qué hora, así que no encaja con la autorización previa |

### Hipótesis de solución (se valida en el PRD)
1. El residente genera un acceso y se lo comparte al visitante.
2. El visitante llega y muestra un QR en la caseta.
3. El guardia escanea el QR, deja pasar al visitante y el acceso queda registrado.

## Job B · Amenidades
_Pendiente._
