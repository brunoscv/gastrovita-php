# Gastrovita API (PHP/Lumen)

Reescrita da API do Gastrovita (originalmente Node.js/Express/Prisma) em PHP com o
[Lumen](https://lumen.laravel.com/) 10, pensada para rodar em hospedagem compartilhada
Linux (deploy só via FTP, sem SSH/Composer/processo persistente no servidor).

O frontend (Next.js, em `../gastrovita/apps/web`) não muda de comportamento: mesmos
paths, métodos HTTP e formato de resposta JSON da API original — com uma única exceção
documentada em [`DEPLOY.md`](./DEPLOY.md#exceção-no-frontend-upload-de-vídeo) (upload de
vídeo passou a ser feito direto do navegador pro YouTube).

## Stack

- **Framework:** Lumen 10 (PHP ^8.1)
- **Banco:** MySQL (Eloquent), chaves primárias UUID/cuid em string — preserva o
  contrato `id: string` que o frontend já espera
- **Auth:** JWT (`firebase/php-jwt`) num cookie httpOnly, igual ao Node original
- **YouTube:** chamadas HTTP diretas via Guzzle contra o OAuth2 e a YouTube Data API v3
  (sem o SDK `google/apiclient`, que sozinho pesava ~200MB de dependências)
- **`vendor/` é versionado no Git de propósito** — o deploy é por FTP e o servidor não
  roda `composer install`

## Documentação

- [`DEPLOY.md`](./DEPLOY.md) — passo a passo de deploy via FTP, variáveis de ambiente
  de produção, e as duas variantes de document root
- Inventário completo da API Node original e o checkpoint de arquitetura: ver os
  artifacts publicados na conversa que gerou este projeto

## Rodando localmente

Não há PHP instalado fora de container neste ambiente — todo o desenvolvimento usa
Docker.

```bash
# Sobe o MySQL de desenvolvimento
docker compose up -d mysql

# Instala dependências (só precisa rodar de novo se mexer no composer.json)
docker run --rm -v "$(pwd)":/work -w /work composer:2 install

# Roda as migrations
docker run --rm --network host -v "$(pwd)":/app -w /app gastrovita-php-dev:8.1 \
  php artisan migrate

# Sobe o servidor de desenvolvimento em http://localhost:8000
docker run -d --name gastrovita-php-serve --network host \
  -v "$(pwd)":/app -w /app gastrovita-php-dev:8.1 php -S 0.0.0.0:8000 -t public
```

A imagem `gastrovita-php-dev:8.1` (PHP 8.1-cli + `pdo_mysql` + `pdo_pgsql`) é construída
localmente a partir do `Dockerfile.dev` — ela existe só pra desenvolvimento, não faz
parte do deploy.

### Importando os dados do Postgres antigo (uso único)

O projeto Node usava Postgres; a API em PHP usa MySQL. Pra trazer o conteúdo já
existente (incluindo o que foi editado no painel admin, não só o seed original):

```bash
docker run --rm --network host -v "$(pwd)":/app -w /app gastrovita-php-dev:8.1 \
  php artisan migrate:from-postgres --from="postgresql://usuario:senha@host:porta/banco"
```

Use `--dry-run` pra ver quantas linhas seriam importadas de cada tabela sem gravar nada.

## Estrutura

```
app/Http/Controllers/   Um controller por grupo de rota (Doctor, Video, Faq, ...)
app/Http/Middleware/    RequireAuth, RequireRole, ThrottleByIp, Cors
app/Models/             Um model Eloquent por tabela, IDs em UUID/string
app/Support/            Slugify, YoutubeIdExtractor, YoutubeClient (Guzzle)
app/Console/Commands/   MigrateFromPostgres (ferramenta de uso único)
database/migrations/    Schema final "squashado" (não o histórico incremental do Prisma)
routes/web.php          Mesmos paths/métodos/prefixos da API Node original
deploy/                 Arquivos alternativos pra quando o document root não pode
                         apontar direto pra public/ — ver DEPLOY.md
```
