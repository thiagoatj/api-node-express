const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { autenticar } = require('../middlewares/auth');
const { soAdmin } = require('../middlewares/permissions');

router.use(autenticar);

router.get('/', soAdmin, userController.getUsers);
router.post('/', soAdmin, userController.createUser);
router.delete('/:id', soAdmin, userController.deleteUser);

// GET e PUT: admin tudo, regular só o próprio (lógica no controller)
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);

module.exports = router;

