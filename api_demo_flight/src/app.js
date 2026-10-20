const express = require('express');
const app = express();

app.use(express.json());

const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/publicas');
const usersRoutes = require('./routes/users');

app.use('/auth', authRoutes);
app.use('/', publicRoutes);
app.use('/users', usersRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

module.exports = app;

