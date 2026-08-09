# TMDB Movies

Aplicação responsiva para explorar filmes, consultar detalhes, pesquisar títulos e manter uma lista
local de favoritos usando dados do [The Movie Database (TMDB)](https://www.themoviedb.org/).

**Aplicação publicada:** [tmbd-movies-sigma.vercel.app](https://tmbd-movies-sigma.vercel.app/)

## Funcionalidades

- Filmes populares com paginação, loading, estado vazio e recuperação de erros.
- Busca global sincronizada com a URL e destaque seguro do termo pesquisado.
- Página de detalhes com gêneros, lançamento, nota, sinopse e filmes relacionados.
- Favoritos persistidos no navegador, com ordenação e remoção.
- Layout responsivo, navegação por teclado, gerenciamento de foco e semântica acessível.
- Proxy server-side que protege as credenciais e restringe as rotas permitidas do TMDB.
- Testes unitários e de integração sem requisições externas.

## Tecnologias

- React 18 e TypeScript
- React Router
- Context API
- Fetch API
- Tailwind CSS
- Jest e React Testing Library
- Vite
- Vercel Functions

## Requisitos

- Node.js 20.19 ou superior
- npm 10 ou superior
- Credenciais de API do [TMDB](https://developer.themoviedb.org/reference/intro/getting-started)

## Configuração local

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie o arquivo local de variáveis de ambiente:

   ```powershell
   Copy-Item .env.example .env
   ```

   Em sistemas Unix:

   ```bash
   cp .env.example .env
   ```

3. Substitua os placeholders de `TMDB_READ_ACCESS_TOKEN` e `TMDB_API_KEY` pelas suas credenciais.

4. Inicie o frontend e o proxy local:

   ```bash
   npm run dev
   ```

5. Acesse `http://localhost:5173`.

## Variáveis de ambiente

| Variável                 | Obrigatória | Ambiente      | Finalidade                                      |
| ------------------------ | ----------- | ------------- | ----------------------------------------------- |
| `TMDB_READ_ACCESS_TOKEN` | Sim         | Server-side   | Autentica o proxy nas requisições ao TMDB.      |
| `TMDB_API_KEY`           | Sim         | Server-side   | Mantém a configuração da conta TMDB validada.   |
| `TMDB_PROXY_HOST`        | Não         | Somente local | Host do proxy local. Padrão: `127.0.0.1`.       |
| `TMDB_PROXY_PORT`        | Não         | Somente local | Porta do proxy local. Padrão: `8787`.           |
| `PORT`                   | Não         | Server-side   | Porta fornecida pela plataforma, quando houver. |

Não use o prefixo `VITE_` nas credenciais. Variáveis com esse prefixo são incorporadas ao bundle do
navegador e podem ser visualizadas por qualquer visitante.

## Segurança das credenciais

O navegador chama apenas `/api/tmdb`. O token é lido no servidor e enviado ao TMDB pelo proxy; ele
não aparece no código do frontend, no bundle de produção ou nas requisições feitas diretamente pelo
navegador.

O proxy também:

- permite somente os endpoints necessários;
- valida métodos, páginas, filtros e parâmetros de consulta;
- aplica timeout às chamadas externas;
- não devolve credenciais em mensagens de erro;
- configura cache apenas para recursos que podem ser compartilhados.

Arquivos `.env` são ignorados pelo Git. O `.env.example` contém somente placeholders. Se uma
credencial real for publicada no histórico do Git, remova-a do provedor e gere outra; apagar apenas o
arquivo não revoga o segredo.

## Scripts

| Comando                 | Descrição                                                     |
| ----------------------- | ------------------------------------------------------------- |
| `npm run dev`           | Executa Vite e o proxy local em paralelo.                     |
| `npm run dev:client`    | Executa apenas o frontend.                                    |
| `npm run dev:proxy`     | Executa apenas o proxy local em modo watch.                   |
| `npm run build`         | Valida o TypeScript e gera o bundle de produção.              |
| `npm run preview`       | Serve localmente o bundle de produção.                        |
| `npm run lint`          | Executa o ESLint.                                             |
| `npm run typecheck`     | Executa a verificação estática do TypeScript.                 |
| `npm test`              | Executa todos os testes uma vez.                              |
| `npm run test:watch`    | Executa os testes em modo interativo.                         |
| `npm run test:coverage` | Gera o relatório em `coverage/`.                              |
| `npm run format:check`  | Verifica a formatação com Prettier.                           |
| `npm run check`         | Executa lint, TypeScript, testes e verificação de formatação. |

## Rotas

| Caminho       | Página                                      |
| ------------- | ------------------------------------------- |
| `/`           | Filmes populares                            |
| `/movie/:id`  | Detalhes e recomendações relacionadas       |
| `/favorites`  | Lista local de favoritos                    |
| `/search?q=x` | Resultados da busca; aceita também `page=x` |

## Arquitetura

O frontend segue Clean Architecture, com regras de dependência verificadas pelo ESLint:

```text
domain <- application <- presentation
   ^           ^
   |           |
infrastructure
       ^
       |
      app (composition root)
```

Entidades e contratos ficam no domínio; casos de uso orquestram as regras; adapters de HTTP e
persistência ficam na infraestrutura; React permanece na apresentação. A composição de implementações
concretas acontece apenas em `app`.

Consulte [docs/architecture.md](docs/architecture.md) para detalhes, decisões e fluxo dos dados.

## Testes e qualidade

Os testes usam dados determinísticos e substituem o `fetch`, portanto não consomem cota do TMDB nem
dependem de credenciais. A suíte cobre mapeamento, favoritos, persistência, ordenação, destaque de
títulos e os principais fluxos de navegação.

Antes de enviar alterações, execute:

```bash
npm run check
npm run build
```

O workflow do GitHub Actions executa essas verificações em pushes para `main` e pull requests, além de
armazenar o bundle produzido como artefato.

## Deploy na Vercel

1. Importe o repositório na Vercel.
2. Cadastre `TMDB_READ_ACCESS_TOKEN` e `TMDB_API_KEY` em **Settings > Environment Variables**.
3. Selecione os ambientes desejados (`Production`, `Preview` e/ou `Development`).
4. Faça um novo deploy sempre que alterar uma variável.

O `vercel.json` define o build Vite, a função de proxy, o fallback das rotas SPA, cache de assets e
headers de segurança. As variáveis não são necessárias durante o build; elas são lidas somente pela
função server-side em tempo de execução.
