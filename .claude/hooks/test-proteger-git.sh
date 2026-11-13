#!/usr/bin/env bash
# Prueba de regresión de proteger-git.sh.
# Crea dos repos temporales (uno en main y otro en una rama) y pasa cada
# comando por el hook, comparando la decisión con la esperada.
#
#   uso: bash .claude/hooks/test-proteger-git.sh

set -uo pipefail

hook="$(cd "$(dirname "$0")" && pwd)/proteger-git.sh"
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

en_main="$tmp/en-main"
en_rama="$tmp/en-rama"
for r in "$en_main" "$en_rama"; do
  git init -q -b main "$r"
  git -C "$r" -c user.name=t -c user.email=t@t commit -q --allow-empty -m init
  git -C "$r" branch -q sesion-x
done
git -C "$en_rama" switch -q sesion-x
sha=$(git -C "$en_main" rev-parse --short HEAD)

fallos=0
probar() { # repo esperado comando
  local out rc r
  out=$(jq -n --arg c "$3" --arg d "$1" '{tool_input: {command: $c}, cwd: $d}' | bash "$hook" 2>&1)
  rc=$?
  if ((rc == 2)); then r=deny; elif [[ "$out" == *'"ask"'* ]]; then r=ask; else r=allow; fi
  if [[ "$r" == "$2" ]]; then
    printf 'OK     %-5s [%s] %s\n' "$r" "$(basename "$1")" "$3"
  else
    printf 'FALLA  esperado=%s obtenido=%s [%s] %s\n' "$2" "$r" "$(basename "$1")" "$3"
    ((fallos++))
  fi
}

echo "--- checkout / switch"
probar "$en_main" deny  'git checkout -- README.md && git commit -m x'
probar "$en_main" deny  'git checkout . && git commit -m x'
probar "$en_main" allow 'git checkout -b x main && git commit -m x'
probar "$en_main" allow 'git switch -c x && git commit -m x'
probar "$en_main" allow 'git checkout -b x && git commit -m x'
probar "$en_main" allow 'git checkout sesion-x && git commit -m x'
probar "$en_main" deny  'git checkout HEAD && git commit -m x'
probar "$en_main" allow "git checkout $sha && git commit -m x"
probar "$en_main" deny  'git branch nueva && git checkout nueva && git commit -m x'
probar "$en_rama" deny  'git checkout main && git commit -m x'
probar "$en_rama" deny  'git switch main && git commit -m x'
probar "$en_rama" allow 'git checkout main -- archivo && git commit -m x'

echo "--- commit / merge / push"
probar "$en_main" deny  'git commit -m x'
probar "$en_rama" allow 'git commit -m x'
probar "$en_rama" deny  'git merge main'
probar "$en_rama" allow 'git merge --abort'
probar "$en_rama" deny  'git push origin main'
probar "$en_rama" allow 'git push -u origin sesion-x'
probar "$en_main" deny  'git push'
probar "$en_rama" deny  'gh pr merge 1'
probar "$en_main" deny  'git push origin HEAD'
probar "$en_main" deny  'git push -u origin HEAD'
probar "$en_rama" allow 'git push origin HEAD'
probar "$en_rama" deny  'git push origin HEAD:main'
probar "$en_rama" deny  'git push origin x:refs/heads/main'
probar "$en_rama" deny  'git push origin refs/heads/main'
probar "$en_rama" allow 'git push origin HEAD:refs/heads/sesion-x'
probar "$en_rama" ask   'git push origin +sesion-x'
probar "$en_rama" deny  'git push origin :sesion-x'

echo "--- pull"
probar "$en_main" deny  'git pull'
probar "$en_rama" deny  'git pull origin main'
probar "$en_rama" allow 'git pull --ff-only'
probar "$en_rama" ask   'git pull --rebase'
probar "$en_rama" deny  'git pull --rebase=false'
probar "$en_rama" deny  'git pull --ff-only --no-ff'

echo
if ((fallos)); then echo "$fallos caso(s) fallaron"; exit 1; fi
echo "Todos los casos pasan"
