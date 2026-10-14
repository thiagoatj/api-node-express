# 📦 Front-end com Express e EJS — Catálogo de Produtos

## Objetivo

Esta atividade (3.1) consiste em construir uma aplicação **front-end** utilizando **Node.js**, **Express** e **templates EJS** para consumir a API CRUD de produtos desenvolvida na Atividade 3. O front-end não possui banco de dados próprio — todos os dados são administrados pela API existente.

## Tecnologias Utilizadas

- **Node.js** — Ambiente de execução JavaScript do lado do servidor.
- **Express** — Framework web para Node.js que facilita a criação de rotas e middleware.
- **EJS (Embedded JavaScript)** — Motor de templates que permite gerar HTML dinâmico com JavaScript.
- **HTML5 / CSS3** — Estrutura e estilização das páginas.
- **nodemon** — Utilitário que reinicia automaticamente o servidor ao detectar alterações nos arquivos.

## Estrutura do Projeto

```
frontend_ejs_produtos/
├── app.js                    # Arquivo principal do servidor Express
├── package.json              # Configuração do projeto e dependências
├── package-lock.json         # Versões travadas das dependências
├── README.md                 # Documentação do projeto
├── .gitignore                # Ignora node_modules no Git
├── views/
│   └── products/
│       ├── index.ejs         # Template da listagem de produtos
│       ├── new.ejs           # Template do formulário de cadastro
│       └── edit.ejs          # Template do formulário de edição
└── public/
    └── css/
        └── style.css         # Estilos CSS personalizados
```

## Instalação das Dependências

Abra um terminal na pasta `frontend_ejs_produtos` e execute:

```bash
npm install
```

As dependências (`express`, `ejs`, `nodemon`) serão instaladas automaticamente conforme o `package.json`.

## Como Iniciar a API (Atividade 3)

A API precisa estar rodando **antes** de iniciar o front-end.

1. Abra um **primeiro terminal**.
2. Navegue até a pasta da API:
   ```bash
   cd api_crud_thiago
   ```
3. Inicie a API:
   ```bash
   npm start
   ```
4. A API estará disponível em **http://localhost:3000**.

> ⚠️ Mantenha este terminal aberto durante todo o uso do front-end.

## Como Iniciar o Front-end

1. Abra um **segundo terminal** (sem fechar o da API).
2. Navegue até a pasta do front-end:
   ```bash
   cd frontend_ejs_produtos
   ```
3. Inicie o front-end:
   ```bash
   npm start
   ```
4. O front-end estará disponível em **http://localhost:3001**.

> 💡 São necessários **dois terminais** simultâneos: um para a API (porta 3000) e outro para o front-end (porta 3001).

## URLs de Acesso

| Aplicação  | URL                        |
|------------|----------------------------|
| API        | http://localhost:3000       |
| Front-end  | http://localhost:3001       |

## Rotas e Funcionalidades

### Rotas do Front-end

| Método | Rota                        | Descrição                          | API Consumida                          |
|--------|-----------------------------|------------------------------------|----------------------------------------|
| GET    | `/`                        | Listagem de todos os produtos      | `GET /produtos`                        |
| GET    | `/produtos/novo`           | Formulário de cadastro             | —                                      |
| POST   | `/produtos`                | Envia cadastro para a API          | `POST /produtos`                       |
| GET    | `/produtos/:id/editar`     | Formulário de edição               | `GET /produtos/:id`                    |
| POST   | `/produtos/:id/editar`     | Envia atualização para a API       | `PUT /produtos/:id`                    |
| POST   | `/produtos/:id/excluir`    | Envia exclusão para a API          | `DELETE /produtos/:id`                 |

### Funcionalidades

- **Listagem** — Tabela com ID, nome, quantidade em estoque e preço em reais.
- **Cadastro** — Formulário com validação de campos obrigatórios.
- **Edição** — Formulário pré-preenchido com os dados atuais do produto.
- **Exclusão** — Botão com confirmação antes de excluir.
- **Tratamento de erros** — Mensagens claras para API indisponível, produto não encontrado, dados inválidos e falhas em operações.

## Integração entre EJS e a API

### Como funciona o EJS

O **EJS** (Embedded JavaScript) é um motor de templates que permite inserir código JavaScript diretamente dentro de arquivos HTML. Quando o Express recebe uma requisição, ele:

1. Executa o código JavaScript das rotas em `app.js`.
2. Chama `res.render('nome_do_template', { dados })` para renderizar um template EJS.
3. O EJS processa o template, substituindo as tags `<%= %>` pelos valores fornecidos.
4. O HTML final é enviado ao navegador do cliente.

**Tags EJS:**
- `<%= valor %>` — Insere o valor com **escape de HTML** (seguro contra XSS).
- `<% codigo %>` — Executa código JavaScript sem gerar saída (laços, condicionais).
- `<%- html %>` — Insere HTML **sem escape** (usar com cautela).

### Como funciona `res.render()`

```javascript
res.render('products/index', { produtos, mensagem, tipoMensagem });
```

O `res.render()` é um método do Express que:
1. Localiza o arquivo de template (`views/products/index.ejs`).
2. Passa as variáveis (`produtos`, `mensagem`, `tipoMensagem`) para o template.
3. O EJS processa o template, gerando HTML com os dados.
4. O HTML resultante é enviado como resposta HTTP ao navegador.

### Como funciona `fetch`

```javascript
const response = await fetch('http://localhost:3000/produtos', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nome, qtdeEstoque, preco }),
});
const data = await response.json();
```

O `fetch` é uma função nativa do Node.js (a partir da v18) que faz requisições HTTP. Ele:
1. Envia uma requisição para a URL especificada com o método e dados indicados.
2. Retorna uma **Promise** que resolve para um objeto `Response`.
3. Usamos `await` para esperar a resposta e `.json()` para converter o corpo em objeto JavaScript.
4. Se a API estiver fora do ar, o `fetch` lança um erro que capturamos com `try/catch`.

### Fluxo completo

```
Navegador → Front-end (Express/EJS :3001) → API (Express :3000) → Array em memória
                                                    ↓
                                              Resposta JSON
                                                    ↓
                  HTML renderizado ← EJS processa ← Front-end recebe dados
                        ↓
                    Navegador exibe
```

## Limitação: Armazenamento em Memória

A API da Atividade 3 armazena os produtos em um **array JavaScript na memória**. Isso significa que:

- Os dados são **perdidos** sempre que a API é reiniciada.
- Os produtos iniciais (Tijolo e Cimento) são restaurados ao reiniciar.
- Em um sistema real, seria utilizado um banco de dados (ex: MongoDB, PostgreSQL).
- Esta limitação é proposital para fins didáticos.

