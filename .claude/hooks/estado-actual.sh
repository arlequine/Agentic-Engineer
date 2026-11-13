#!/usr/bin/env bash
# Hook SessionStart — inyecta en el contexto la tabla "Estado actual" de
# CONTEXT.md y la rama actual. Nunca bloquea el arranque: siempre sale con 0.
#
# Validación: solo se inyecta si la sección contiene una tabla "| Campo | Valor |"
# de como mucho MAX_LINEAS filas. Si el formato está roto, se inyecta un aviso
# corto en lugar de arriesgarse a volcar medio CONTEXT.md.

MAX_LINEAS=15
dir="${CLAUDE_PROJECT_DIR:-.}"
archivo="$dir/CONTEXT.md"

rama=$(git -C "$dir" branch --show-current 2>/dev/null)
echo "Rama actual: ${rama:-desconocida}"

if [[ ! -f "$archivo" ]]; then
  echo "Aviso: no existe CONTEXT.md; no se pudo cargar el estado actual."
  exit 0
fi

# Primer bloque contiguo de filas de tabla tras "## Estado actual".
# Se corta al terminar la tabla, o en "---" / "## " si llegan antes.
tabla=$(awk '
  /^## Estado actual/ { dentro = 1; next }
  dentro && (/^---/ || /^## /) { exit }
  dentro && /^\|/ { print; en_tabla = 1; next }
  dentro && en_tabla { exit }
' "$archivo")

lineas=$(grep -c . <<<"$tabla")

if [[ "$(head -1 <<<"$tabla")" != "| Campo | Valor |" ]] || ((lineas > MAX_LINEAS)); then
  echo "Aviso: la sección \"Estado actual\" de CONTEXT.md no tiene el formato esperado (tabla | Campo | Valor |, máx. $MAX_LINEAS filas). Léela directamente y avisa al estudiante de que el formato está roto."
  exit 0
fi

echo "Estado actual (de CONTEXT.md):"
echo "$tabla"
exit 0
