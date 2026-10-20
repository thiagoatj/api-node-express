const BASE = 'http://localhost:3000';

let passou = 0;
let falhou = 0;
let usuarioCriadoId = null;

function ok(nome) {
  console.log(`  ✅ ${nome}`);
  passou++;
}

function fail(nome, detalhe) {
  console.log(`  ❌ ${nome}${detalhe ? ': ' + detalhe : ''}`);
  falhou++;
}

async function get(path, headers = {}) {
  return fetch(`${BASE}${path}`, { headers });
}

async function post(path, body, headers = {}) {
  return fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

async function put(path, body, headers = {}) {
  return fetch(`${BASE}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

async function del(path, headers = {}) {
  return fetch(`${BASE}${path}`, { method: 'DELETE', headers });
}

async function run() {
  console.log('\n==============================');
  console.log('  SMOKE TESTS — demo_flight  ');
  console.log('==============================\n');

  // 1. Rotas públicas GET
  console.log('--- Rotas Públicas GET ---');
  {
    const r = await get('/aircraft');
    r.status === 200 ? ok('GET /aircraft retorna 200') : fail('GET /aircraft', `status ${r.status}`);
  }
  {
    const r = await get('/aircraft/1');
    r.status === 200 ? ok('GET /aircraft/1 retorna 200') : fail('GET /aircraft/1', `status ${r.status}`);
  }
  {
    const r = await get('/passengers');
    r.status === 200 ? ok('GET /passengers retorna 200') : fail('GET /passengers', `status ${r.status}`);
  }
  {
    const r = await get('/flights');
    r.status === 200 ? ok('GET /flights retorna 200') : fail('GET /flights', `status ${r.status}`);
  }
  {
    const r = await get('/boarding-passes');
    r.status === 200 ? ok('GET /boarding-passes retorna 200') : fail('GET /boarding-passes', `status ${r.status}`);
  }

  // 2. Rota JOIN
  console.log('\n--- Rota JOIN ---');
  {
    const r = await get('/boarding-pass-details');
    if (r.status === 200) {
      const data = await r.json();
      ok(`GET /boarding-pass-details retorna 200 (${data.length} registros)`);
      if (data.length > 0 && data[0].passenger_first_name !== undefined) {
        ok('Estrutura do JOIN correta (campo passenger_first_name presente)');
      } else {
        fail('Estrutura do JOIN', 'campo passenger_first_name ausente ou sem dados');
      }
    } else {
      fail('GET /boarding-pass-details', `status ${r.status}`);
    }
  }

  // 3. Login válido
  console.log('\n--- Autenticação ---');
  let tokenAdmin = null;
  let tokenRegular = null;
  {
    const r = await post('/auth/login', { login_email: 'a@a.com', password: '12345' });
    if (r.status === 200) {
      const data = await r.json();
      if (data.token) {
        tokenAdmin = data.token;
        ok('Login admin (a@a.com) retorna token');
      } else {
        fail('Login admin', 'sem campo token na resposta');
      }
      if (!data.usuario || data.usuario.password !== undefined) {
        fail('Login admin', 'campo password exposto na resposta');
      } else {
        ok('Password não exposto no login');
      }
    } else {
      fail('Login admin', `status ${r.status}`);
    }
  }
  {
    const r = await post('/auth/login', { login_email: 'c@c.com', password: '12345' });
    if (r.status === 200) {
      const data = await r.json();
      tokenRegular = data.token;
      ok('Login regular (c@c.com) retorna token');
    } else {
      fail('Login regular', `status ${r.status}`);
    }
  }
  {
    const r = await post('/auth/login', { login_email: 'a@a.com', password: 'errada' });
    r.status === 401 ? ok('Login com senha errada retorna 401') : fail('Login senha errada', `status ${r.status}`);
  }
  {
    const r = await post('/auth/login', { login_email: 'inexistente@x.com', password: '12345' });
    r.status === 401 ? ok('Login com email inexistente retorna 401') : fail('Login email inexistente', `status ${r.status}`);
  }

  // 4. Rotas privadas sem token
  console.log('\n--- Proteção JWT ---');
  {
    const r = await get('/users');
    r.status === 401 ? ok('GET /users sem token retorna 401') : fail('GET /users sem token', `status ${r.status}`);
  }
  {
    const r = await get('/users', { Authorization: 'Bearer tokeninvalido' });
    r.status === 401 ? ok('GET /users com token inválido retorna 401') : fail('GET /users token inválido', `status ${r.status}`);
  }
  {
    if (!tokenAdmin) { fail('GET /users com token válido', 'sem token admin'); }
    else {
      const r = await get('/users', { Authorization: `Bearer ${tokenAdmin}` });
      r.status === 200 ? ok('GET /users com token admin retorna 200') : fail('GET /users token admin', `status ${r.status}`);
    }
  }

  // 5. Permissões admin
  console.log('\n--- Permissões Admin ---');
  {
    if (!tokenAdmin) { fail('Admin criar usuário', 'sem token'); }
    else {
      const r = await post('/users',
        { name: 'Teste Smoke', login_email: 'smoke_test@teste.com', password: 'abc123', user_type: 'regular' },
        { Authorization: `Bearer ${tokenAdmin}` }
      );
      if (r.status === 201) {
        const data = await r.json();
        usuarioCriadoId = data.id;
        ok(`Admin criou usuário (id: ${usuarioCriadoId})`);
        if (data.password !== undefined) {
          fail('Admin criar usuário', 'campo password exposto');
        } else {
          ok('Password não exposto na criação');
        }
      } else {
        fail('Admin criar usuário', `status ${r.status}`);
      }
    }
  }

  // 6. Regular tentando criar (403)
  console.log('\n--- Permissões Regular ---');
  {
    if (!tokenRegular) { fail('Regular criar usuário (403)', 'sem token'); }
    else {
      const r = await post('/users',
        { name: 'Tentativa', login_email: 'tentativa@teste.com', password: 'abc', user_type: 'regular' },
        { Authorization: `Bearer ${tokenRegular}` }
      );
      r.status === 403 ? ok('Regular tentar criar usuário retorna 403') : fail('Regular criar usuário', `status ${r.status}`);
    }
  }

  // Buscar id do usuário c@c.com para o regular alterar o próprio
  let idRegular = null;
  {
    if (tokenAdmin) {
      const r = await get('/users', { Authorization: `Bearer ${tokenAdmin}` });
      if (r.status === 200) {
        const users = await r.json();
        const u = users.find(x => x.login_email === 'c@c.com');
        if (u) idRegular = u.id;
      }
    }
  }

  // Regular altera o próprio registro
  {
    if (!tokenRegular || !idRegular) { fail('Regular alterar próprio', 'sem token ou id'); }
    else {
      const r = await put(`/users/${idRegular}`,
        { name: 'Charlie Alterado', login_email: 'c@c.com', password: 'novaSenha123' },
        { Authorization: `Bearer ${tokenRegular}` }
      );
      r.status === 200 ? ok('Regular alterou o próprio registro (200)') : fail('Regular alterar próprio', `status ${r.status}`);
    }
  }

  // Regular tenta alterar outro (403)
  {
    if (!tokenRegular) { fail('Regular alterar outro (403)', 'sem token'); }
    else {
      const outroId = idRegular === 1 ? 2 : 1;
      const r = await put(`/users/${outroId}`,
        { name: 'Invasão', login_email: 'x@x.com', password: '123' },
        { Authorization: `Bearer ${tokenRegular}` }
      );
      r.status === 403 ? ok('Regular tentar alterar outro usuário retorna 403') : fail('Regular alterar outro', `status ${r.status}`);
    }
  }

  // Regular tenta mudar user_type (não deve ser permitido — campo ignorado)
  {
    if (!tokenRegular || !idRegular) { fail('Regular tentar mudar user_type', 'sem dados'); }
    else {
      const r = await put(`/users/${idRegular}`,
        { name: 'Charlie', login_email: 'c@c.com', password: '12345', user_type: 'admin' },
        { Authorization: `Bearer ${tokenRegular}` }
      );
      if (r.status === 200) {
        const data = await r.json();
        data.user_type === 'regular'
          ? ok('Regular não conseguiu mudar user_type para admin')
          : fail('Regular mudar user_type', 'user_type foi alterado!');
      } else {
        ok(`Regular tentar mudar user_type bloqueado (status ${r.status})`);
      }
    }
  }

  // Dados inválidos na criação
  console.log('\n--- Validações ---');
  {
    if (!tokenAdmin) { fail('Dados inválidos (400)', 'sem token'); }
    else {
      const r = await post('/users',
        { name: '', login_email: 'x@x.com', password: '123', user_type: 'regular' },
        { Authorization: `Bearer ${tokenAdmin}` }
      );
      r.status === 400 ? ok('Criar usuário com name vazio retorna 400') : fail('Dados inválidos name vazio', `status ${r.status}`);
    }
  }
  {
    if (!tokenAdmin) { fail('user_type inválido (400)', 'sem token'); }
    else {
      const r = await post('/users',
        { name: 'X', login_email: 'x2@x.com', password: '123', user_type: 'superuser' },
        { Authorization: `Bearer ${tokenAdmin}` }
      );
      r.status === 400 ? ok('Criar usuário com user_type inválido retorna 400') : fail('user_type inválido', `status ${r.status}`);
    }
  }

  // 404
  {
    const r = await get('/rota-inexistente');
    r.status === 404 ? ok('Rota inexistente retorna 404') : fail('Rota inexistente', `status ${r.status}`);
  }

  // Limpar: admin exclui usuário criado no teste
  console.log('\n--- Limpeza ---');
  if (usuarioCriadoId && tokenAdmin) {
    const r = await del(`/users/${usuarioCriadoId}`, { Authorization: `Bearer ${tokenAdmin}` });
    r.status === 200 ? ok(`Admin excluiu usuário de teste (id: ${usuarioCriadoId})`) : fail('Admin excluir usuário', `status ${r.status}`);
  }

  // Restaurar senha do regular alterado durante o teste
  if (tokenAdmin && idRegular) {
    await put(`/users/${idRegular}`,
      { name: 'Charlie Brown', login_email: 'c@c.com', password: '12345', user_type: 'regular' },
      { Authorization: `Bearer ${tokenAdmin}` }
    );
    console.log('  ℹ️  Senha e nome de c@c.com restaurados.');
  }

  console.log('\n==============================');
  console.log(`  Total: ${passou + falhou} | ✅ ${passou} | ❌ ${falhou}`);
  console.log('==============================\n');

  if (falhou > 0) process.exit(1);
}

run().catch(err => { console.error('Erro fatal no smoke test:', err.message); process.exit(1); });

