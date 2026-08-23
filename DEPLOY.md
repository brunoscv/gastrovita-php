# Deploy — Hospedagem Compartilhada Locaweb (FTP)

Este projeto foi feito pra rodar num plano de hospedagem compartilhada Linux (tipo
"Hospedagem II Linux"): sem SSH permanente, sem Composer no servidor, sem processo
Node/daemon, deploy só via FTP.

## 1. O que sobe por FTP

Sobe **o projeto inteiro**, exceto o que está no `.gitignore` (que já reflete o que
não deve ir: `.env`, cache do Laravel em `storage/framework/*`, etc.). Em particular:

- `vendor/` **sobe** — foi gerado localmente (`composer install --no-dev
  --optimize-autoloader`) porque o servidor não roda `composer install`.
- `public/uploads/*` — sobe a estrutura de pastas; o conteúdo real (fotos, logos)
  também sobe na primeira vez, mas depois disso é a aplicação que grava ali (uploads
  feitos pelo painel admin). Nunca apague essa pasta num redeploy.
- `storage/` sobe com as subpastas vazias (`logs`, `framework/cache/data`,
  `framework/views`) — são gravadas em runtime, mas as pastas precisam existir e ter
  permissão de escrita (chmod 775 costuma bastar; hospedagem compartilhada normalmente
  já cuida disso automaticamente por dono do processo PHP).
- `database/migrations/` sobe, mas **não precisa rodar migration nenhuma no
  servidor** — o schema já foi criado direto no MySQL de produção (ver seção 4).

Antes de gerar o pacote final pra FTP, rode localmente:

```bash
docker run --rm -v "$(pwd)":/work -w /work composer:2 install --no-dev --optimize-autoloader
```

Isso remove `fakerphp/faker`, `mockery/mockery` e `phpunit/phpunit` do `vendor/`
(são só de desenvolvimento), deixando o pacote menor pro FTP.

## 2. Onde fica o `.env` de produção

Um único `.env` na raiz do projeto (mesmo nível de `artisan`, `composer.json`), **fora**
de `public/` em ambas as variantes de document root da seção 3 — nunca deixe o `.env`
acessível via HTTP. Baseie-se em `.env.example`, com estas diferenças pra produção:

| Variável | Produção |
|---|---|
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` (nunca deixe `true` em produção — vaza stack trace) |
| `APP_URL` | URL final do domínio da API |
| `DB_*` | credenciais do MySQL fornecidas pela Locaweb (host geralmente **não** é `127.0.0.1`, é algo como `mysql.suaconta.hospedagemdesites.ws` — confirme no painel) |
| `WEB_ORIGIN` | URL final do frontend Next.js (ex.: `https://www.gastrovita.com.br`) |
| `JWT_SECRET` | gere um novo valor aleatório longo (ex.: `openssl rand -hex 32`) — **não** reaproveite o valor de dev |
| `YOUTUBE_CLIENT_ID` / `YOUTUBE_CLIENT_SECRET` / `YOUTUBE_REDIRECT_URI` | credenciais do Google Cloud Console cadastradas pro domínio final; o redirect URI tem que bater exatamente |

## 3. Versão do PHP no painel

Configure **PHP 8.1 ou superior** no painel da Locaweb (cPanel costuma ter um seletor
de versão de PHP por domínio). O projeto foi desenvolvido e testado contra PHP 8.1.34.

## 4. Banco de dados

1. Crie o banco MySQL e o usuário pelo painel da Locaweb.
2. Rode as migrations **localmente**, apontando pro MySQL de produção (a maioria dos
   planos Locaweb permite conexão externa ao MySQL por IP liberado — confirme no
   painel; se não permitir, rode as migrations contra um MySQL local idêntico e depois
   exporte/importe o dump via phpMyAdmin):
   ```bash
   DB_HOST=<host-producao> DB_PORT=3306 DB_DATABASE=<banco> DB_USERNAME=<user> DB_PASSWORD=<senha> \
     docker run --rm --network host -e DB_HOST -e DB_PORT -e DB_DATABASE -e DB_USERNAME -e DB_PASSWORD \
     -v "$(pwd)":/app -w /app gastrovita-php-dev:8.1 php artisan migrate --force
   ```
3. Importe os dados existentes do Postgres do projeto Node (ver `README.md`, seção
   "Importando os dados do Postgres antigo") — rode contra o MySQL de produção do
   mesmo jeito, ou localmente e depois exporte um `.sql` (`mysqldump`) pra importar
   via phpMyAdmin se a Locaweb não permitir conexão externa direta.

## 5. Document root — duas variantes

Você não sabe ainda qual dessas o painel da Locaweb permite. Escolha uma só.

### Variante A — domínio aponta direto pra `public/` (preferível)

Se o painel permitir configurar o document root do domínio/subdomínio apontando pra
dentro da pasta do projeto (`.../gastrovita-php/public`), não precisa mexer em nada:
suba o projeto inteiro como está, aponte o document root pra `public/`, pronto. Os
arquivos `public/index.php` e `public/.htaccess` já estão prontos pra isso.

### Variante B — domínio só aponta pra `public_html/` (raiz)

Se o painel só permite apontar o domínio pra `public_html/` e você não consegue
apontar pra uma subpasta:

1. Suba o projeto inteiro pra uma pasta **fora** de `public_html` (ex.: um diretório
   `gastrovita-api/` no mesmo nível), **ou** direto dentro de `public_html/` mesmo
   (menos ideal, mas funciona já que o `.env` não é servido por HTTP de qualquer jeito
   — o Apache só serve o que casar com as regras do `.htaccess`).
2. Copie o conteúdo de `deploy/variant-b-document-root-na-raiz/` (`index.php` e
   `.htaccess`) pra dentro de `public_html/`, **sobrescrevendo** o `index.php` e
   `.htaccess` que vieram de `public/` nessa cópia.
3. Copie também o conteúdo de `public/uploads/` pra `public_html/uploads/` (ou ajuste
   o caminho conforme onde a pasta do projeto ficou).
4. Esse `index.php` alternativo já aponta `require __DIR__.'/bootstrap/app.php'` (sem
   subir um nível, já que ele passa a ficar ao lado de `bootstrap/`, não mais dentro de
   `public/`).

## 6. O que foi adaptado por causa da hospedagem compartilhada

| Item | Adaptação | Por quê |
|---|---|---|
| Upload de vídeo (`POST /videos/upload`) | Passou a devolver uma URL de upload resumível do YouTube em vez de receber o arquivo — o navegador do admin envia o arquivo direto pro Google | Vídeos de até 2GB não cabem nos limites de `upload_max_filesize`/`max_execution_time` de hospedagem compartilhada, e não dá pra garantir que o painel permita alterar esses limites |
| Rate limiting (login e formulário de contato) | Contador em `Cache::store('file')` do Lumen em vez de memória de processo (`express-rate-limit`) | PHP em hospedagem compartilhada roda como processos curtos (PHP-FPM/CGI) que não mantêm estado entre requests; arquivo em disco sobrevive sem precisar de Redis |
| Cliente do YouTube | Chamadas HTTP diretas via Guzzle em vez do SDK `google/apiclient` | O SDK oficial sozinho baixa ~200MB de definições de *todas* as APIs do Google (Sheets, Drive, Calendar...); numa `vendor/` versionada + FTP isso é inviável. As únicas chamadas usadas (OAuth2 token exchange, `channels.list`, upload resumível) são simples o bastante pra fazer direto |
| Banco de dados | PostgreSQL → MySQL | Hospedagem compartilhada Locaweb não costuma oferecer Postgres gerenciado; MySQL é o padrão do plano |
| IDs | Mantidos como string (UUID no lugar do cuid do Prisma) | O Eloquent, por padrão, usa inteiro autoincremental; o frontend espera `id: string` em todo lugar — preservar string evita qualquer ajuste no Next.js |
| `vendor/` do Composer | Versionado no Git | O servidor não roda `composer install`; o pacote pronto tem que ir por FTP |
| Filas, workers, WebSockets | Não existiam no Node original — nada a adaptar | Confirmado por busca no código-fonte original: nenhuma ocorrência |
| Envio de e-mail | Mantido ausente (decisão consciente, confirmada com o usuário) | O Node original também nunca enviava e-mail (nem notificação de contato, nem recuperação de senha) |

## 7. Exceção no frontend: upload de vídeo

Esta é a única rota cujo **contrato** muda de verdade (todas as outras 51 rotas
mantêm path, método e formato de request/response idênticos ao Node original).

**Antes (Node):** `POST /videos/upload` recebia o arquivo (`multipart/form-data`,
campo `file`) e devolvia o vídeo já criado.

**Agora (PHP):**
1. `POST /videos/upload` recebe `{ "title": "...", "published": true }` (JSON) e
   devolve `{ "uploadUrl": "<url de sessão resumível do YouTube>" }`.
2. O navegador do admin faz um `PUT` do arquivo de vídeo direto pra essa `uploadUrl`
   (fora do domínio da API — vai direto pro Google). A resposta desse `PUT` já vem com
   o recurso de vídeo criado no YouTube, incluindo o `id` (o `youtubeId`).
3. O frontend chama `POST /videos` (rota que já existe e não mudou) com
   `{ title, youtubeId, thumbnailUrl?, order?, published }` pra criar o registro no
   banco — mesma validação, mesmo formato de resposta de sempre.

**O que precisa mudar no Next.js:** só o componente de upload de vídeo do admin
(`apps/web/src/app/admin/(protected)/videos/VideoForm.tsx`), pra fazer essas 3
chamadas em sequência em vez de um único `POST` multipart. Nenhuma outra tela do
admin, nem o site público, precisa de ajuste nenhum além da variável de URL base da
API abaixo.

## 8. O que muda no Next.js (fora a exceção acima)

Só a variável de ambiente `API_URL` (usada em `apps/web/src/lib/api.ts`,
`apps/web/src/lib/session.ts`, nas páginas do admin, e no `next.config.mjs` pro
proxy `/api/:path*`) — aponte pra URL final da API em PHP. Nenhuma rota muda de path,
método ou formato de resposta.
