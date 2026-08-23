#!/usr/bin/env bash
#
# Checklist de paridade (Fase 4): sobe a API local e testa as 52 rotas contra
# o comportamento documentado da API Node original (status code e formato de
# resposta, em casos de sucesso e de erro/validação).
#
# Requer: docker, a imagem gastrovita-php-dev:8.1 já construída
# (`docker build -t gastrovita-php-dev:8.1 -f Dockerfile.dev .`), o MySQL de
# dev rodando (`docker compose up -d mysql`), curl e jq.
#
# Reseta o banco de dev (migrate:fresh) — não rode isso contra dados que
# você queira manter.

set -uo pipefail
cd "$(dirname "$0")/../.."

BASE_URL="http://127.0.0.1:8000"
IMAGE="gastrovita-php-dev:8.1"
SERVER_NAME="gastrovita-php-parity-check"
COOKIES_ADMIN=$(mktemp)
COOKIES_EDITOR=$(mktemp)

PASS=0
FAIL=0
FAILURES=()

pass() { PASS=$((PASS+1)); echo "  OK   $1"; }
fail() { FAIL=$((FAIL+1)); FAILURES+=("$1"); echo "  FALHOU  $1"; }

assert_status() {
  local desc="$1" expected="$2" actual="$3"
  if [ "$expected" = "$actual" ]; then pass "$desc (status $actual)"; else fail "$desc (esperado $expected, veio $actual)"; fi
}

assert_json_eq() {
  local desc="$1" expected="$2" actual="$3"
  if [ "$expected" = "$actual" ]; then pass "$desc"; else fail "$desc (esperado '$expected', veio '$actual')"; fi
}

# request METHOD PATH [DATA_JSON] [COOKIE_JAR] [EXTRA_CURL_ARGS...]
# Preenche as globais $STATUS e $BODY.
request() {
  local method="$1" path="$2" data="${3:-}" jar="${4:-}"
  shift 4 2>/dev/null || shift $#
  local args=(-s -w '\n%{http_code}' -X "$method")
  [ -n "$jar" ] && args+=(-b "$jar" -c "$jar")
  if [ -n "$data" ]; then
    args+=(-H "Content-Type: application/json" -d "$data")
  fi
  local out
  out=$(curl "${args[@]}" "$@" "${BASE_URL}${path}")
  STATUS=$(echo "$out" | tail -n1)
  BODY=$(echo "$out" | sed '$d')
}

cleanup() {
  docker rm -f "$SERVER_NAME" >/dev/null 2>&1
  rm -f "$COOKIES_ADMIN" "$COOKIES_EDITOR"
}
trap cleanup EXIT

echo "== Preparando banco limpo =="
docker run --rm --network host -v "$(pwd)":/app -w /app "$IMAGE" php artisan migrate:fresh --force || { echo "migrate:fresh falhou"; exit 1; }

# O rate-limit (login/contact-submissions) usa Cache::store('file'), que persiste
# em disco entre execuções do script (e entre testes manuais feitos antes dele).
# Sem isso, reexecutar o script pode começar já com o limite estourado.
rm -rf storage/framework/cache/data/*

docker run --rm --network host -v "$(pwd)":/app -w /app "$IMAGE" php -r '
require "/app/vendor/autoload.php";
$app = require "/app/bootstrap/app.php";
$app->boot();
\App\Models\AdminUser::create([
    "email" => "super@parity.test", "passwordHash" => password_hash("supersenha123", PASSWORD_BCRYPT, ["cost"=>10]),
    "name" => "Super", "role" => "SUPER_ADMIN",
]);
' || { echo "seed falhou"; exit 1; }

echo "== Subindo servidor local =="
docker rm -f "$SERVER_NAME" >/dev/null 2>&1
docker run -d --name "$SERVER_NAME" --network host -v "$(pwd)":/app -w /app "$IMAGE" php -S 0.0.0.0:8000 -t public >/dev/null
sleep 1

echo
echo "== /health =="
request GET /health
assert_status "GET /health" 200 "$STATUS"
assert_json_eq "GET /health body" '{"ok":true}' "$BODY"

echo
echo "== /auth =="
request POST /auth/login '{}'
assert_status "POST /auth/login sem campos" 400 "$STATUS"
assert_json_eq "  mensagem" "email e password são obrigatórios" "$(echo "$BODY" | jq -r .error)"

request POST /auth/login '{"email":"super@parity.test","password":"errada"}'
assert_status "POST /auth/login senha errada" 401 "$STATUS"

request POST /auth/login '{"email":"super@parity.test","password":"supersenha123"}' "$COOKIES_ADMIN"
assert_status "POST /auth/login sucesso" 200 "$STATUS"
assert_json_eq "  role retornada" "SUPER_ADMIN" "$(echo "$BODY" | jq -r .role)"
grep -q gastrovita_token "$COOKIES_ADMIN" && pass "cookie gastrovita_token setado" || fail "cookie gastrovita_token setado"

request GET /auth/me "" "$COOKIES_ADMIN"
assert_status "GET /auth/me autenticado" 200 "$STATUS"

request GET /auth/me
assert_status "GET /auth/me sem cookie" 401 "$STATUS"

request PUT /auth/me/password '{"currentPassword":"errada","newPassword":"novasenha123"}' "$COOKIES_ADMIN"
assert_status "PUT /auth/me/password senha atual errada" 401 "$STATUS"

request PUT /auth/me/password '{"currentPassword":"supersenha123","newPassword":"curta"}' "$COOKIES_ADMIN"
assert_status "PUT /auth/me/password nova senha curta" 400 "$STATUS"

echo
echo "== /users =="
request POST /users '{"email":"editor@parity.test","password":"editorsenha123","role":"EDITOR"}' "$COOKIES_ADMIN"
assert_status "POST /users cria editor" 201 "$STATUS"
EDITOR_ID=$(echo "$BODY" | jq -r .id)

request POST /users '{"email":"editor@parity.test","password":"outrasenha123"}' "$COOKIES_ADMIN"
assert_status "POST /users email duplicado" 409 "$STATUS"

request POST /users '{"email":"x@x.com","password":"curta"}' "$COOKIES_ADMIN"
assert_status "POST /users senha curta" 400 "$STATUS"

request POST /auth/login '{"email":"editor@parity.test","password":"editorsenha123"}' "$COOKIES_EDITOR"
assert_status "login do editor" 200 "$STATUS"

request GET /users "" "$COOKIES_EDITOR"
assert_status "GET /users como EDITOR (deve ser 403)" 403 "$STATUS"

request GET /users "" "$COOKIES_ADMIN"
assert_status "GET /users como SUPER_ADMIN" 200 "$STATUS"

ADMIN_ID=$(curl -s -b "$COOKIES_ADMIN" "$BASE_URL/auth/me" | jq -r .id)
request PUT "/users/${ADMIN_ID}" '{"active":false}' "$COOKIES_ADMIN"
assert_status "desativar o único super-admin ativo (deve falhar)" 400 "$STATUS"

request PUT "/users/${EDITOR_ID}" '{"role":"SUPER_ADMIN"}' "$COOKIES_ADMIN"
assert_status "promove editor a super-admin" 200 "$STATUS"

request PUT "/users/${ADMIN_ID}" '{"active":false}' "$COOKIES_ADMIN"
assert_status "agora desativar o primeiro admin funciona" 200 "$STATUS"

# COOKIES_ADMIN acabou de virar sessão de um admin desativado (passo anterior) —
# a partir daqui quem está ativo é o COOKIES_EDITOR (promovido a SUPER_ADMIN).
request PUT "/users/${EDITOR_ID}" '{"role":"EDITOR"}' "$COOKIES_EDITOR"
assert_status "rebaixar o único super-admin ativo restante (deve falhar)" 400 "$STATUS"
# Reverte a desativação pra não travar o resto do script (rotas admin usam COOKIES_ADMIN).
request PUT "/users/${ADMIN_ID}" '{"active":true}' "$COOKIES_EDITOR"

request PUT "/users/00000000-0000-0000-0000-000000000000" '{"name":"x"}' "$COOKIES_ADMIN"
assert_status "PUT /users/:id inexistente" 404 "$STATUS"

request PUT "/users/${EDITOR_ID}/reset-password" '{"newPassword":"curta"}' "$COOKIES_ADMIN"
assert_status "reset-password curta" 400 "$STATUS"
request PUT "/users/${EDITOR_ID}/reset-password" '{"newPassword":"novasenhalonga123"}' "$COOKIES_ADMIN"
assert_status "reset-password ok" 200 "$STATUS"

request DELETE "/users/${EDITOR_ID}" "" "$COOKIES_ADMIN"
assert_status "soft-delete de usuário" 200 "$STATUS"
assert_json_eq "  active=false" "false" "$(echo "$BODY" | jq -r .active)"

echo
echo "== /doctors =="
request POST /doctors '{}' "$COOKIES_ADMIN"
assert_status "POST /doctors sem name" 400 "$STATUS"

request POST /doctors '{"name":"João da Silva"}' "$COOKIES_ADMIN"
assert_status "POST /doctors sucesso" 201 "$STATUS"
DOCTOR_ID=$(echo "$BODY" | jq -r .id)
assert_json_eq "  slug gerado" "joao-da-silva" "$(echo "$BODY" | jq -r .slug)"

request POST /doctors '{"name":"João da Silva"}' "$COOKIES_ADMIN"
assert_json_eq "  slug duplicado vira -2" "joao-da-silva-2" "$(echo "$BODY" | jq -r .slug)"

request POST /doctors '{"name":"x"}'
assert_status "POST /doctors sem auth" 401 "$STATUS"

request GET /doctors
assert_status "GET /doctors público" 200 "$STATUS"
assert_json_eq "  2 médicos ativos" "2" "$(echo "$BODY" | jq 'length')"

request GET "/doctors/${DOCTOR_ID}"
assert_status "GET /doctors/:id" 200 "$STATUS"

request GET "/doctors/inexistente"
assert_status "GET /doctors/:id 404" 404 "$STATUS"

request PUT "/doctors/${DOCTOR_ID}" '{"name":"João Silva Editado"}' "$COOKIES_ADMIN"
assert_status "PUT /doctors/:id" 200 "$STATUS"
assert_json_eq "  slug não muda ao editar nome" "joao-da-silva" "$(echo "$BODY" | jq -r .slug)"

request DELETE "/doctors/${DOCTOR_ID}" "" "$COOKIES_ADMIN"
assert_status "DELETE /doctors/:id" 204 "$STATUS"
request GET "/doctors/${DOCTOR_ID}"
assert_status "GET /doctors/:id após delete" 404 "$STATUS"

echo
echo "== /videos =="
request POST /videos '{}' "$COOKIES_ADMIN"
assert_status "POST /videos sem campos" 400 "$STATUS"

request POST /videos '{"title":"Video 1","youtubeId":"nao-e-valido!!"}' "$COOKIES_ADMIN"
assert_status "POST /videos youtubeId inválido" 400 "$STATUS"

request POST /videos '{"title":"Video 1","youtubeId":"https://www.youtube.com/watch?v=dQw4w9WgXcQ"}' "$COOKIES_ADMIN"
assert_status "POST /videos extrai id de URL" 201 "$STATUS"
VIDEO_ID=$(echo "$BODY" | jq -r .id)
assert_json_eq "  youtubeId extraído" "dQw4w9WgXcQ" "$(echo "$BODY" | jq -r .youtubeId)"

request PUT "/videos/${VIDEO_ID}" '{"title":"Video 1 editado"}' "$COOKIES_ADMIN"
assert_json_eq "  slug não muda ao editar título" "video-1" "$(echo "$BODY" | jq -r .slug)"

request POST /videos/upload '{}' "$COOKIES_ADMIN"
assert_status "POST /videos/upload sem título" 400 "$STATUS"

request POST /videos/upload '{"title":"x"}' "$COOKIES_ADMIN"
assert_status "POST /videos/upload sem conta YouTube conectada" 502 "$STATUS"

request DELETE "/videos/${VIDEO_ID}" "" "$COOKIES_ADMIN"
assert_status "DELETE /videos/:id" 204 "$STATUS"

echo
echo "== /youtube =="
request GET /youtube/status "" "$COOKIES_ADMIN"
assert_status "GET /youtube/status" 200 "$STATUS"
assert_json_eq "  connected=false" "false" "$(echo "$BODY" | jq -r .connected)"

# COOKIES_EDITOR já foi soft-deletado no bloco anterior — usa uma conta EDITOR nova.
COOKIES_EDITOR2=$(mktemp)
request POST /users '{"email":"editor2@parity.test","password":"editorsenha123","role":"EDITOR"}' "$COOKIES_ADMIN"
request POST /auth/login '{"email":"editor2@parity.test","password":"editorsenha123"}' "$COOKIES_EDITOR2"

request GET /youtube/connect "" "$COOKIES_EDITOR2"
assert_status "GET /youtube/connect como EDITOR (deve ser 403)" 403 "$STATUS"
rm -f "$COOKIES_EDITOR2"

request GET /youtube/callback
assert_status "GET /youtube/callback sem code (redirect)" 302 "$STATUS"

echo
echo "== CRUD simples: faqs, insurances, exams =="
for RES in faqs insurances exams; do
  case "$RES" in
    faqs) PAYLOAD='{"question":"Q?","answer":"A."}'; NOTFOUND_MSG="Pergunta não encontrada" ;;
    insurances) PAYLOAD='{"name":"Convênio X"}'; NOTFOUND_MSG="Convênio não encontrado" ;;
    exams) PAYLOAD='{"name":"Exame X"}'; NOTFOUND_MSG="Exame não encontrado" ;;
  esac

  request POST "/$RES" '{}' "$COOKIES_ADMIN"
  assert_status "POST /$RES sem campos obrigatórios" 400 "$STATUS"

  request POST "/$RES" "$PAYLOAD" "$COOKIES_ADMIN"
  assert_status "POST /$RES sucesso" 201 "$STATUS"
  ID=$(echo "$BODY" | jq -r .id)

  request GET "/$RES"
  assert_status "GET /$RES público" 200 "$STATUS"

  request GET "/$RES/inexistente"
  assert_status "GET /$RES/:id 404" 404 "$STATUS"
  assert_json_eq "  mensagem 404" "$NOTFOUND_MSG" "$(echo "$BODY" | jq -r .error)"

  request PUT "/$RES/$ID" '{"order":5}' "$COOKIES_ADMIN"
  assert_status "PUT /$RES/:id" 200 "$STATUS"

  request DELETE "/$RES/$ID" "" "$COOKIES_ADMIN"
  assert_status "DELETE /$RES/:id" 204 "$STATUS"
done

echo
echo "== /testimonials =="
request POST /testimonials '{"type":"foo"}' "$COOKIES_ADMIN"
assert_status "type inválido" 400 "$STATUS"

request POST /testimonials '{"type":"youtube"}' "$COOKIES_ADMIN"
assert_status "youtube sem youtubeId" 400 "$STATUS"

request POST /testimonials '{"type":"text","text":"Ótimo atendimento","rating":6}' "$COOKIES_ADMIN"
assert_status "rating fora de 1-5" 400 "$STATUS"

request POST /testimonials '{"type":"text","text":"Ótimo atendimento","authorName":"Fulano"}' "$COOKIES_ADMIN"
assert_status "criação válida (text)" 201 "$STATUS"
TESTI_ID=$(echo "$BODY" | jq -r .id)

request PUT "/testimonials/${TESTI_ID}" '{"type":"youtube"}' "$COOKIES_ADMIN"
assert_status "muda pra youtube sem youtubeId (deve falhar)" 400 "$STATUS"

request GET "/testimonials/${TESTI_ID}"
assert_json_eq "  imageUrl não vaza pra type=text" "null" "$(echo "$BODY" | jq -r .imageUrl)"

request DELETE "/testimonials/${TESTI_ID}" "" "$COOKIES_ADMIN"
assert_status "DELETE testimonial" 204 "$STATUS"

echo
echo "== /contact =="
request GET /contact
assert_status "GET /contact vazio" 200 "$STATUS"
assert_json_eq "  corpo é 'null' literal" "null" "$BODY"

request PUT /contact '{"phone":123}' "$COOKIES_ADMIN"
assert_status "PUT /contact tipo inválido" 400 "$STATUS"

request PUT /contact '{"phone":"(86) 99999-0000"}' "$COOKIES_ADMIN"
assert_status "PUT /contact cria (primeira vez)" 200 "$STATUS"

request GET /contact
assert_json_eq "  GET reflete o phone salvo" "(86) 99999-0000" "$(echo "$BODY" | jq -r .phone)"

echo
echo "== /contact-submissions =="
# O rate-limit (20/15min) conta QUALQUER request nesta rota, mesmo as que falham
# na validação (o throttle roda antes do handler) — igual ao express-rate-limit
# do Node. Por isso o script contabiliza cada POST feito aqui pra acertar a conta
# no teste de rate-limit mais abaixo.
CONTACT_SUBMISSIONS_USED=0

request POST /contact-submissions '{"name":"Fulano","email":"invalido","message":"oi"}'
CONTACT_SUBMISSIONS_USED=$((CONTACT_SUBMISSIONS_USED+1))
assert_status "email inválido" 400 "$STATUS"

request POST /contact-submissions '{"name":"Fulano","email":"f@f.com","message":"Preciso de ajuda"}'
CONTACT_SUBMISSIONS_USED=$((CONTACT_SUBMISSIONS_USED+1))
assert_status "POST público sucesso" 201 "$STATUS"
assert_json_eq "  resposta só tem id" "1" "$(echo "$BODY" | jq 'keys | length')"
SUBMISSION_ID=$(echo "$BODY" | jq -r .id)

request GET /contact-submissions
assert_status "GET /contact-submissions sem auth" 401 "$STATUS"

request GET /contact-submissions "" "$COOKIES_ADMIN"
assert_status "GET /contact-submissions autenticado" 200 "$STATUS"

request PUT "/contact-submissions/${SUBMISSION_ID}" '{"read":"nao-e-bool"}' "$COOKIES_ADMIN"
assert_status "PUT read não-booleano" 400 "$STATUS"

request PUT "/contact-submissions/${SUBMISSION_ID}" '{"read":true}' "$COOKIES_ADMIN"
assert_status "PUT marca como lida" 200 "$STATUS"

request DELETE "/contact-submissions/${SUBMISSION_ID}" "" "$COOKIES_ADMIN"
assert_status "DELETE contact-submission" 204 "$STATUS"

echo
echo "== rate limiting =="
echo "  (esgotando o limite de contact-submissions: 20/15min, já usamos $CONTACT_SUBMISSIONS_USED)"
REMAINING=$((20 - CONTACT_SUBMISSIONS_USED))
for i in $(seq 1 "$REMAINING"); do
  request POST /contact-submissions '{"name":"a","email":"a@a.com","message":"m"}'
done
assert_status "20ª mensagem no total ainda passa" 201 "$STATUS"
request POST /contact-submissions '{"name":"a","email":"a@a.com","message":"m"}'
assert_status "21ª mensagem no total é bloqueada (429)" 429 "$STATUS"

echo
echo "== /upload =="
echo "conteudo" > /tmp/parity-upload-test.txt
request_upload_status=$(curl -s -o /dev/null -w '%{http_code}' -X POST "$BASE_URL/upload")
assert_status "POST /upload sem auth" 401 "$request_upload_status"

request_upload_status=$(curl -s -o /dev/null -w '%{http_code}' -X POST -b "$COOKIES_ADMIN" "$BASE_URL/upload")
assert_status "POST /upload sem arquivo" 400 "$request_upload_status"

upload_out=$(curl -s -w '\n%{http_code}' -X POST -b "$COOKIES_ADMIN" -F "file=@/tmp/parity-upload-test.txt" "$BASE_URL/upload?folder=misc")
upload_status=$(echo "$upload_out" | tail -n1)
upload_body=$(echo "$upload_out" | sed '$d')
assert_status "POST /upload sucesso" 201 "$upload_status"
UPLOAD_URL=$(echo "$upload_body" | jq -r .url)
[[ "$UPLOAD_URL" == /uploads/misc/* ]] && pass "url tem o formato esperado ($UPLOAD_URL)" || fail "url tem o formato esperado (veio '$UPLOAD_URL')"
rm -f "public${UPLOAD_URL}" /tmp/parity-upload-test.txt

echo
echo "=========================================="
echo "  $PASS passou, $FAIL falhou"
echo "=========================================="
if [ "$FAIL" -gt 0 ]; then
  echo
  echo "Divergências encontradas:"
  for f in "${FAILURES[@]}"; do echo "  - $f"; done
  exit 1
fi
exit 0
