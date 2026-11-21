# Checklist de seguridad y privacidad para specs de CondominIA

Revisa cada punto como Cumple, Parcial, Falta o N/A. Todo N/A lleva su motivo. Los puntos con (*) son críticos.

Esta lista es para la spec, no para el código: pregunta si la spec **decide** el comportamiento, no si ya está implementado. Se amplía en la S13 (modelo de amenazas y LFPDPPP en detalle).

## 1. Autorización (*)
- ¿Qué rol puede ejecutar cada operación (administración, residente, guardia)?
- ¿Sobre qué ámbito actúa: su privada, su vivienda o la privada asignada al guardia?
- ¿Qué pasa con una cuenta desactivada (HU-02)?
- Si la autorización se delega a otra spec, la referencia tiene que existir y ser concreta.

## 2. Aislamiento entre privadas y viviendas (*) · RNF-05
- ¿Alguna operación recibe un identificador (de privada, vivienda o pase) que no se verifica contra el ámbito del actor?
- ¿Algún mensaje de error filtra que existe un dato de otra privada? Por ejemplo, "esa vivienda existe en otra privada".
- ¿Las búsquedas y los listados se limitan siempre al ámbito del actor?

## 3. Datos personales · RNF-05, LFPDPPP
- ¿Qué datos personales se piden? Cada uno tiene que justificar **para qué** se usa en esta historia. Si no hay justificación, no se pide (minimización).
- ¿Hay datos sensibles o de identificación oficial (CURP, INE, teléfono)? Márcalos.
- Del visitante solo se guarda el nombre (RNF-05).
- ¿La retención de 12 meses afecta a esta historia?

## 4. Auditoría · RNF-04
- ¿Qué cambios de esta historia deben dejar rastro (quién, qué, cuándo)?
- La bitácora es de solo escritura: ninguna operación de la spec edita ni borra registros. Las correcciones son registros nuevos.
- ¿Hay bajas o cambios de nombre que podrían borrar historia en silencio?

## 5. Entradas hostiles o inesperadas
- Límites máximos: longitud de los textos, tamaño de los lotes y número de elementos por operación.
- Normalización: espacios, mayúsculas y minúsculas, ceros a la izquierda, acentos, caracteres invisibles o de control.
- Tipos y formatos: ¿qué pasa con un valor del tipo equivocado o vacío?
- ¿Algún texto del usuario acaba en un prompt del asistente? Si sí, marca el riesgo de inyección de prompt (S12–S13).

## 6. Concurrencia e integridad
- ¿Qué invariante (unicidad, conteos) se rompe si dos actores operan a la vez?
- ¿La spec dice quién lo garantiza al final (el dominio, la base de datos o ambos)?
- ¿Las operaciones en lote son atómicas (todo o nada) y eso está escrito?

## 7. Credenciales y secretos
- Nunca contraseñas en claro, ni enviadas por correo, ni guardadas en texto.
- La activación y la recuperación de acceso usan enlaces o códigos de un solo uso y con vencimiento.
- Ningún secreto (llave de firma de pases, tokens) aparece en mensajes ni en la bitácora.

## 8. Pases y caseta · RNF-01, RNF-03 (si aplica)
- El pase está firmado y no se puede alterar. El pase puntual es de un solo uso y no vale fuera de su vigencia.
- Comportamiento sin red: ¿qué decide la caseta con su copia local y qué se reconcilia al sincronizar?
- Toda entrada y toda denegación notifican al residente (RN-02, RN-03).

## 9. Abuso y costo · RNF-06 (si aplica)
- ¿Una operación puede dispararse en masa? Por ejemplo, crear miles de pases o llamar sin parar al asistente.
- ¿Hace falta un límite por usuario o por vivienda?
