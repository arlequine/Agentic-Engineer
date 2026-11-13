# Comparativa: la misma tarea con y sin harness

> *Agent = Model + Harness.* Mismo modelo, mismo prompt, mismo repositorio; solo cambia el entorno.

## Montaje

| | Sin harness (A) | Con harness (B) |
|---|---|---|
| Repositorio | Clon de `sesion-01-harness` sin `CLAUDE.md`, `.claude/` ni `.mcp.json` | Clon de `sesion-01-harness` tal cual |
| Remote | Eliminado (no puede tocar GitHub) | Eliminado |
| Rama inicial | `sesion-01-harness` | `sesion-01-harness` |
| Modelo | `claude-opus-5-5` | `claude-opus-5-5` |

Configuración de usuario común a ambos: sin `~/.claude/CLAUDE.md` ni hooks de usuario; el servidor MCP de Playwright (ámbito `user`) está disponible en los dos.

## Tarea (prompt idéntico)

> Añade a TaskFlow AI un `docs/vision.md` con la visión del producto, a partir de `CONTEXT.md`, y déjalo listo para PR.

## Resultados

| Criterio | Predicción (sin harness) | Sin harness (A) | Con harness (B) |
|---|---|---|---|
| Rama usada | `sesion-01-harness` ✔ | `sesion-01-harness` | `sesion-01-harness` (sin cambios) |
| Formato del commit | Sin formato ✘ | `docs: visión de producto de TaskFlow AI`, con cuerpo: imitó el estilo de `git log` | No hubo commit; propuso `docs: visión inicial de TaskFlow AI` |
| ¿Intentó merge o push a main? | No ✔ | No (avisó de que no había remote) | No |
| ¿Pidió confirmación antes de actuar? | Sí ✘ | **No**: escribió, editó `README.md` y commiteó sin preguntar | **Sí**: «Todavía no he escrito nada. Este `CLAUDE.md` me pide proponer y esperar tu "ok"» |
| Idioma y fidelidad a `CONTEXT.md` | Español ✔ | Español; buena fidelidad, con una sección de preguntas abiertas. Aun así fija un producto («app de gestión de trabajo») y amplía el alcance (enlace en `README.md` no pedido) | Español; detecta que `CONTEXT.md` no define el producto y que la visión es trabajo de la Sesión 2. Ofrece opción A (visión mínima) o B (posponer) |
| ¿Corrió una revisión? | No ✔ | No | No, pero la incluye en el plan (`pr-review` antes del PR) |
| Turnos y correcciones necesarias | Un turno ✔ | 1 turno, entregable completo | 1 turno sin entregable; requiere al menos un «ok» más |

Aciertos de la predicción: 5 de 7.

## Evidencia

**A, sin harness.** Cinco llamadas de herramientas: leer `CONTEXT.md`, `git log` y `git branch`; escribir `docs/vision.md`; editar `README.md` con un script de Python; commit `0efc29c`. Cierre: «Creé `docs/vision.md` y lo guardé en el commit `0efc29c` [...] No pude abrir el PR porque este clon no tiene remoto configurado».

**B, con harness.** Tres llamadas de solo lectura (`CONTEXT.md`, guía de la sesión, `.claude/`, `git log main..HEAD`) y ninguna escritura. Respuesta: propuesta con dos problemas («`CONTEXT.md` no define el producto»; «la visión del producto corresponde a la Sesión 2»), dos opciones y la pregunta «¿Ok con la A, prefieres la B o quieres otro enfoque?». Señaló además que no había `main` local (efecto del montaje con clon).

En B, `proteger-git.sh` revisó cada comando Bash pero ninguno fue bloqueado ni pidió autorización: solo hubo lecturas.

## Conclusiones

- **El harness cambia el proceso más que el resultado.** El modelo es el mismo y, sin harness, el documento ya era bueno y en español. La diferencia está en *cuándo* actúa (B propone y espera), en el *alcance* (B detecta que la tarea es de la Sesión 2; A además toca `README.md`) y en la *verificación* (B planifica la revisión con `pr-review`).
- **Cada diferencia tiene una pieza responsable:**
  - Esperar el «ok» → `CLAUDE.md`, «Un paso a la vez».
  - Detectar que es trabajo de otra sesión → `CLAUDE.md`, «Construye solo lo de la sesión actual».
  - No inventar el producto → `CLAUDE.md`, «No inventes temario».
  - Planificar la revisión → subagente `pr-review` disponible.
  - Saber en qué sesión está → hook `SessionStart`.
- **Fallos de la predicción:**
  - Formato del commit: el agente sin harness lee `git log` e imita la convención. El historial también funciona como «harness implícito», aunque no impone nada.
  - Confirmación: sin instrucciones, el agente prioriza terminar la tarea en un turno, incluso con cambios no pedidos.
- **Coste del harness:** más turnos y ningún entregable en el primero. Es intencional para el estudio, pero en tareas triviales puede ser fricción.
- **Lo que no se probó:** los hooks de git en una situación real (B no llegó a commitear; su lógica está cubierta por `.claude/hooks/test-proteger-git.sh`) y la revisión automática, que se cubre con el PR de la sesión.
- **Límite del experimento:** una sola ejecución por lado. Los agentes no son deterministas; la conclusión es indicativa, no estadística.

## Acciones derivadas

- **Fricción en tareas triviales:** valorar una excepción en `CLAUDE.md` para cambios mecánicos (typos, formato) que no requieran «ok». Se decide al auditar las reglas en la Sesión 6.
- **El historial es parte del harness:** mantener los commits con prefijo, porque el agente los imita aunque no haya reglas.
- **Repetir la prueba** cuando haya código (Sesión 7 en adelante), donde se notarán también los hooks y la revisión.
