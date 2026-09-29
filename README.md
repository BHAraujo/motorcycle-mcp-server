# 🏍️ Motorcycle MCP Server

Servidor [MCP (Model Context Protocol)](https://modelcontextprotocol.io) escrito em TypeScript que expõe operações de CRUD de motocicletas como **tools** para agentes de IA. O servidor atua como uma ponte entre o agente e uma API REST de motocicletas já existente, configurada via `BASE_URL`.

Construído com [`@prefecthq/fastmcp-ts`](https://www.npmjs.com/package/@prefecthq/fastmcp-ts) e validação de entrada com [Zod](https://zod.dev).

---

## 📋 Sumário

- [Arquitetura](#-arquitetura)
- [Tools disponíveis](#-tools-disponíveis)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Como executar](#-como-executar)
- [Conectando a um cliente MCP](#-conectando-a-um-cliente-mcp)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Limitações conhecidas / TODO](#-limitações-conhecidas--todo)

---

## 🧭 Arquitetura

```
┌──────────────┐   MCP (HTTP)    ┌──────────────────────────┐   REST (fetch)   ┌─────────────────────┐
│ Agente / IA  │ ──────────────► │  motorcycle-mcp-server   │ ───────────────► │ API de motocicletas │
│ (cliente MCP)│ ◄────────────── │  127.0.0.1:8080/mcp      │ ◄─────────────── │ (BASE_URL)          │
└──────────────┘                 └──────────────────────────┘                  └─────────────────────┘
```

- **Transporte:** HTTP
- **Endpoint MCP:** `http://127.0.0.1:8080/mcp`
- **Health check:** `GET http://127.0.0.1:8080/healthCheck` → `200 Motor Cycle MCP SERVER is Running...`

---

## 🛠️ Tools disponíveis

| Tool | Descrição | Parâmetros | Requisição à API |
|------|-----------|------------|------------------|
| `motorcycle_create` | Cria uma nova motocicleta | `brand` (string), `model` (string), `cc` (number), `description` (string) | `POST {BASE_URL}` |
| `motorcycle_list` | Lista todas as motocicletas cadastradas | — | `GET {BASE_URL}` |
| `motorcycle_update` | Atualiza uma motocicleta existente | `id` (number), `brand` (string), `model` (string), `cc` (number), `description` (string) | `PUT {BASE_URL}/{id}` |
| `motorcycle_delete` | Remove uma motocicleta pelo id | `id` (number) | `{BASE_URL}/{id}` |

### Modelo de dados

```ts
interface Motorcycle {
  brand: string;       // Marca (ex.: "Honda")
  model: string;       // Modelo (ex.: "CB 500F")
  cc: number;          // Cilindrada (ex.: 500)
  description: string; // Descrição livre
}
```

Todas as tools retornam o resultado da API em `structuredContent` e também como `content` do tipo texto.

---

## ✅ Pré-requisitos

- [Node.js](https://nodejs.org) 20+ (necessário suporte a `fetch` nativo e top-level `await`)
- npm
- Uma API REST de motocicletas em execução (ex.: `http://localhost:3000/motorcycles`)

---

## 📦 Instalação

```bash
git clone <url-do-repositorio>
cd motorcycle-mcp-server
npm install
```

---

## ⚙️ Configuração

Copie o arquivo de exemplo e preencha as variáveis:

```bash
cp .env.example .env
```

| Variável | Obrigatória | Descrição | Exemplo |
|----------|:-----------:|-----------|---------|
| `BASE_URL` | ✅ | URL base do recurso de motocicletas na API REST | `http://localhost:3000/motorcycles` |
| `API_TOKEN` | ✅ | Token de acesso à API (validado na inicialização) | `meu-token` |
| `PORT` | ✅ | Porta da API (padrão: `3000`) | `3000` |

**Projeto para download**
express-backend: https://github.com/BHAraujo/express-backend



> ⚠️ Se `BASE_URL` ou `API_TOKEN` não estiverem definidas, o servidor encerra com o erro `Variável de ambiente <NOME> não definida`.
>
> 🔒 O arquivo `.env` está no `.gitignore` — nunca faça commit dele.

---

## ▶️ Como executar

### Servidor MCP

```bash
npm run server
```

Inicia o servidor em modo *watch* (`tsx watch`) em `http://127.0.0.1:8080/mcp`.

Verifique se está no ar:

```bash
curl http://127.0.0.1:8080/healthCheck
```

### Cliente de teste

Com o servidor rodando, em outro terminal:

```bash
npm run client
```

O script `src/client.ts`:

1. Conecta ao servidor MCP em `http://127.0.0.1:8080/mcp`;
2. Lista as tools disponíveis (`listTools`);
3. Chama a tool `motorcycle_list`;
4. Faz uma chamada direta à API em `http://localhost:3000/motorcycles` para comparação.

---

## 🔌 Conectando a um cliente MCP

### VS Code (GitHub Copilot / agentes)

Edite `.vscode/mcp.json`:

```json
{
  "servers": {
    "motorcycle-mcp-server": {
      "type": "http",
      "url": "http://127.0.0.1:8080/mcp"
    }
  }
}
```

### Outros clientes

Qualquer cliente compatível com MCP via HTTP pode se conectar apontando para `http://127.0.0.1:8080/mcp`.

---

## 📁 Estrutura do projeto

```
motorcycle-mcp-server/
├── .vscode/
│   └── mcp.json                        # Configuração MCP para o VS Code
├── src/
│   ├── api-clients/
│   │   └── motorcycles-clients-api.ts  # Cliente HTTP da API (create, listAll, update, deleteById)
│   ├── types/
│   │   ├── motorcycle.enum.ts          # Enum HttpMethod (GET, POST, PUT, DELETE)
│   │   └── motorcycle.interface.ts     # Interfaces de request/modelo
│   ├── client.ts                       # Cliente MCP de teste
│   ├── env.ts                          # Leitura e validação das variáveis de ambiente
│   └── server.ts                       # Definição das tools e inicialização do servidor
├── .env.example
├── package.json
└── tsconfig.json
```

### Scripts

| Script | Comando | Descrição |
|--------|---------|-----------|
| `server` | `tsx watch src/server.ts` | Sobe o servidor MCP com hot reload |
| `client` | `tsx watch src/client.ts` | Executa o cliente de teste |

---

## 🚧 Limitações conhecidas / TODO

- [ ] **`motorcycle_create` / `motorcycle_update`:** `request.body` não é inicializado antes de receber os campos (`request.body.brand = ...`), o que gera erro em tempo de execução. Inicializar com `request.body = { brand, model, cc, description }`.
- [ ] **`motorcycle_update`:** o `id` recebido não é repassado para `request.body`, então a URL fica `{BASE_URL}/undefined`.
- [ ] **`motorcycle_delete`:** usa `fetch` com método `GET` em vez de `DELETE` e não utiliza `motorcycleClientApi.deleteById`. Além disso, retorna o objeto `Response` em vez do JSON.
- [ ] **`content` de texto:** as tools passam o objeto da resposta direto em `text`; o ideal é `JSON.stringify(response)`.
- [ ] **Tipos:** `motorcycles-clients-api.ts` importa `MotorcycleListAll` e `MotorcycleListAllResponse`, que não existem (o nome correto é `MotorcycleReadAll`). O `id` em `MotorcycleWithId` é `string`, mas a tool usa `number`.
- [ ] **Import circular:** `motorcycles-clients-api.ts` importa `BASE_URL` de `server.ts` (import não utilizado — pode ser removido).
- [ ] **`API_TOKEN`:** é obrigatório em `env.ts`, mas não está no `.env.example` e ainda não é enviado nas requisições (ex.: header `Authorization`).
- [ ] Adicionar testes automatizados e um script de `build`.

---

## 📄 Licença

ISC
