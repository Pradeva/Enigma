const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser
} = require('../controllers/m_userController');

const { authMiddleware } = require('../middlewares/authMiddleware');

// GET /users - Mendapatkan semua pengguna
router.get('/', authMiddleware, getUsers);

// GET /users/:id - Mendapatkan pengguna berdasarkan ID
router.get('/:id', authMiddleware, getUserById);

// POST /users/register - Menambahkan pengguna baru
router.post('/register', createUser);

// PUT /users/:id - Mengupdate data pengguna
router.put('/:id', updateUser);

// DELETE /users/:id - Menghapus pengguna
router.delete('/:id', deleteUser);

//POST /users/login - Melakukan Login
router.post('/login', loginUser);

module.exports = router;
