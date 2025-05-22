// const m_user = require('../models/m_user');
// const m_cabang = require('../models/m_cabang');
// const m_divisi = require('../models/m_divisi');

const db = require('../models');
const m_user = db.m_user;
const m_cabang = db.m_cabang;
const m_divisi = db.m_divisi;
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');
const logger = require('../utils/logger');

// Mendapatkan semua pengguna
exports.getAllUsers = async () => {
  try {
    const users = await m_user.findAll({
      attributes: { 
        exclude: ['password'],
        include: [
        {
          model: m_cabang,
          as: 'cabang', // harus sama dengan alias di associate()
        },
        {
          model: m_divisi,
          as: 'divisi',
        },
      ],
    }
    }); // Mengambil semua pengguna
    logger.info(`Fetched ${users.length} users`);
    return users
  } catch (error) {
    logger.error('Error fetching users', error);
    throw new Error('Error fetching users');
  }
};

// Mendapatkan pengguna berdasarkan ID
exports.getUserById = async (id) => {
  try {
    const user = await m_user.findByPk(id, {
      attributes: { 
        exclude: ['password'],
      },
      include: [
        {
          model: m_cabang,
          as: 'cabang', // harus sama dengan alias di associate()
        },
        {
          model: m_divisi,
          as: 'divisi',
        },
      ],
    }); // Mencari pengguna berdasarkan ID
    logger.info(`Fetched user ${id} `);
    return user;
  } catch (error) {
    logger.error('Error fetching user by id', error);
    throw new Error('Error fetching user by id');
  }
};

// Menambahkan pengguna baru
exports.createUser = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10); // 10 itu salt rounds
    userData.password = hashedPassword;

    const newUser = await m_user.create(userData);
    logger.info(`User ${newUser.name} created successfully`);
    return newUser;
  } catch (error) {
    logger.error('Error creating user', error);
    throw new Error('Error creating user');
  }
};

// Mengupdate data pengguna
exports.updateUser = async (id, userData) => {
  try {
    const user = await m_user.findByPk(id);
    if (user) {
      await user.update(userData);
      logger.info(`User ${user.id} created successfully`);
      return user;
    }
    throw new Error('User not found');
  } catch (error) {
    logger.error('Error updating user', error);
    throw new Error('Error updating user');
  }
};

// Menghapus pengguna
exports.deleteUser = async (id) => {
  try {
    const user = await m_user.findByPk(id);
    if (user) {
      await user.destroy();
      logger.info(`User ${id} deleted successfully`);
      return { message: 'User deleted successfully' };
    }
    throw new Error('User not found');
  } catch (error) {
    logger.error('Error deleting user', error);
    throw new Error('Error deleting user');
  }
};

exports.findUserByNIP = async (nip) => {
  return await m_user.findOne({ where: { nip } });
};

exports.login = async (nip, password) => {
  const user = await this.findUserByNIP(nip);
  if (!user) {
    throw new Error('Email not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  // Generate JWT token
  const token = generateToken({ id: user.id, nip: user.nip });
  return { token, user: { id: user.id, name: user.name, nip: user.nip } };
};