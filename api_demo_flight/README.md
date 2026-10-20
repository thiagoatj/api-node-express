# API REST — demo_flight

API REST em Node.js com Express e MySQL para gerenciamento de voos, passageiros e cartões de embarque.

## Requisitos

- Node.js 18+
- MySQL 8.x rodando na porta 3306

## Instalação

```bash
cd api_demo_flight
npm install
```

## Configuração do `.env`

Copie o arquivo de exemplo e preencha com seus dados:

```bash
copy .env.example .env
```

Edite o `.env`:

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=demo_flight
JWT_SECRET=coloque_aqui_uma_string_longa_e_aleatoria
JWT_EXPIRES_IN=1h
```

## Importar o banco de dados

Com o MySQL rodando, execute no terminal Node (dentro da pasta do projeto):

```bash
node -e "
const mysql = require('mysql2/promise');
const fs = require('fs');
mysql.createConnection({host:'127.0.0.1',user:'root',password:'',multipleStatements:true})
  .then(c => {
    const sql = fs.readFileSync('database/mysql_demo_flight_db.sql','utf8')
      .split('\n').filter(l=>!l.trim().startsWith('--')&&l.trim()).join('\n');
    return c.query(sql).then(()=>c.end());
  }).then(()=>console.log('Banco importado!'));
"
```

Ou use a extensão MySQL do VS Code para executar o arquivo `database/mysql_demo_flight_db.sql`.

## Como rodar

```bash
# Produção
npm start

# Desenvolvimento (com nodemon)
npm run dev
```

A API sobe na porta 3000 por padrão.

## Executar os testes

Com a API rodando em outra janela:

```bash
node tests/smoke.js
```

## Rotas

### Públicas (sem autenticação)

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /auth/login | Login; retorna JWT |
| GET | /aircraft | Lista todas as aeronaves |
| GET | /aircraft/:id | Detalhe de uma aeronave |
| GET | /passengers | Lista todos os passageiros |
| GET | /passengers/:id | Detalhe de um passageiro |
| GET | /flights | Lista todos os voos |
| GET | /flights/:id | Detalhe de um voo |
| GET | /boarding-passes | Lista todos os cartões de embarque |
| GET | /boarding-passes/:id | Detalhe de um cartão |
| GET | /boarding-pass-details | JOIN completo: cartões com passageiro, voo e aeronave |

### Privadas (requer `Authorization: Bearer <token>`)

| Método | Rota | Descrição | Permissão |
|--------|------|-----------|-----------|
| GET | /users | Lista todos os usuários | Somente admin |
| GET | /users/:id | Detalhe de um usuário | Admin (qualquer); Regular (só o próprio) |
| POST | /users | Cria usuário | Somente admin |
| PUT | /users/:id | Atualiza usuário | Admin (qualquer); Regular (só o próprio, sem alterar user_type) |
| DELETE | /users/:id | Remove usuário | Somente admin |

## Regras de permissão

- **Admin**: acesso total ao CRUD de usuários.
- **Regular**: consulta e altera apenas o próprio registro; não pode alterar `user_type`; não pode criar nem excluir usuários.
- O campo `password` **nunca** é retornado nas respostas.

## Body do login

```json
{ "login_email": "a@a.com", "password": "12345" }
```

Retorna:

```json
{
  "token": "eyJ...",
  "usuario": { "id": 1, "name": "Alice Johnson", "login_email": "a@a.com", "user_type": "admin" }
}
```

## Body para criar/atualizar usuário

```json
{ "name": "Nome", "login_email": "email@x.com", "password": "senha", "user_type": "admin" }
```

## Usuários iniciais (senha em texto: `12345`)

| E-mail | Tipo |
|--------|------|
| a@a.com | admin |
| b@b.com | admin |
| c@c.com | regular |
| d@d.com | regular |

## Estrutura do projeto

```
api_demo_flight/
  server.js
  database/mysql_demo_flight_db.sql
  src/
    app.js
    config/db.js
    controllers/
      authController.js
      publicController.js
      userController.js
    middlewares/
      auth.js
      permissions.js
    repositories/
      aircraftRepository.js
      boardingPassRepository.js
      flightRepository.js
      passengerRepository.js
      userRepository.js
    routes/
      auth.js
      publicas.js
      users.js
  tests/smoke.js
  .env (não versionado)
  .env.example
  .gitignore
```
## Observação sobre a carga de dados

O banco `demo_flight` foi criado com uma carga reduzida de dados de teste
(4 usuários, 5 aeronaves, 20 passageiros, 3 voos e 3 cartões de embarque).
O código da API é independente do volume de dados: ao importar o script
completo (50 aeronaves, 10.000 passageiros, 500 voos e 10.000 cartões),
todas as rotas funcionam sem alteração.
