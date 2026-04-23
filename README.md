# Product Maintenance v1

Ferramenta web para manutencao de produtos e categorias com foco em SEO, gerando Meta Title, Meta Description e Keywords para catalogos de e-commerce.

![Next.js](https://img.shields.io/badge/Next.js-16.2.4-000000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=000)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=fff)
![Biome](https://img.shields.io/badge/Lint-Biome%202.2-60A5FA)
![License](https://img.shields.io/badge/license-Private-red)

## Sumario

- [Visao geral](#visao-geral)
- [Objetivo SEO](#objetivo-seo)
- [Stack e arquitetura](#stack-e-arquitetura)
- [Como executar localmente](#como-executar-localmente)
- [Variaveis de ambiente](#variaveis-de-ambiente)
- [Scripts disponiveis](#scripts-disponiveis)
- [Fluxo de geracao SEO](#fluxo-de-geracao-seo)
- [Qualidade de codigo](#qualidade-de-codigo)
- [Contribuicao](#contribuicao)

## Visao geral

Este projeto centraliza operacoes de manutencao de dados de catalogo e automacao de metadados SEO em portugues para:

- Categorias
- Produtos

O sistema foi construido com App Router (Next.js 16), React Server Components e servicos de banco MySQL sem ORM.

## Objetivo SEO

Gerar metadados consistentes e reutilizaveis para paginas de produto e categoria, incluindo:

- Meta Title
- Meta Description
- Keywords

As regras principais ficam em `src/utils/seo-meta/` e incluem:

- Normalizacao de texto em PT-BR (`toNaturalPtBrText`)
- Geracao de keywords com limpeza e tokenizacao (`getKeywordBase`)
- Montagem de titulos e descricoes para produto e categoria
- Combinacao dinamica de termos iniciais e finais para variacao de description

## Stack e arquitetura

### Tecnologias principais

- Next.js 16.2.4
- React 19
- TypeScript 5
- Tailwind CSS v4
- Biome 2.2 (lint/format)
- Zod 4 (validacao de ambiente)
- MySQL2 (acesso a banco com SQL direto)
- shadcn/ui + Radix UI

### Estrutura resumida

```text
src/
	app/          # paginas (App Router)
	components/   # UI e componentes compartilhados
	core/         # envs, constantes, logger
	database/     # conexao e schema tipado
	services/     # servicos de DB e APIs externas
	utils/        # utilitarios, incluindo SEO meta
```

### Observacoes importantes

- `src/database/schema.ts` e gerado automaticamente. Nao editar manualmente.
- Conexao DB usa singleton em `src/database/dbConnection.ts`.
- Nao ha framework de testes configurado no momento.

## Como executar localmente

### 1. Pre-requisitos

- Node.js 20+
- pnpm 9+
- Banco MySQL acessivel com as credenciais do `.env`

### 2. Instalar dependencias

```bash
pnpm install
```

### 3. Criar arquivo .env

Crie um arquivo `.env` na raiz do projeto com os valores necessarios.

### 4. Iniciar ambiente de desenvolvimento

```bash
pnpm dev
```

Aplicacao disponivel em: http://localhost:3000

## Variaveis de ambiente

As variaveis sao validadas em `src/core/config/envs.ts`.

### Obrigatorias

- `PORT`
- `CLIENT_ID`
- `EXTERNAL_API_ASSETS_URL`
- `DATABASE_HOST`
- `DATABASE_PORT`
- `DATABASE_USER`
- `DATABASE_PASSWORD`
- `DATABASE_NAME`

### Opcionais (compatibilidade)

- `APP_ID`
- `EXTERNAL_API_MAIN_URL`
- `API_KEY`

## Scripts disponiveis

| Script | Comando | Descricao |
| --- | --- | --- |
| Dev | `pnpm dev` | Sobe app em modo desenvolvimento com dotenv |
| Build | `pnpm build` | Gera build de producao |
| Start | `pnpm start` | Executa build em producao com dotenv |
| Lint | `pnpm lint` | Verifica padroes com Biome |
| Format | `pnpm format` | Formata codigo com Biome |
| Schema | `node scripts/generate-schema.mjs` | Gera `src/database/schema.ts` a partir do MySQL |
| Release | `scripts/git-flow-release.sh` | Automatiza fluxo de release (git-flow) |

## Fluxo de geracao SEO

1. Os dados de produto/categoria sao carregados via servicos em `src/services/`.
2. Os utilitarios de `src/utils/seo-meta/` processam e normalizam os textos.
3. O sistema gera title, description e keywords para uso nas paginas e processos de manutencao.

Principais pontos de entrada:

- `src/utils/seo-meta/seo-meta-product/index.ts`
- `src/utils/seo-meta/seo-meta-category/index.ts`
- `src/utils/seo-meta/seo-meta-shared.ts`

## Qualidade de codigo

- Lint: `pnpm lint`
- Format: `pnpm format`

Padroes de estilo e regras estao em `biome.json`.

## Contribuicao

1. Crie uma branch de feature no padrao do projeto (`feature/featr-NNN`).
2. Implemente a mudanca e rode lint/format.
3. Abra PR para revisao.

Fluxo de release atual:

- `feature/featr-NNN` -> `release/rls-NNN` -> `main` e `develop`

## Status

Projeto em evolucao continua para manutencao de catalogo e melhoria de qualidade SEO.
