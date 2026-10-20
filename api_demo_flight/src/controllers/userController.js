const bcrypt = require('bcryptjs');
const userRepo = require('../repositories/userRepository');

const TIPOS_VALIDOS = ['admin', 'regular'];

function validarCamposObrigatorios(body, incluirTipo = true) {
  const { name, login_email, password, user_type } = body;
  if (!name || !login_email || !password) {
    return 'name, login_email e password são obrigatórios.';
  }
  if (incluirTipo && !TIPOS_VALIDOS.includes(user_type)) {
    return "user_type deve ser 'admin' ou 'regular'.";
  }
  return null;
}

async function getUsers(req, res, next) {
  try {
    const users = await userRepo.findAll();
    res.json(users);
  } catch (err) { next(err); }
}

async function getUserById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: 'ID inválido.' });
    const user = await userRepo.findById(id);
    if (!user) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    res.json(user);
  } catch (err) { next(err); }
}

async function createUser(req, res, next) {
  try {
    const erro = validarCamposObrigatorios(req.body);
    if (erro) return res.status(400).json({ erro });

    const { name, login_email, password, user_type } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const id = await userRepo.create({ name, login_email, password: hash, user_type });
    const criado = await userRepo.findById(id);
    return res.status(201).json(criado);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'E-mail já cadastrado.' });
    }
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: 'ID inválido.' });

    const userExiste = await userRepo.findById(id);
    if (!userExiste) return res.status(404).json({ erro: 'Usuário não encontrado.' });

    const solicitante = req.user;

    if (solicitante.user_type === 'regular') {
      if (solicitante.id !== id) {
        return res.status(403).json({ erro: 'Sem permissão para alterar outro usuário.' });
      }
      const { name, login_email, password } = req.body;
      if (!name || !login_email || !password) {
        return res.status(400).json({ erro: 'name, login_email e password são obrigatórios.' });
      }
      const hash = await bcrypt.hash(password, 10);
      await userRepo.updateOwn(id, { name, login_email, password: hash });
    } else {
      const erro = validarCamposObrigatorios(req.body);
      if (erro) return res.status(400).json({ erro });
      const { name, login_email, password, user_type } = req.body;
      const hash = await bcrypt.hash(password, 10);
      await userRepo.update(id, { name, login_email, password: hash, user_type });
    }

    const atualizado = await userRepo.findById(id);
    res.json(atualizado);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ erro: 'E-mail já cadastrado.' });
    }
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ erro: 'ID inválido.' });
    const userExiste = await userRepo.findById(id);
    if (!userExiste) return res.status(404).json({ erro: 'Usuário não encontrado.' });
    await userRepo.remove(id);
    res.json({ mensagem: 'Usuário excluído com sucesso.' });
  } catch (err) { next(err); }
}

module.exports = { getUsers, getUserById, createUser, updateUser, deleteUser };

