#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────
# git-flow-release.sh
#
# Automatiza o fluxo git flow após finalizar uma feature:
#   1. Detecta o número da feature atual (ex: featr-308 → 308)
#   2. Cria a release rls-<N>
#   3. Finaliza a release
#   4. Push main + develop + tags
#   5. Cria a próxima feature featr-<N+1>
# ─────────────────────────────────────────────────────────

# Pega o nome da branch atual
CURRENT_BRANCH=$(git branch --show-current)

# Valida que estamos numa branch de feature
if [[ ! "$CURRENT_BRANCH" =~ ^feature/featr-([0-9]+)$ ]]; then
  echo "❌ Erro: branch atual não é uma feature válida (esperado: feature/featr-NNN)"
  echo "   Branch atual: $CURRENT_BRANCH"
  exit 1
fi

# Extrai o número da feature
FEATURE_NUM="${BASH_REMATCH[1]}"
NEXT_NUM=$((FEATURE_NUM + 1))

RELEASE_NAME="rls-${FEATURE_NUM}"
NEXT_FEATURE="featr-${NEXT_NUM}"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Feature atual:   featr-${FEATURE_NUM}"
echo "  Release:         ${RELEASE_NAME}"
echo "  Próxima feature: ${NEXT_FEATURE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verifica se há alterações não commitadas
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "❌ Erro: existem alterações não commitadas. Faça commit antes de continuar."
  exit 1
fi

read -rp "Continuar? (s/N) " CONFIRM
if [[ "$CONFIRM" != "s" && "$CONFIRM" != "S" ]]; then
  echo "Operação cancelada."
  exit 0
fi

echo ""
echo "🔀 Finalizando feature featr-${FEATURE_NUM}..."
git flow feature finish "featr-${FEATURE_NUM}"

echo ""
echo "📦 Criando release ${RELEASE_NAME}..."
git flow release start "${RELEASE_NAME}"

echo ""
echo "✅ Finalizando release ${RELEASE_NAME}..."
GIT_MERGE_AUTOEDIT=no git flow release finish -m "release finish ${RELEASE_NAME}" "${RELEASE_NAME}"

echo ""
echo "🚀 Enviando para o remoto (main + develop + tags)..."
git push origin main develop --follow-tags

echo ""
echo "🌱 Criando nova feature ${NEXT_FEATURE}..."
git flow feature start "${NEXT_FEATURE}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Concluído!"
echo "  Branch atual: feature/${NEXT_FEATURE}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
