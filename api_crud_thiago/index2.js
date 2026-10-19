// INTRODUÇÃO-2 AO EXPRESS - WEB API

const express = require("express");
const app = express();
const port = 3000;

// O express.json() é um middleware do express que converte
// o body (corpo, req.body) de requisições POST ou PUT no
// formato JSON a ser tratado pela API.
app.use(express.json());

// Criação do array que simula uma coleção "produtos"
// de um banco de dados NoSQL (orientado a documentos)
let fornecedores = [
    { _id: 1, nome: 'Mundo da Construção' },
    { _id: 2, nome: 'Cimento & Cia'},
];

let produtos = [
    { _id: 1, nome: 'Tijolo', qtdeEstoque: 1000, preco: 0.90, _idFornFK: 1 },
    { _id: 2, nome: 'Cimento', qtdeEstoque: 200, preco: 25.00, _idFornFK: 2 },
];

// Classe Produto
class Produto {
    constructor(id, nome, qtdeEstoque, preco, _idFornFK) {
        this._id = id;
        this.nome = nome;
        this.qtdeEstoque = qtdeEstoque;
        this.preco = preco;
        this._idFornFK = _idFornFK;
    }
}

/* ROTAS DA API - MÉTODOS GET, POST, PUT, DELETE */

// Rota raiz
app.get('/', (req, res, next) => {
    res.json({ apiName: 'Catálogo de Produtos!', greetingMessage: 'Bem-Vindo!' });
});

/* Rotas de Fornecedores */
// READ ALL - Consultar/Listar todos os fornecedores
app.get('/fornecedores', (req, res, next) => { 
    res.json(fornecedores); 
});

/* Rotas do CRUD de Produtos */
// CREATE - Criar um novo produto
app.post('/produtos', (req, res, next) => {
    try {
        if (req.body.nome) {
            const { nome, qtdeEstoque, preco, _idFornFK } = req.body; // Desestruturação
            const id = produtos.length > 0 ? produtos[produtos.length - 1]._id + 1 : 1;
            
            // Instanciando objeto da classe Produto
            const novoProduto = new Produto(id, nome, qtdeEstoque, preco, _idFornFK);
            
            // Adicionando o objeto instanciado no final do vetor produtos
            produtos.push(novoProduto);
            res.json({ message: 'Produto cadastrado com sucesso!' });
        } else {
            res.json({ message: 'Dados incorretos. NÃO FOI POSSÍVEL cadastrar o produto!' });
        }
    } catch (error) {
        res.status(400).json({ erro: `${error}` });
    }
});

// READ ALL - Consultar/Listar todos os produtos
app.get('/produtos', (req, res, next) => { 
    res.json(produtos); 
});

// READ - Consultar detalhe do produto
app.get('/produtos/:id', (req, res, next) => {
    try {
        if (req.params.id) {
            const id = parseInt(req.params.id);
            // O método find() retorna o primeiro valor do array, se
            // um elemento do array atender à função de teste fornecida.
            // Caso contrário, retorna undefined.
            const produto = produtos.find(elemento => elemento._id === id);
            
            if (produto) {
                res.json(produto);
            } else {
                res.json({ message: 'Produto não encontrado!' });
            }
        }
    } catch (error) {
        res.status(400).json({ erro: `${error}` });
    }
});

// UPDATE - Alterar produto
app.put('/produtos/:id', (req, res, next) => {
    try {
        if (req.params.id) {
            const id = parseInt(req.params.id);
            const { nome, qtdeEstoque, preco, _idFornFK } = req.body; // Desestruturação
            
            // O método find() retorna o primeiro valor do array, se
            // um elemento do array atender à função de teste fornecida.
            // Caso contrário, retorna undefined.
            const produto = produtos.find(elemento => elemento._id === id);
            
            if (produto) {
                produto.nome = nome;
                produto.qtdeEstoque = qtdeEstoque;
                produto.preco = preco;
                produto._idFornFK = _idFornFK;
                res.json({ message: 'Produto alterado com sucesso!' });
            } else {
                res.json({ message: 'Produto não encontrado!' });
            }
        }
    } catch (error) {
        res.status(400).json({ erro: `${error}` });
    }
});

// DELETE - Excluir produto
app.delete('/produtos/:id', (req, res, next) => {
    try {
        if (req.params.id) {
            if (req.params.id) {
                const id = parseInt(req.params.id);
                // O método filter() gera um novo array apenas com os elementos
                // que satisfazem à função de teste fornecida
                // Atualizando o vetor produtos (excluindo no produto solicitado)
                produtos = produtos.filter((elemento) => elemento._id !== id);
                console.log("produtos: ", JSON.stringify(produtos));
                res.json({ message: 'Produto excluído com sucesso!' });
            } else {
                res.json({ message: 'Dados incorretos. NÃO FOI POSSÍVEL excluir o produto!' });
            }
        }
    } catch (error) {
        res.status(400).json({ erro: `${error}` });
    }
});

app.listen(port, () => 
    console.log(`API "Catálogo de Produtos" rodando na porta ${port}`)
);