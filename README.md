# Gastrovita — API (PHP/Lumen) + Site (Next.js estático)

Projeto combinado pra rodar inteiro numa hospedagem compartilhada Linux (Locaweb, tipo
"Hospedagem II Linux"): sem SSH permanente, sem Composer/Node no servidor, sem processo
persistente. Contém:

- **`api/`** — reescrita em PHP/Lumen 10 da API original (Node.js/Express/Prisma)
- **`web/`** — cópia do frontend Next.js, adaptada pra build estático (`next export`) —
  a versão Node original continua existindo, sem essas adaptações, no repositório
  [`gastrovita`](https://github.com/brunoscv/gastrovita)
- **`deploy/`** — script que monta o pacote final pronto pra FTP

As duas versões do frontend foram **definitivamente separadas**: o repositório `gastrovita`
segue 100% compatível com Node (SSR, ISR, ninguém precisa saber que este projeto existe pra
mexer nele); a cópia em `web/` aqui é 100% voltada a rodar sem servidor Node, com as
adaptações descritas em [`DEPLOY.md`](./DEPLOY.md).

## Como as duas partes se conectam

Mesmo domínio, dividido por path — isso elimina CORS como problema em vez de configurá-lo:

```
https://gastrovita.com.br/          → site estático (web/out, depois do build)
https://gastrovita.com.br/api/*     → API Lumen (api/)
https://gastrovita.com.br/api/uploads/*  → fotos/logos, servidos direto pelo Apache
```

Detalhes completos, incluindo por que essa estrutura foi escolhida e o que mudou no
Next.js pra funcionar sem servidor, estão em [`DEPLOY.md`](./DEPLOY.md).

## Rodando localmente

Precisa de Docker (pra API/MySQL) e Node 18+ (só pra buildar o frontend — não roda em
produção).

```bash
# --- API (Lumen) ---
cd api
docker build -t gastrovita-php-dev:8.1 -f Dockerfile.dev .
docker compose up -d mysql
docker run --rm --network host -v "$(pwd)":/app -w /app gastrovita-php-dev:8.1 php artisan migrate
docker run -d --name gastrovita-php-serve --network host -v "$(pwd)":/app -w /app gastrovita-php-dev:8.1 php -S 0.0.0.0:8000 -t .
# API em http://localhost:8000

# --- Frontend (Next.js) ---
cd ../web
npm install
API_URL=http://localhost:8000 npm run dev
# Site em http://localhost:3000 (dev mode, com SSR — só o build final é que é estático)
```

### Checklist de paridade (Fase 4)

`api/tests/parity/check.sh` sobe a API local e testa as 52 rotas contra o comportamento
documentado da API Node original (sucesso e erro/validação):

```bash
cd api && ./tests/parity/check.sh
```

Reseta o banco de dev a cada execução — depois de rodar, reimporte os dados reais com
o comando abaixo se for continuar testando pelo navegador.

### Importando os dados do Postgres antigo (uso único)

```bash
cd api
docker run --rm --network host -v "$(pwd)":/app -w /app gastrovita-php-dev:8.1 \
  php artisan migrate:from-postgres --from="postgresql://usuario:senha@host:porta/banco"
```

### Gerando o pacote de deploy

```bash
API_URL=https://gastrovita.com.br/api ./deploy/build-package.sh
```

Builda o frontend e monta `dist/` exatamente como deve subir por FTP pra
`public_html/` — ver seção de deploy no `DEPLOY.md` pra pré-requisitos (a API já
precisa estar publicada e alcançável quando esse comando roda, porque o build faz
fetch de verdade nela pra gerar as páginas públicas).

## Estrutura

```
api/                     Lumen — ver estrutura interna em DEPLOY.md
web/                     Next.js, adaptado pra output:"export"
  src/lib/useCurrentUser.ts     auth client-side (substitui getServerUser)
  src/lib/useApiResource.ts     fetch por id client-side (substitui [id]/page.tsx server)
  src/app/admin/(protected)/*/edit/page.tsx   páginas de edição (id vem de ?id=, não de rota dinâmica)
deploy/
  build-package.sh        monta dist/ (web/out/ + api/) pronto pra FTP
  root.htaccess            .htaccess da raiz do domínio (redirect legado + 404)
DEPLOY.md                  passo a passo completo de deploy
```
