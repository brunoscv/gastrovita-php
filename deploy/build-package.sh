#!/usr/bin/env bash
#
# Monta em dist/ exatamente o que deve subir por FTP pra public_html/ na
# Locaweb: a saída estática do Next.js na raiz + a API Lumen em dist/api/.
#
# Pré-requisitos: build da API já com "composer install --no-dev
# --optimize-autoloader" feito (ver DEPLOY.md) e Node instalado só nesta
# máquina de build (não é necessário no servidor).

set -euo pipefail
cd "$(dirname "$0")/.."

API_URL="${API_URL:?defina API_URL apontando pra API já publicada, ex: https://gastrovita.com.br/api}"

echo "== Build do frontend (output: export) =="
(cd web && API_URL="$API_URL" npm run build)

echo "== Montando dist/ =="
rm -rf dist
mkdir -p dist
cp -r web/out/. dist/
cp deploy/root.htaccess dist/.htaccess

mkdir -p dist/api
rsync -a \
  --exclude .git --exclude tests --exclude Dockerfile.dev --exclude docker-compose.yml \
  --exclude .env --exclude .env.example \
  --exclude storage/framework/cache/data/*.cache \
  --exclude storage/logs/*.log \
  api/. dist/api/

echo "== Pronto: dist/ =="
echo "Suba o CONTEÚDO de dist/ pra public_html/ por FTP (dist/.env não existe —"
echo "copie o .env de produção separadamente direto no servidor, nunca por aqui)."
du -sh dist
