// Front-end com Express e EJS - Catálogo de Produtos
const express = require('express');
const path = require('path');
const app = express();
const port = 3001;

// URL base da API de produtos (Atividade 3)
const API_URL = 'http://localhost:3000';

// Configuração do EJS como mecanismo de templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para arquivos estáticos (CSS, imagens, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para receber dados de formulários HTML
app.use(express.urlencoded({ extended: true }));

// ============================================================
// ROTAS DO FRONT-END
// ============================================================

// GET / — Listagem de todos os produtos
app.get('/', async (req, res) => {
  try {
    const response = await fetch(`${API_URL}/produtos`);

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: ${response.statusText}`);
    }

    const produtos = await response.json();

    // Mensagem de feedback vinda de redirecionamento (query string)
    const mensagem = req.query.mensagem || null;
    const tipoMensagem = req.query.tipo || 'sucesso';

    res.render('products/index', { produtos, mensagem, tipoMensagem });
  } catch (error) {
    // API provavelmente indisponível
    res.render('products/index', {
      produtos: [],
      mensagem: 'Não foi possível conectar à API. Verifique se ela está rodando na porta 3000.',
      tipoMensagem: 'erro',
    });
  }
});

// GET /produtos/novo — Formulário de cadastro
app.get('/produtos/novo', (req, res) => {
  res.render('products/new', { erro: null, valores: {} });
});

// POST /produtos — Envia dados do formulário para a API
app.post('/produtos', async (req, res) => {
  const { nome, qtdeEstoque, preco } = req.body;

  // Validação no front-end
  if (!nome || nome.trim() === '') {
    return res.render('products/new', {
      erro: 'O nome do produto é obrigatório.',
      valores: req.body,
    });
  }

  if (qtdeEstoque === '' || qtdeEstoque === undefined || isNaN(Number(qtdeEstoque)) || Number(qtdeEstoque) < 0) {
    return res.render('products/new', {
      erro: 'A quantidade em estoque deve ser um número válido (>= 0).',
      valores: req.body,
    });
  }

  if (preco === '' || preco === undefined || isNaN(Number(preco)) || Number(preco) < 0) {
    return res.render('products/new', {
      erro: 'O preço deve ser um número válido (>= 0).',
      valores: req.body,
    });
  }

  try {
    const response = await fetch(`${API_URL}/produtos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: nome.trim(),
        qtdeEstoque: Number(qtdeEstoque),
        preco: Number(preco),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.render('products/new', {
        erro: data.erro || data.message || 'Erro ao cadastrar produto na API.',
        valores: req.body,
      });
    }

    // A API retorna { message: '...' }. Verificamos se foi sucesso.
    if (data.message && data.message.toLowerCase().includes('sucesso')) {
      return res.redirect('/?mensagem=' + encodeURIComponent('Produto cadastrado com sucesso!') + '&tipo=sucesso');
    } else {
      // A API retornou 200, mas com mensagem de erro (ex: "Dados incorretos...")
      return res.render('products/new', {
        erro: data.message || 'Não foi possível cadastrar o produto.',
        valores: req.body,
      });
    }
  } catch (error) {
    return res.render('products/new', {
      erro: 'Não foi possível conectar à API. Verifique se ela está rodando na porta 3000.',
      valores: req.body,
    });
  }
});

// GET /produtos/:id/editar — Formulário de edição com dados atuais
app.get('/produtos/:id/editar', async (req, res) => {
  try {
    const response = await fetch(`${API_URL}/produtos/${req.params.id}`);

    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}`);
    }

    const produto = await response.json();

    // A API retorna { message: 'Produto não encontrado!' } quando não existe
    if (produto.message) {
      return res.redirect('/?mensagem=' + encodeURIComponent('Produto não encontrado.') + '&tipo=erro');
    }

    res.render('products/edit', { produto, erro: null });
  } catch (error) {
    return res.redirect('/?mensagem=' + encodeURIComponent('Não foi possível conectar à API.') + '&tipo=erro');
  }
});

// POST /produtos/:id/editar — Envia dados atualizados para a API
app.post('/produtos/:id/editar', async (req, res) => {
  const { nome, qtdeEstoque, preco } = req.body;
  const id = req.params.id;

  // Validação no front-end
  if (!nome || nome.trim() === '') {
    return res.render('products/edit', {
      produto: { _id: Number(id), nome, qtdeEstoque, preco },
      erro: 'O nome do produto é obrigatório.',
    });
  }

  if (qtdeEstoque === '' || qtdeEstoque === undefined || isNaN(Number(qtdeEstoque)) || Number(qtdeEstoque) < 0) {
    return res.render('products/edit', {
      produto: { _id: Number(id), nome, qtdeEstoque, preco },
      erro: 'A quantidade em estoque deve ser um número válido (>= 0).',
    });
  }

  if (preco === '' || preco === undefined || isNaN(Number(preco)) || Number(preco) < 0) {
    return res.render('products/edit', {
      produto: { _id: Number(id), nome, qtdeEstoque, preco },
      erro: 'O preço deve ser um número válido (>= 0).',
    });
  }

  try {
    const response = await fetch(`${API_URL}/produtos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: nome.trim(),
        qtdeEstoque: Number(qtdeEstoque),
        preco: Number(preco),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.render('products/edit', {
        produto: { _id: Number(id), nome, qtdeEstoque, preco },
        erro: data.erro || data.message || 'Erro ao atualizar produto na API.',
      });
    }

    // Verificar se a API confirmou a atualização
    if (data.message && data.message.toLowerCase().includes('sucesso')) {
      return res.redirect('/?mensagem=' + encodeURIComponent('Produto atualizado com sucesso!') + '&tipo=sucesso');
    } else {
      return res.render('products/edit', {
        produto: { _id: Number(id), nome, qtdeEstoque, preco },
        erro: data.message || 'Não foi possível atualizar o produto.',
      });
    }
  } catch (error) {
    return res.render('products/edit', {
      produto: { _id: Number(id), nome, qtdeEstoque, preco },
      erro: 'Não foi possível conectar à API. Verifique se ela está rodando na porta 3000.',
    });
  }
});

// POST /produtos/:id/excluir — Envia DELETE para a API
app.post('/produtos/:id/excluir', async (req, res) => {
  try {
    const response = await fetch(`${API_URL}/produtos/${req.params.id}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      return res.redirect('/?mensagem=' + encodeURIComponent(data.erro || data.message || 'Erro ao excluir produto.') + '&tipo=erro');
    }

    if (data.message && data.message.toLowerCase().includes('sucesso')) {
      return res.redirect('/?mensagem=' + encodeURIComponent('Produto excluído com sucesso!') + '&tipo=sucesso');
    } else {
      return res.redirect('/?mensagem=' + encodeURIComponent(data.message || 'Não foi possível excluir o produto.') + '&tipo=erro');
    }
  } catch (error) {
    return res.redirect('/?mensagem=' + encodeURIComponent('Não foi possível conectar à API.') + '&tipo=erro');
  }
});

// Middleware para rotas inexistentes (404)
app.use((req, res) => {
  res.status(404).render('products/index', {
    produtos: [],
    mensagem: `Página não encontrada: ${req.originalUrl}`,
    tipoMensagem: 'erro',
  });
});

// Inicialização do servidor
app.listen(port, () => {
  console.log(`Front-end "Catálogo de Produtos" rodando em http://localhost:${port}`);
  console.log(`Consumindo API em ${API_URL}`);
});

