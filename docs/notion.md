# Documentação do projeto — TMDB Movies

## 1. Identificação

| Item                    | Informação                                                                   |
| ----------------------- | ---------------------------------------------------------------------------- |
| Projeto                 | TMDB Movies                                                                  |
| Repositório             | [github.com/ecpieritz/tmbd-movies](https://github.com/ecpieritz/tmbd-movies) |
| Aplicação publicada     | [tmbd-movies-gold.vercel.app](https://tmbd-movies-gold.vercel.app/)        |
| Fonte de dados          | The Movie Database (TMDB)                                                    |
| Idioma da interface     | Português do Brasil                                                          |
| Persistência do usuário | Armazenamento local do navegador                                             |

## 2. Resumo executivo

O TMDB Movies é uma aplicação web responsiva para descoberta de filmes. A solução permite consultar
filmes populares, pesquisar títulos, acessar informações detalhadas, visualizar obras relacionadas e
manter uma lista persistente de favoritos.

O projeto foi construído com React e TypeScript, seguindo Clean Architecture e princípios SOLID. A
integração com o TMDB acontece por meio de um proxy server-side, impedindo que o token de leitura e a
chave da API sejam incorporados ao bundle público do navegador.

A aplicação possui tratamento explícito de loading, erros e estados vazios, navegação acessível,
testes unitários e de integração, pipeline de qualidade no GitHub Actions e deploy na Vercel.

## 3. Objetivos do projeto

- Demonstrar domínio de React, TypeScript e hooks.
- Consumir e transformar dados de uma API REST.
- Implementar navegação e URLs compartilháveis.
- Gerenciar estado global sem acoplar regras à interface.
- Persistir preferências do usuário entre sessões.
- Aplicar uma arquitetura organizada, testável e escalável.
- Proteger credenciais em um repositório público.
- Entregar uma interface responsiva e acessível.
- Automatizar verificações de qualidade e build.

## 4. Requisitos técnicos atendidos

| Requisito           | Implementação                                           |
| ------------------- | ------------------------------------------------------- |
| React 18+           | React 18.3                                              |
| TypeScript          | Tipagem estrita em todas as camadas                     |
| React Router        | Rotas públicas, parâmetros e query strings              |
| Estado global       | Context API para catálogo e favoritos                   |
| Requisições HTTP    | Fetch encapsulado por `HttpClient`                      |
| Estilização         | Tailwind CSS                                            |
| Testes unitários    | Jest e React Testing Library                            |
| Arquitetura limpa   | Domain, Application, Infrastructure, Presentation e App |
| Deploy              | Vercel com função serverless                            |
| Integração contínua | GitHub Actions                                          |

## 5. Funcionalidades

### 5.1. Home

- Exibe os filmes populares fornecidos pelo TMDB.
- Apresenta poster, título, nota e ação de favorito.
- Usa grid responsivo para diferentes tamanhos de tela.
- Possui skeleton de carregamento.
- Exibe mensagem de erro com opção de tentar novamente.
- Exibe estado vazio quando a API não retorna resultados.
- Possui paginação com:
  - primeira página;
  - página anterior;
  - páginas numeradas;
  - página atual destacada;
  - salto para uma página digitada;
  - próxima página;
  - última página.

### 5.2. Busca

- A barra de busca está disponível no header global.
- A busca automática começa a partir de dois caracteres.
- Um debounce reduz chamadas desnecessárias enquanto o usuário digita.
- O foco permanece no campo durante o refinamento dos resultados.
- O termo pesquisado fica sincronizado com `?q=termo`.
- A página atual fica sincronizada com `&page=n`.
- O termo é destacado nos títulos sem injeção de HTML.
- Resultados, loading, erros, estado vazio e paginação seguem o padrão da Home.

### 5.3. Detalhes do filme

- Exibe backdrop ou poster como imagem principal.
- Exibe título, gêneros, data de lançamento, nota e sinopse.
- Permite adicionar ou remover o filme dos favoritos.
- Possui botão para voltar à rota anterior, com fallback para a Home.
- Sugere filmes relacionados a partir dos gêneros do filme atual.
- Remove o próprio filme da lista de sugestões.

### 5.4. Favoritos

- Favoritos podem ser adicionados pela Home, busca, detalhes e relacionados.
- O coração preenchido comunica o estado atual.
- A lista permanece disponível após fechar e reabrir o navegador.
- O usuário pode ordenar por:
  - título de A a Z;
  - título de Z a A;
  - maior nota.
- Cada card possui uma ação de remoção.
- Quando a lista fica vazia, um call-to-action direciona para a Home.

## 6. Rotas

| Rota                 | Responsabilidade                 |
| -------------------- | -------------------------------- |
| `/`                  | Filmes populares                 |
| `/movie/:id`         | Detalhes e filmes relacionados   |
| `/favorites`         | Favoritos armazenados localmente |
| `/search?q=termo`    | Resultados da pesquisa           |
| `/search?q=x&page=n` | Página específica dos resultados |
| `*`                  | Página não encontrada            |

O `vercel.json` possui um fallback para `index.html`, permitindo atualizar ou acessar diretamente
qualquer rota do React Router sem receber erro 404 da hospedagem.

## 7. Jornadas principais

### Explorar e favoritar

1. O usuário acessa a Home.
2. A aplicação carrega os filmes populares.
3. O usuário seleciona o coração de um card.
4. O filme é salvo no estado global e no `localStorage`.
5. O coração passa a ser exibido como preenchido.
6. O filme fica disponível na página de favoritos.

### Pesquisar um filme

1. O usuário digita pelo menos dois caracteres no header.
2. Após o debounce, a URL é atualizada.
3. A página de busca solicita os resultados ao proxy.
4. Novos caracteres refinam a pesquisa.
5. O termo pesquisado é destacado em cada título correspondente.
6. A paginação mantém o termo e atualiza somente o parâmetro `page`.

### Consultar detalhes e relacionados

1. O usuário seleciona o poster ou o título de um card.
2. O React Router abre `/movie/:id`.
3. Os detalhes são carregados pelo caso de uso correspondente.
4. Após receber os gêneros, a aplicação consulta filmes relacionados.
5. O usuário pode favoritar o filme principal ou uma recomendação.

### Remover todos os favoritos

1. O usuário acessa `/favorites`.
2. Seleciona a lixeira de um ou mais cards.
3. Cada remoção atualiza Context API e `localStorage`.
4. Ao remover o último item, a aplicação apresenta o estado vazio.
5. O botão “Explorar filmes” retorna à Home.

## 8. Tecnologias e responsabilidades

| Tecnologia            | Responsabilidade                                         |
| --------------------- | -------------------------------------------------------- |
| React                 | Composição da interface                                  |
| TypeScript            | Contratos, segurança de tipos e documentação do código   |
| React Router          | Navegação, parâmetros, query strings e fallback de rotas |
| Context API           | Disponibilização de serviços e favoritos                 |
| Fetch API             | Transporte HTTP                                          |
| Tailwind CSS          | Layout, responsividade e design tokens                   |
| Vite                  | Ambiente de desenvolvimento e build                      |
| Jest                  | Execução e cobertura de testes                           |
| React Testing Library | Testes orientados ao comportamento do usuário            |
| Vercel Functions      | Proxy server-side em produção                            |
| GitHub Actions        | Integração contínua                                      |

## 9. Arquitetura

### 9.1. Camadas

```text
src/
|-- app/              # Composition root e roteamento
|-- domain/           # Entidades e contratos
|-- application/      # Casos de uso
|-- infrastructure/   # HTTP, TMDB e armazenamento
|-- presentation/     # React, contexts, hooks, páginas e componentes
`-- test/             # Fixtures, mocks e suporte de integração

server/               # Proxy local e política de acesso ao TMDB
api/                  # Entrada serverless da Vercel
```

### 9.2. Regra de dependência

- O domínio não conhece React, Fetch, TMDB ou armazenamento.
- Casos de uso dependem de contratos do domínio.
- A infraestrutura implementa os contratos internos.
- A apresentação consome casos de uso por meio de contexts.
- A camada `app` conecta implementações concretas aos contratos.
- O ESLint impede imports que violem as fronteiras arquiteturais.

### 9.3. Fluxo de dados

```text
Página React
  -> hook de apresentação
  -> caso de uso
  -> contrato de repositório
  -> implementação TMDB
  -> data source
  -> HttpClient
  -> /api/tmdb
  -> TMDB API
```

Na resposta, os dados percorrem o caminho inverso. DTOs são validados, mapeados para entidades internas
e só então disponibilizados à interface.

## 10. Princípios de design

### Responsabilidade única

Cada unidade possui uma responsabilidade principal: componentes renderizam, hooks controlam estado de
requisição, casos de uso orquestram regras, mappers transformam dados e adapters lidam com sistemas
externos.

### Inversão de dependência

Casos de uso dependem de `MovieRepository` e `FavoriteMovieRepository`. Eles não conhecem Fetch,
localStorage ou o formato do TMDB.

### Segregação de interfaces

Os contratos de filmes e favoritos são separados. Cada consumidor depende apenas das operações de que
precisa.

### Aberto para extensão

É possível trocar o armazenamento local por uma API remota ou substituir o cliente HTTP criando novos
adapters, sem alterar as regras centrais.

### Imutabilidade

Entidades, resultados paginados e coleções relevantes são congelados nas fronteiras para reduzir
efeitos colaterais.

## 11. Gerenciamento de estado

### MovieCatalogContext

Disponibiliza instâncias estáveis dos casos de uso:

- filmes populares;
- busca;
- detalhes;
- relacionados.

O context não armazena respostas da API. Cada hook controla o estado específico de sua requisição.

### FavoritesContext

Mantém a coleção global de favoritos e oferece:

- consulta da lista;
- verificação por ID;
- alternância entre favorito e não favorito;
- remoção por ID.

Uma referência interna evita operações com versões antigas do estado quando ações acontecem em rápida
sequência.

## 12. Persistência local

Os favoritos usam a chave versionada `moviedb:favorites:v1`.

Formato conceitual:

```json
{
  "version": 1,
  "items": []
}
```

Antes de restaurar os dados, o adapter verifica IDs, textos, imagens, data, nota e gêneros. Entradas
inválidas são ignoradas, IDs duplicados são consolidados e um cache corrompido não impede a aplicação
de iniciar.

Essa persistência é limitada ao navegador e dispositivo atuais. Ela não representa uma lista da conta
TMDB e não exige autenticação do usuário.

## 13. Integração com o TMDB

### Endpoints utilizados

| Operação              | Endpoint TMDB     | Uso na aplicação    |
| --------------------- | ----------------- | ------------------- |
| Filmes populares      | `/movie/popular`  | Home                |
| Pesquisa              | `/search/movie`   | Página de busca     |
| Detalhes              | `/movie/{id}`     | Página de detalhes  |
| Descoberta por gênero | `/discover/movie` | Filmes relacionados |

### Imagens

- Posters: `https://image.tmdb.org/t/p/w300/{poster_path}`
- Backdrops: `https://image.tmdb.org/t/p/original/{backdrop_path}`

Quando uma imagem não existe ou falha ao carregar, um componente de fallback mantém a proporção do
card e fornece uma descrição acessível.

### Validação das respostas

O projeto não assume que a API sempre retornará dados válidos. Parsers verificam tipos em runtime
antes do mapeamento. Uma resposta incompatível é convertida em falha controlada e apresentada pelo
estado de erro da interface.

## 14. Proxy server-side e segurança

O frontend nunca chama `api.themoviedb.org` diretamente. Todas as leituras passam por `/api/tmdb`.

### Motivos para usar o proxy

- Manter o token fora do JavaScript público.
- Não expor credenciais no DevTools do navegador.
- Restringir os endpoints disponíveis.
- Validar parâmetros antes de chamar o serviço externo.
- Padronizar timeout, erros e cache.

### Política do proxy

- Aceita somente requisições `GET`.
- Mantém uma allowlist de rotas.
- Mantém uma allowlist de query parameters para cada rota.
- Limita páginas entre 1 e 500.
- Exige termo não vazio nas pesquisas.
- Restringe os filtros de descoberta.
- Aplica timeout de 10 segundos.
- Não devolve stack traces nem credenciais.
- Repassa `retry-after` quando fornecido pelo TMDB.

### Variáveis protegidas

| Variável                 | Uso                                              |
| ------------------------ | ------------------------------------------------ |
| `TMDB_READ_ACCESS_TOKEN` | Autorização Bearer enviada pelo servidor ao TMDB |
| `TMDB_API_KEY`           | Configuração validada da conta TMDB              |

Nenhuma delas possui prefixo `VITE_`. Esse prefixo tornaria a variável acessível no bundle do
navegador.

## 15. Estados da interface

Cada fluxo assíncrono representa explicitamente:

- `loading`: skeleton e anúncio para tecnologia assistiva;
- `success`: conteúdo ou estado vazio;
- `error`: mensagem clara e botão de nova tentativa;
- `invalid`: usado quando o ID da rota não representa um filme válido.

Hooks ignoram respostas de requisições que deixaram de ser atuais, evitando que buscas antigas
substituam resultados mais recentes.

## 16. Acessibilidade

- Estrutura semântica com header, nav, main, sections, headings, lists e forms.
- Link “Pular para o conteúdo principal”.
- Foco visível em controles interativos.
- Gerenciamento de foco após navegações do SPA.
- Preservação do foco durante a busca automática.
- Áreas interativas com tamanho mínimo adequado para toque.
- Labels acessíveis em botões representados por ícones.
- `aria-current` na página atual da paginação.
- `aria-pressed` em ações de favorito.
- Regiões `aria-live` para carregamento, página e quantidade de favoritos.
- Contraste reforçado para textos, botões e estados de erro.
- Animações condicionadas à preferência por movimento reduzido.
- Documento identificado com `lang="pt-BR"`.

## 17. Responsividade

- O grid começa com duas colunas e cresce progressivamente até seis.
- Header reorganiza logo, navegação e busca em telas estreitas.
- Detalhes usam uma coluna em telas menores e duas em desktop.
- Paginação permite quebra de linha sem perder controles.
- Tipografia, espaçamentos e áreas de toque se adaptam aos breakpoints.
- Imagens usam proporções fixas para evitar mudanças bruscas de layout.

## 18. Estratégia de testes

### Testes unitários

- Mappers do TMDB.
- Adição e remoção de favoritos.
- Persistência e recuperação do cache local.
- Ordenação dos favoritos.
- Destaque seguro do termo pesquisado.
- Controles da paginação.
- Busca automática com debounce.

### Testes de integração

- Roteamento.
- Loading e sucesso da Home.
- Erro e nova tentativa.
- Busca, destaque e paginação pela URL.
- Detalhes e relacionados.
- Jornada completa de favoritos.

### Isolamento

O `fetch` é substituído por um mock tipado. A suíte não acessa a internet, não consome cota do TMDB e
não depende de credenciais.

## 19. Qualidade e integração contínua

O workflow `.github/workflows/ci.yml` é executado em pull requests e pushes para `main`.

### Job de qualidade

1. Faz checkout do repositório.
2. Configura Node.js 20.19.
3. Instala versões exatas com `npm ci`.
4. Executa ESLint, TypeScript, Jest e Prettier por meio de `npm run check`.

### Job de build

1. Aguarda o job de qualidade.
2. Instala as dependências em ambiente limpo.
3. Executa o build de produção.
4. Armazena `dist/` como artefato temporário.

Execuções anteriores do mesmo branch são canceladas quando uma versão mais recente é enviada.

## 20. Configuração local

### Pré-requisitos

- Node.js 20.19 ou superior.
- npm 10 ou superior.
- Token de leitura e chave da API do TMDB.

### Instalação

```bash
npm install
```

### Arquivo de ambiente

No PowerShell:

```powershell
Copy-Item .env.example .env
```

No macOS ou Linux:

```bash
cp .env.example .env
```

Preencher:

```dotenv
TMDB_READ_ACCESS_TOKEN=seu_token_de_leitura
TMDB_API_KEY=sua_chave_da_api
TMDB_PROXY_HOST=127.0.0.1
TMDB_PROXY_PORT=8787
```

Os valores acima são apenas nomes ilustrativos. Credenciais reais não devem ser adicionadas à
documentação ou ao Git.

### Execução

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Proxy: `http://127.0.0.1:8787`

## 21. Scripts

| Script                  | Responsabilidade                 |
| ----------------------- | -------------------------------- |
| `npm run dev`           | Frontend e proxy local           |
| `npm run dev:client`    | Apenas o Vite                    |
| `npm run dev:proxy`     | Apenas o proxy em modo watch     |
| `npm run proxy`         | Proxy sem watch                  |
| `npm run build`         | TypeScript e bundle de produção  |
| `npm run preview`       | Prévia local de `dist/`          |
| `npm run lint`          | ESLint                           |
| `npm run typecheck`     | Verificação do TypeScript        |
| `npm test`              | Suíte completa uma vez           |
| `npm run test:watch`    | Jest em modo watch               |
| `npm run test:coverage` | Relatório de cobertura           |
| `npm run format:check`  | Verificação do Prettier          |
| `npm run check`         | Lint, tipos, testes e formatação |

## 22. Deploy na Vercel

1. Importar o repositório do GitHub.
2. Confirmar o framework Vite.
3. Cadastrar `TMDB_READ_ACCESS_TOKEN`.
4. Cadastrar `TMDB_API_KEY`.
5. Selecionar os ambientes em que cada variável estará disponível.
6. Iniciar o deploy.
7. Fazer redeploy depois de alterar uma variável.

O `vercel.json` configura:

- instalação com `npm ci`;
- build com `npm run build`;
- diretório público `dist`;
- rewrite para a função do TMDB;
- fallback das rotas do SPA;
- cache imutável de assets versionados;
- Content Security Policy;
- políticas de referrer, permissões, frames e MIME sniffing.

## 23. Decisões técnicas

### Context API em vez de Redux

O estado global é pequeno e possui operações bem delimitadas. Context API atende ao escopo sem
adicionar uma dependência ou uma camada de configuração maior.

### Paginação em vez de infinite scroll

Paginação facilita navegação por teclado, retorno a uma posição conhecida, compartilhamento de URL e
salto direto para uma página.

### Favoritos locais em vez da conta TMDB

Favoritos da conta exigiriam autenticação e sessão de usuário. O armazenamento local atende ao desafio,
mantém a experiência entre acessos e evita ampliar o tratamento de dados pessoais.

### Filmes relacionados por gênero

A página usa descoberta por gêneros e popularidade. Essa abordagem reaproveita os dados dos detalhes e
permite explicar objetivamente o motivo da recomendação.

### Proxy próprio

Além de esconder o token, o proxy funciona como uma fronteira de segurança. O frontend só acessa uma
parte controlada da API externa.

## 24. Limitações conhecidas

- Favoritos não são sincronizados entre navegadores ou dispositivos.
- Limpar os dados do site remove a lista local.
- Não existe login de usuário.
- A lista não é gravada na conta TMDB.
- Recomendações são baseadas em gêneros e popularidade, não em personalização individual.
- Disponibilidade, imagens e traduções dependem dos dados fornecidos pelo TMDB.
- A busca começa com dois caracteres para equilibrar velocidade e quantidade de requisições.

## 25. Melhorias futuras

- Autenticação opcional com o TMDB.
- Sincronização de favoritos entre dispositivos.
- Watchlist separada da lista de favoritos.
- Testes end-to-end em navegador real com Playwright.
- Internacionalização da interface.
- PWA e suporte offline parcial.
- Observabilidade de erros e performance.
- Filtros adicionais por gênero, ano e nota.
- Compartilhamento público de listas.

## 26. Troubleshooting

### A Home não carrega filmes

1. Confirmar que o frontend e o proxy estão ativos.
2. Conferir `TMDB_PROXY_PORT`.
3. Verificar se o token não contém espaços ou o prefixo `Bearer` duplicado.
4. Consultar a resposta de `/api/tmdb/movie/popular` na aba Network.

### A Vercel retorna `SERVER_MISCONFIGURED`

1. Conferir os nomes exatos das variáveis.
2. Confirmar que foram adicionadas ao ambiente do deploy atual.
3. Fazer redeploy após salvar as variáveis.

### Uma rota funciona pela navegação, mas falha ao atualizar

Confirmar que o deploy está usando o `vercel.json` com fallback para `/index.html`.

### Os favoritos desapareceram

Verificar se os dados do site foram apagados, se o navegador está em modo privado ou se a aplicação
foi aberta em outro domínio.

### Os testes falham localmente

1. Confirmar a versão do Node.js.
2. Remover apenas `node_modules` e executar `npm ci` novamente.
3. Executar `npm run typecheck` para separar erros de tipos.
4. Executar `npm test -- --runInBand` para investigar a suíte.

## 27. Checklist de entrega

- [x] React 18 e TypeScript.
- [x] Roteamento com React Router.
- [x] Estado global com Context API.
- [x] Requisições com Fetch.
- [x] Tailwind CSS.
- [x] Home com filmes populares.
- [x] Busca automática, destaque e paginação.
- [x] Detalhes e filmes relacionados.
- [x] Favoritos persistentes e ordenação.
- [x] Loading, erros e estados vazios.
- [x] Responsividade.
- [x] Acessibilidade.
- [x] Testes unitários e de integração.
- [x] README e documentação arquitetural.
- [x] `.env.example` sem segredos.
- [x] Pipeline de CI.
- [x] Hospedagem na Vercel.

## 28. Metadados sugeridos para o GitHub

### Descrição em inglês

> Responsive movie discovery app built with React, TypeScript, and the TMDB API, featuring live search,
> pagination, movie details, related titles, persistent favorites, accessible UI, automated tests, and
> a secure server-side proxy.

### Website

`https://tmbd-movies-gold.vercel.app/`

### Tópicos

```text
react
typescript
vite
tailwindcss
tmdb-api
movie-app
react-router
context-api
clean-architecture
solid-principles
jest
react-testing-library
accessibility
responsive-design
vercel
serverless
frontend-challenge
```

## 29. Conclusão

O TMDB Movies atende aos requisitos funcionais e técnicos do desafio enquanto mantém separação clara
de responsabilidades, segurança das credenciais, experiência acessível e uma base preparada para
evolução. A combinação de contratos, casos de uso, adapters e testes reduz o custo de manutenção e
permite substituir detalhes externos sem reescrever as regras centrais.
