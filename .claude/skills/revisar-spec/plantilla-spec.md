# Spec · HU-NN · <Título de la historia>

| Campo | Valor |
|---|---|
| Versión | 0.1 |
| Fecha | AAAA-MM-DD |
| Historia | [HU-NN](../docs/backlog/historias.md) · Ticket T-NN |
| Implementa | RF-NN, RN-NN, RNF-NN |
| Estado | Borrador / Aprobada / Implementada |

## 1. Contexto
- Qué problema resuelve la historia y qué otras historias dependen de ella.
- Qué ya existe (otras specs, entidades) y qué se da por supuesto.

**Alcance de esta versión:**
- Capacidades concretas, una por línea.

**Fuera de alcance:**
- Qué no entra y dónde se resolverá (otra spec, otra versión, otra sesión).

## 2. Lenguaje del dominio
| Término | Significado |
|---|---|
| | |

## 3. Reglas
Declarativas: "siempre", "nunca", "es único dentro de…". Cita el RF, RN o RNF de origen cuando lo haya.

| ID | Regla |
|---|---|
| R-01 | |

## 4. Criterios de aceptación
Conserva los escenarios de la historia sin cambios. Los escenarios nuevos indican entre paréntesis las reglas que cubren. Cubre los bordes: vacío, duplicado, normalización, límites, fallo parcial y estado sin cambios tras un error.

```gherkin
Escenario 1: <nombre> (R-01)
  Dado que …
  Cuando …
  Entonces …
```

## 5. Contrato de datos e interfaz
- **Tipos de dominio:** entidades y sus campos.
- **Operaciones:** firma, entrada y salida.
- **Errores:** cada motivo con su código y su texto literal.
- **Puertos:** qué necesita la operación del exterior (persistencia, reloj, notificaciones).

## 6. Seguridad y privacidad
Resumen de `seguridad.md` aplicado a esta historia:
- **Autorización:** quién puede ejecutar cada operación y sobre qué ámbito.
- **Aislamiento:** cómo se evita tocar datos de otra privada o de otra vivienda.
- **Datos personales:** cuáles se piden y para qué (minimización).
- **Auditoría:** qué deja rastro.
- **Límites de entrada:** tamaños y longitudes máximas.

## 7. Preguntas abiertas y cambios pendientes
| # | Tema | Estado |
|---|---|---|
| P-01 | | Abierta / Resuelta / Planificada / Cambio pendiente del PRD |

## 8. Historial
| Versión | Fecha | Cambio |
|---|---|---|
| 0.1 | AAAA-MM-DD | Primera versión |
