# Deploy — Hospedagem Compartilhada Locaweb (FTP)

Site estático (Next.js) + API (PHP/Lumen) na mesma hospedagem compartilhada Linux, sem
SSH permanente, sem Composer/Node no servidor, sem processo persistente. Testado
localmente ponta a ponta com Apache real (mesma estrutura de `.htaccess` por diretório
que a Locaweb usa) antes de escrever este guia — não é teórico.

## 1. A estrutura: mesmo domínio, dividido por path

```
public_html/
├── index.html, _next/, corpo-clinico/, ...   ← site estático (saída de web/out)
├── .htaccess                                  ← deploy/root.htaccess
└── api/                                       ← conteúdo de api/ (Lumen)
    ├── index.php, .htaccess
    ├── app/, bootstrap/, database/, routes/, vendor/, storage/
    ├── uploads/                                ← vira /api/uploads/* pro navegador
    └── .env                                    ← só no servidor, nunca sobe por FTP
```

Isso faz toda chamada `fetch("/api/...")` do navegador ser **same-origin** — mesmo
esquema, host e porta do site. Consequência direta: **CORS não precisa ser configurado**
pro fluxo funcionar (o middleware CORS do Lumen continua existindo como camada
defensiva, não é o que faz o same-origin funcionar), e o cookie de sessão
(`gastrovita_token`, httpOnly, `SameSite=Lax`) funciona exatamente como já está, sem
precisar de `SameSite=None` nem `Domain` explícito.

Os dois `.htaccess` não colidem: o Apache resolve por diretório físico primeiro, então
`public_html/.htaccess` nunca intercepta requests que já caem dentro de
`public_html/api/`.

## 2. Por que o frontend precisou de mudanças de código

O Next.js original usa Server Components com `cookies()` pra checar login e `fetch`
com `revalidate`/`no-store` pra buscar dados a cada request — isso roda num processo
Node a cada acesso. Hospedagem compartilhada não roda Node, então o frontend em `web/`
foi buildado como **export estático** (`output: "export"`), que gera HTML uma vez, no
build. Duas consequências reais, já implementadas:

- **O admin virou um app client-side.** `(protected)/layout.tsx` agora busca
  `/api/auth/me` no navegador (via `useCurrentUser()`) em vez de checar cookie no
  servidor; as páginas de edição (`doctors/edit`, `videos/edit` etc.) buscam o registro
  pelo `?id=` da query string via `useApiResource()`, em vez de rota dinâmica
  `[id]` renderizada no servidor — rota dinâmica exigiria `generateStaticParams`
  enumerando todo `id` existente no build, o que quebraria pra registros criados depois.
- **O conteúdo público fica congelado até o próximo build.** Sem ISR, editar um médico
  no painel não aparece sozinho no site — precisa rodar `deploy/build-package.sh` de
  novo e subir o resultado. O painel admin em si funciona na hora (fala direto com a
  API); só as páginas públicas (home, corpo clínico, exames, etc.) é que exigem rebuild.

## 3. O que sobe por FTP

Rode `deploy/build-package.sh` (ver README.md) — ele gera `dist/` com exatamente o que
subir, já excluindo `.env`, `.git`, `node_modules` e as pastas de dev
(`tests/`, `Dockerfile.dev`, `docker-compose.yml`). Suba o **conteúdo** de `dist/` pra
`public_html/`.

- `dist/api/vendor/` sobe — foi gerado localmente
  (`composer install --no-dev --optimize-autoloader`) porque o servidor não roda
  `composer install`.
- `dist/api/uploads/*` — sobe a estrutura de pastas; depois disso é a aplicação que
  grava ali (uploads feitos pelo painel). **Nunca apague essa pasta num redeploy.**
- `dist/api/storage/` precisa ter permissão de escrita pro processo PHP do servidor
  (logs e cache de rate-limit são gravados ali em runtime). Em teste local via Docker
  isso exigiu `chmod` manual por causa de mismatch de usuário entre o bind mount e o
  `www-data` do container — na Locaweb isso normalmente não é problema porque o PHP
  roda como o dono da própria conta (o mesmo usuário do FTP), mas **confirme depois do
  primeiro deploy** fazendo login no admin; se dor 500 mencionando `storage/logs`,
  ajuste a permissão da pasta pelo gerenciador de arquivos do painel.

## 4. Onde fica o `.env` de produção

Um único `dist/api/.env`, criado **direto no servidor** (nunca sobe por FTP dentro do
pacote — o script de build já exclui). Baseie-se em `api/.env.example`, com estas
diferenças pra produção:

| Variável | Produção |
|---|---|
| `APP_ENV` | `production` |
| `APP_DEBUG` | `false` |
| `APP_URL` | `https://gastrovita.com.br/api` |
| `DB_*` | credenciais do MySQL da Locaweb (host geralmente não é `127.0.0.1` — confirme no painel) |
| `WEB_ORIGIN` | `https://gastrovita.com.br` (usado no CORS defensivo e nas URLs de redirect pós-OAuth do YouTube) |
| `JWT_SECRET` | gere um novo valor aleatório longo (`openssl rand -hex 32`) — não reaproveite o de dev |
| `YOUTUBE_CLIENT_ID` / `SECRET` / `REDIRECT_URI` | credenciais do Google Cloud Console pro domínio final; `YOUTUBE_REDIRECT_URI` = `https://gastrovita.com.br/api/youtube/callback` |

## 5. Versão do PHP e banco

- PHP **8.1 ou superior** no painel da Locaweb (desenvolvido e testado contra 8.1.34).
- MySQL: crie o banco/usuário no painel, rode as migrations localmente apontando pro
  MySQL de produção (se a Locaweb permitir conexão externa), ou localmente contra um
  MySQL espelho e importe o dump via phpMyAdmin:
  ```bash
  cd api
  DB_HOST=<host-producao> DB_PORT=3306 DB_DATABASE=<banco> DB_USERNAME=<user> DB_PASSWORD=<senha> \
    docker run --rm --network host -e DB_HOST -e DB_PORT -e DB_DATABASE -e DB_USERNAME -e DB_PASSWORD \
    -v "$(pwd)":/app -w /app gastrovita-php-dev:8.1 php artisan migrate --force
  ```
- Dados existentes do Postgres do projeto Node: `php artisan migrate:from-postgres`
  (ver README.md), rodado do mesmo jeito contra o MySQL de produção (ou local + dump).

## 6. Ordem de deploy (primeira vez)

1. Banco: crie/migre/importe (seção 5) — sem precisar do domínio final ainda.
2. Suba `dist/api/` (sem `dist/api/.env`) pra `public_html/api/`, crie o `.env` de
   produção direto no servidor (seção 4).
3. Confirme `https://gastrovita.com.br/api/health` → `{"ok":true}` antes de seguir.
4. Rode `API_URL=https://gastrovita.com.br/api ./deploy/build-package.sh` — isso builda
   o frontend contra a API já publicada (o build faz fetch de verdade nela pra gerar as
   páginas) e monta `dist/` de novo, agora com `dist/index.html` etc.
5. Suba o restante de `dist/` (tudo exceto `api/`, que já está lá) pra `public_html/`.
6. Teste o login do admin em `https://gastrovita.com.br/admin/login`.

## 7. O que foi adaptado por causa da hospedagem compartilhada

| Item | Adaptação | Por quê |
|---|---|---|
| Frontend (Next.js) | Export estático (`output:"export"`), admin virou client-side, sem ISR | Sem Node no servidor — coberto em detalhe na seção 2 |
| Upload de vídeo (`POST /videos/upload`) | Devolve uma URL de upload resumível do YouTube; o navegador envia o arquivo direto pro Google | Vídeos de até 2GB não cabem nos limites de upload/execução de hospedagem compartilhada |
| Rate limiting (login e formulário de contato) | Contador em `Cache::store('file')` do Lumen em vez de memória de processo | PHP compartilhado roda como processos curtos, sem estado entre requests |
| Cliente do YouTube | Chamadas HTTP diretas via Guzzle em vez do SDK `google/apiclient` | O SDK sozinho baixa ~200MB de definições de todas as APIs do Google — inviável numa `vendor/` versionada + FTP |
| Banco de dados | PostgreSQL → MySQL | Padrão da hospedagem compartilhada Locaweb |
| IDs | String (UUID) em vez de inteiro autoincremental | Preserva o contrato `id: string` que o frontend já espera |
| `vendor/` do Composer | Versionado / empacotado por `build-package.sh` | O servidor não roda `composer install` |
| CORS entre front e API | Eliminado por estrutura (mesmo domínio, `/api`) em vez de configurado | Ver seção 1 |
| Filas, workers, WebSockets | Não existiam no Node original | Confirmado por busca no código-fonte — nada a adaptar |
| Envio de e-mail | Mantido ausente (decisão consciente) | O Node original também nunca enviava e-mail |

## 8. Se um dia o frontend sair desse domínio

Caso decida hospedar o frontend em Vercel (ou outro host Node) no futuro, deixa de ser
same-origin:

- Cookie precisa de `SameSite=None; Secure`
- CORS no Lumen passa a ser essencial — `WEB_ORIGIN` tem que bater exatamente com a
  nova origem
- As chamadas `fetch("/api/...")` relativas no admin precisam virar URL completa da API
- Ganha de volta SSR/ISR de verdade — as adaptações da seção 2 deixam de ser necessárias

O backend Lumen não muda nesse cenário, só a configuração de CORS/cookie.
