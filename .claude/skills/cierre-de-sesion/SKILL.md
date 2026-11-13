---
name: cierre-de-sesion
description: Cierra la sesión de estudio actual. Verifica el entregable contra el hilo conductor, corre pruebas, actualiza CONTEXT.md (estado, progreso, estructura, stack y bitácora) y abre el PR a main para que el estudiante lo apruebe y fusione manualmente.
disable-model-invocation: true
---

# Cierre de sesión

Sigue las fases en orden. Cada **⏸** es un punto de parada: muestra el resultado y espera un "ok" explícito antes de continuar. Si algo falla, detente y repórtalo; no lo rodees.

## 1. Precondiciones
- Rama actual: debe ser `sesion-NN-slug`. Si es `main`, detente.
- `git status --short` limpio. Si hay cambios, lístalos y pregunta qué hacer con ellos.
- Identifica la sesión N por la rama y localiza su fila en `CONTEXT.md` §6 ("Hilo conductor").

## 2. Verificar el entregable
- Toma la columna "Entregable de salida / verificación" de la fila de la sesión.
- Comprueba cada elemento con evidencia (archivo, comando, enlace al PR). Presenta una tabla: elemento · cumple sí/no · evidencia.
- Si falta algo, detente. Se puede recortar lo opcional, **nunca el entregable de salida**.
- **⏸**

## 3. Pruebas
- Si el proyecto tiene pruebas (por ejemplo, un script `test` en `package.json`, `pytest` o similar), ejecútalas. Deben pasar en verde.
- Si todavía no hay pruebas, dilo explícitamente. No las inventes.

## 4. Datos que solo tiene el estudiante
Pregunta en un solo bloque. No los deduzcas del repositorio:
- Horas reales dedicadas y días en que se trabajó.
- Decisiones tomadas (y por qué), dudas pendientes y aprendizajes clave.

**Información sensible:** `CONTEXT.md` se publica en GitHub. No escribas nombres de terceros (mentores, compañeros), correos, tokens ni datos privados. Si el estudiante los menciona, propón una versión anonimizada y pregunta antes de incluir nada.

## 5. Actualizar `CONTEXT.md`
- **Estado actual:** lección en curso, última completada, fecha de hoy, siguiente paso concreto y progreso (N / 15).
- **§7 Estructura del repositorio:** solo lo que existe (verifícalo con `git ls-files`).
- **§9 Stack:** solo si cambió durante la sesión.
- **§8 Bitácora:** agrega una entrada **arriba** con la plantilla de §8. Toma las horas estimadas de `PLAN.md`.
- **Nunca reescribas entradas anteriores.** Compruébalo: en `git diff CONTEXT.md` no puede haber líneas eliminadas (`-`) dentro de la bitácora.
- Muestra el diff completo. **⏸**
- Commit: `docs: cerrar sesión N en CONTEXT.md`.

## 6. Pull request
- `git push -u origin <rama>`.
- `gh pr create --base main --head <rama>` con el título `Sesión N — <título>` y un cuerpo que resuma qué se construyó y cómo se verificó el entregable.

## 7. Validaciones de GitHub
- `gh pr checks <número> --watch`. Todas deben terminar en verde.
- Si el repositorio aún no tiene checks configurados, dilo explícitamente.
- Si alguno falla, detente y muestra el log (`gh run view --log-failed`).
- **⏸**

## 8. Entrega del PR al estudiante
- **No hagas merge.** El estudiante aprueba y fusiona el PR manualmente en GitHub, sin borrar la rama. El hook de Git bloquea `git merge` y `gh pr merge`.
- Resume el cierre: entregable, enlace al PR, horas y siguiente paso.
- Cuando el estudiante confirme que hizo el merge, verifica que la rama sigue existiendo en el remoto: `git ls-remote --heads origin <rama>`.
