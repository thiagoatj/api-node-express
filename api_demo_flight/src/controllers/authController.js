const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepo = require('../repositories/userRepository');

async function login(req, res, next) {
  try {
    const { login_email, password } = req.body;

    if (!login_email || !password) {
      return res.status(400).json({ erro: 'login_email e password são obrigatórios.' });
    }

    const user = await userRepo.findByEmail(login_email);
    if (!user) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    let senhaValida = false;
    if (/^\$2[aby]\$/.test(user.password)) {
      senhaValida = await bcrypt.compare(password, user.password);
    } else {
      senhaValida = password === user.password;
    }

    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas.' });
    }

    const payload = { id: user.id, login_email: user.login_email, user_type: user.user_type };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });

    return res.json({
      token,
      usuario: { id: user.id, name: user.name, login_email: user.login_email, user_type: user.user_type },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { login };

