# Gastrovita — frontend (build estático)

Cópia do frontend Next.js adaptada pra rodar sem servidor Node (`output: "export"`),
pensada pra ficar sob o mesmo domínio da API em `../api` numa hospedagem compartilhada.
Ver [`../DEPLOY.md`](../DEPLOY.md) pra estrutura completa e o porquê das adaptações.

A versão original (Server Components com sessão via cookie no servidor, ISR) continua
existindo, sem essas adaptações, no repositório
[`gastrovita`](https://github.com/brunoscv/gastrovita) — as duas foram definitivamente
separadas.

```bash
npm install
API_URL=http://localhost:8000 npm run dev    # dev mode (com SSR — só o build final é estático)
API_URL=http://localhost:8000 npm run build  # gera web/out/
```
