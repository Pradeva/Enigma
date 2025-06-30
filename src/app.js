require('dotenv').config();
const express = require('express');
const cors = require('cors')
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/m_userRoute');
const nasabahRoutes = require('./routes/m_nasabahRoute');
const trx_dpkRoutes = require('./routes/trx_dpkRoute');
const trx_segmenRoutes = require('./routes/trx_segmenRoute');
const trx_company_cash_loanRoutes = require('./routes/trx_company_cash_loanRoute');
const trx_company_non_cash_loanRoutes = require('./routes/trx_company_non_cash_loanRoute');
const trx_kolektabilitasRoutes = require('./routes/trx_kolektabilitasRoute');
const rel_mnasabah_mpengurus_nasabahRoutes = require('./routes/rel_mnasabah_mpengurus_nasabahRoute');
const trx_pengurus_loanRoutes = require('./routes/trx_pengurus_loanRoute');
const trx_pengurus_kolektabilitasRoutes = require('./routes/trx_pengurus_kolektabilitasRoute');
const extracted_slikRoutes = require('./routes/extracted_slikRoute');
// const carRoutes = require('./routes/cars');

const logger = require('./utils/logger');

const app = express();

// Middleware untuk parsing JSON
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Gunakan middleware CORS
app.use(cors());

// Middleware untuk logging setiap request
app.use((req, res, next) => {
    logger.info(`Received ${req.method} request to ${req.url}`);
    next();
});

// Routes
app.use('/users', userRoutes);
app.use('/nasabah', nasabahRoutes);
app.use('/dpk', trx_dpkRoutes);
app.use('/segmen', trx_segmenRoutes);
app.use('/company-cash-loans', trx_company_cash_loanRoutes);
app.use('/company-non-cash-loans', trx_company_non_cash_loanRoutes);
app.use('/kolektabilitas', trx_kolektabilitasRoutes);
app.use('/nasabah-pengurus', rel_mnasabah_mpengurus_nasabahRoutes);
app.use('/pengurus-loans', trx_pengurus_loanRoutes);
app.use('/pengurus-kolektabilitas', trx_pengurus_kolektabilitasRoutes);
app.use('/ekstraksi', extracted_slikRoutes);
// app.use('/cars', carRoutes);

// Koneksi ke database
connectDB();

if (process.env.NODE_ENV === 'development') {
    console.log('Server is running in development mode');
} else {
    console.log('Server is running in production mode');
}
  

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
