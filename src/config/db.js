const { Sequelize } = require('sequelize');
require('dotenv').config();

// Inisialisasi koneksi ke PostgreSQL menggunakan Sequelize
const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    dialect: 'postgres',
    logging: false, // Nonaktifkan logging SQL
  }
);

// Cek koneksi
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL via Sequelize');
  } catch (error) {
    console.error('Failed to connect to PostgreSQL via Sequelize', error.message);
    process.exit(1);
  }
};

module.exports = { connectDB, sequelize };
