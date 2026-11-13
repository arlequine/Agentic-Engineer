#!/usr/bin/env bash
# Hook PreToolUse (matcher: Bash) — protege el flujo de Git del repositorio.
#
#   deny (exit 2): commit en main, push a main, borrado de ramas y cualquier
#                  merge (git merge en cualquier rama, gh pr merge, git pull
#                  sin --ff-only). Los PR los aprueba y fusiona el estudiante
#                  manualmente en GitHub.
#   ask  (JSON)  : rebase, pull --rebase, cherry-pick, tags, push --force,
#                  reset --hard, renombrar ramas.
#
# Límites conocidos: analiza el TEXTO del comando. No ve lo que ocurre dentro
# de `eval`, scripts .sh ni alias de git. Protege contra errores del agente,
# no contra quien quiera saltárselo a propósito.
#   - Parte segmentos por ; | && también dentro de comillas (posibles falsos
#     bloqueos, p. ej. `git commit -m "a; git merge"`).
#   - Una rama creada en el mismo comando (`git branch x && git checkout x`)
#     aún no existe al evaluar: se trata como ruta y la rama no cambia
#     (falso bloqueo si se estaba en main; usa `git switch -c x`).

set -uo pipefail

entrada=$(cat)
comando=$(jq -r '.tool_input.command // empty' <<<"$entrada")
cwd=$(jq -r '.cwd // empty' <<<"$entrada")
[[ -z "$comando" ]] && exit 0

rama=$(git -C "${cwd:-.}" branch --show-current 2>/dev/null || true)

denegar=()
preguntar=()

# Partir el comando en segmentos por &&, ||, ;, | y saltos de línea.
segmentos=$(sed -E 's/(\&\&|\|\||;|\|)/\n/g' <<<"$comando")

while IFS= read -r segmento; do
  read -ra t <<<"$segmento"
  ((${#t[@]} == 0)) && continue
  # Quitar comillas de cada token: "main" -> main
  for i in "${!t[@]}"; do t[i]=${t[i]//[\"\']/}; done

  # --- gh pr merge ---
  if [[ "${t[0]}" == "gh" && "${t[1]:-}" == "pr" && "${t[2]:-}" == "merge" ]]; then
    denegar+=("gh pr merge: los PR los aprueba y fusiona el estudiante en GitHub")
    continue
  fi

  [[ "${t[0]}" != "git" ]] && continue

  # Saltar opciones globales: git -C ruta, -c k=v, --git-dir=..., --no-pager...
  i=1
  while ((i < ${#t[@]})) && [[ "${t[i]}" == -* ]]; do
    case "${t[i]}" in -C|-c|--git-dir|--work-tree|--namespace) ((i++)) ;; esac
    ((i++))
  done
  sub=${t[i]:-}
  args=("${t[@]:i+1}")

  tiene() { local x; for x in "${args[@]}"; do [[ "$x" == "$1" ]] && return 0; done; return 1; }
  no_flags=(); for x in "${args[@]}"; do [[ "$x" != -* ]] && no_flags+=("$x"); done

  case "$sub" in
    checkout|switch)
      # Seguir la rama si el comando cambia de rama antes de un commit.
      #   -b/-c x [base] -> x         -- archivo     -> no cambia
      #   rama existente -> esa rama  commit (sha)   -> HEAD separado
      #   cualquier otra palabra es una ruta         -> no cambia
      destino=""
      for ((j = 0; j < ${#args[@]}; j++)); do
        case "${args[j]}" in
          -b|-B|-c|-C|--create|--force-create|--orphan) destino=${args[j+1]:-otra}; break ;;
        esac
      done
      if [[ -z "$destino" ]] && ! tiene --; then
        for x in "${args[@]}"; do
          if [[ "$x" == - ]]; then
            destino=$(git -C "${cwd:-.}" rev-parse --abbrev-ref '@{-1}' 2>/dev/null || echo otra); break
          fi
          [[ "$x" == -* ]] && continue
          [[ "$x" == HEAD ]] && break
          if git -C "${cwd:-.}" show-ref --verify --quiet "refs/heads/$x"; then
            destino=$x
          elif git -C "${cwd:-.}" rev-parse --verify --quiet "$x^{commit}" >/dev/null; then
            destino=otra
          fi
          break
        done
      fi
      [[ -n "$destino" ]] && rama=$destino ;;

    pull)
      # pull sin --ff-only puede crear un merge; con --rebase reescribe historia
      ff=0; reb=0
      for x in "${args[@]}"; do
        case "$x" in
          --ff-only) ff=1 ;;
          -r|--rebase|--rebase=true|--rebase=merges|--rebase=interactive) reb=1 ;;
          --no-rebase|--rebase=false) reb=0 ;;
        esac
      done
      if ((reb)); then preguntar+=("pull --rebase reescribe historia")
      elif ((!ff)); then denegar+=("pull puede crear un merge (usa git pull --ff-only)"); fi ;;

    commit)
      [[ "$rama" == main ]] && denegar+=("commit en main") ;;

    merge)
      # Ningún merge, en ninguna rama (salvo abortar uno en curso)
      if ! tiene --abort && ! tiene --quit; then
        denegar+=("merge (prohibido en cualquier rama)")
      fi ;;

    push)
      if tiene --delete || tiene -d; then denegar+=("borrar rama remota (push --delete)"); fi
      for x in "${no_flags[@]}"; do
        [[ "$x" == :* ]] && denegar+=("borrar rama remota (push origin :rama)")
        [[ "$x" == main || "$x" == +main || "$x" == *:main ]] && denegar+=("push a main")
        [[ "$x" == +* ]] && preguntar+=("push forzado (+refspec)")
      done
      # `git push` o `git push origin` estando en main empuja main
      [[ "$rama" == main ]] && ((${#no_flags[@]} <= 1)) && denegar+=("push a main (rama actual)")
      for x in "${args[@]}"; do
        case "$x" in
          -f|--force|--force-with-lease*|--force-if-includes) preguntar+=("push forzado ($x)") ;;
          --tags|--follow-tags) preguntar+=("publicar tags ($x)") ;;
        esac
      done ;;

    branch)
      for x in "${args[@]}"; do
        case "$x" in
          -d|-D|--delete) denegar+=("borrar rama local (branch $x)") ;;
          -m|-M|--move)   preguntar+=("renombrar rama (branch $x)") ;;
        esac
      done ;;

    update-ref)
      tiene -d && denegar+=("borrar referencia (update-ref -d)") ;;

    rebase|cherry-pick)
      tiene --abort || tiene --quit || preguntar+=("$sub reescribe historia") ;;

    tag)
      # `git tag` y `git tag -l` solo listan
      if ((${#args[@]})) && ! tiene -l && ! tiene --list; then preguntar+=("crear o modificar tags"); fi ;;

    reset)
      tiene --hard && preguntar+=("reset --hard descarta trabajo") ;;
  esac
done <<<"$segmentos"

if ((${#denegar[@]})); then
  {
    echo "Bloqueado por el harness (.claude/hooks/proteger-git.sh):"
    printf ' - %s\n' "${denegar[@]}"
    echo "No lo rodees: avisa al estudiante. Trabaja en la rama de la sesión (sesion-NN-slug); los PR los aprueba y fusiona el estudiante en GitHub."
  } >&2
  exit 2
fi

if ((${#preguntar[@]})); then
  motivo="Requiere autorización: $(IFS=';'; echo "${preguntar[*]}" | sed 's/;/; /g')"
  jq -n --arg m "$motivo" '{hookSpecificOutput: {hookEventName: "PreToolUse", permissionDecision: "ask", permissionDecisionReason: $m}}'
fi

exit 0
