# Competencia y pricing · Job A (accesos)

> Investigación hecha el 2026-11-19 con búsqueda web asistida por el agente.
> **Nivel de verificación:** los datos salen de resultados de búsqueda y de páginas comerciales de los propios proveedores. No se abrió cada página por separado ni se pidieron cotizaciones. Todo precio es **indicativo** hasta confirmarlo con el proveedor.

## Hipótesis previas del estudiante

| # | Hipótesis | Resultado |
|---|---|---|
| 1 | Competidores: ComunidadFeliz y Residentfy | ✔ Existen los dos y tienen control de acceso con QR. Además aparecen unos 10 competidores más |
| 2 | Precio aproximado de $200 MXN por vivienda al mes | ✘ El rango publicado va de unos $9 a $85 MXN por vivienda al mes, entre 2 y 20 veces menos |
| 3 | Hueco: gestión de accesos, flujo en caseta y notificación de llegada | ✘ Varios competidores ya ofrecen las tres cosas. Son *table stakes*: lo mínimo que hay que tener, no un diferenciador |

## Competidores

| Producto | Origen / mercado | Visita puntual (QR) | Pase recurrente | Notificación de llegada | App de caseta | Precio publicado |
|---|---|---|---|---|---|---|
| [Residentfy](https://www.residentfy.com/) | México | ✔ | ✔ "visitas frecuentes" | No consta | ✔ entradas y salidas, chat con caseta | $15 → $9 por casa al mes, escalonado de 1 a 150 casas ([precios](https://www.residentfy.com/precios)); la moneda no se confirmó, probablemente MXN |
| [ComunidadFeliz](https://www.comunidadfeliz.mx/) | Chile, con operación en MX | ✔ link con QR | No consta | Monitoreo en tiempo real | ✔ validación por conserje, opcional | MX: $13 por unidad (dato de [Expansión, 2019](https://expansion.mx/empresas/2019/03/19/esta-plataforma-quiere-ser-el-portero-digital-de-tu-edificio), desactualizado). El módulo de acceso requiere la plataforma base. Visma la adquirió ([fuente](https://www.descubre.vc/noticia/comunidadfeliz-tecnolog-a-reduce-morosidad-en-condominios-en-m-xico-2024-07-04)) |
| [GuardIA](https://www.guardialatam.com/) | LATAM | ✔ visita de un día | ✔ hasta 120 días y pase de servicio | ✔ al instante | ✔ tableta en caseta | No publicado |
| [Amber Access](https://amberaccess.com.mx/modulos.html) | México | ✔ | ✔ servicio doméstico | ✔ en tiempo real | ✔ | No publicado |
| [ArmorPass](https://armorpass.com/en/residencial) | LATAM | ✔ pase único | ✔ permanente / FastPass | No consta | ✔ | No publicado |
| [Visitapp](https://visitapp.la/) | LATAM | ✔ QR con expiración | No consta | No consta | ✔ apps para guardia, residente y administración | 40 USD por domicilio al año; [GO](https://visitapp.la/visitapp-go): 18 USD por domicilio al año |
| [Next Accesos](https://next-accesos.com/) | México | ✔ | No consta | No consta | ✔ | Desde $85 MXN + IVA por casa al mes; requiere accesos ya automatizados |
| [Domotk](https://domotk.net/) | México | ✔ | No consta | No consta | ✔ | Paquetes según los registros de caseta al mes; integración desde $2,500 MXN por acceso, pago único |
| [Alddea](https://alddea.com/) | México | ✔ | No consta | No consta | ✔ | Plan Control de unos $1,040 MXN al mes; no está claro si es por fraccionamiento |
| Otros sin datos revisados | México | [Privanza](https://privanza.com.mx/), [FRAQ](https://fraq.mx/), [Colono Seguro](https://colonoseguro.com/), [Resigard](https://resigard.com.mx/control-de-accesos-residenciales), [WDL](https://wdlacceso.com/control-de-acceso-para-fraccionamientos/) | | | | No publicado |

"No consta" significa que no apareció en lo revisado, no que el producto no lo tenga.

## Pricing normalizado (MXN por vivienda al mes)

Supuesto: tipo de cambio de 18 MXN/USD, *no verificado*.

| Producto | Rango |
|---|---|
| Residentfy | 9–15 |
| ComunidadFeliz (2019) | ~13 |
| Visitapp GO / Visitapp | ~27 / ~60 |
| Next Accesos | 85 + IVA |

**Lectura:** el mercado se mueve entre **$10 y $85 MXN por vivienda al mes**, con los proveedores de software puro en la parte baja. Varios cobran aparte el hardware y la integración con portones. El modelo dominante es un **precio por vivienda, escalonado por tamaño, que paga la administración**, lo que confirma el comprador definido en [jtbd.md](jtbd.md).

## Huecos posibles (hipótesis sin validar)

Las features del Job A ya son commodity, así que la diferenciación tiene que venir de otro lado:

1. **Competir contra WhatsApp, no contra las apps.** La alternativa más usada es el chat. Un asistente conversacional que dé de alta visitas en lenguaje natural ("viene mi mamá el sábado a las 5") quitaría fricción. Conecta con el agente propio de la S10.
2. **Adopción del guardia.** Varios productos hablan de la app del residente, pero poco de la experiencia en caseta: rotación de personal, conectividad mala, poca capacitación. Por verificar.
3. **Reglamento consultable.** Las dudas sobre las reglas de la privada (horarios, mascotas, mudanzas) hoy se resuelven en el grupo de WhatsApp. Conecta con el RAG de la S9.
4. **Precio accesible para privadas pequeñas.** Para eso habría que verificar si los proveedores atienden bien a privadas de menos de 20 casas.

## Decisiones (2026-11-19)
- **Canal:** una app propia que centralice la información de la privada. WhatsApp queda descartado como canal.
- **Precio objetivo:** $40 MXN por vivienda al mes. Queda en la parte media del mercado: más caro que Residentfy ($9–15) y que Visitapp GO (~$27), y más barato que Next Accesos ($85 + IVA).
- **Diferenciador:** se combinan los huecos 1 y 2, y es lo que justifica el sobreprecio:
  - **Asistente conversacional dentro de la app.** El residente da de alta visitas en lenguaje natural, sin WhatsApp.
  - **Experiencia de caseta pensada para el guardia.** Validación en segundos, tolerante a mala conectividad y con poca capacitación necesaria.

## Pendiente de verificar
- La moneda y la vigencia de los precios de Residentfy.
- El precio actual de ComunidadFeliz en México.
- Opiniones de usuarios independientes, como reseñas en tiendas de apps, sobre la experiencia en caseta.
