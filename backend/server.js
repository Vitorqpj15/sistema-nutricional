const express = require('express');
const cors = require('cors');
require('dotenv').config();

const alimentosRoutes = require('./routes/alimentos');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Rotas
app.use('/alimentos', alimentosRoutes);
app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor ATIVO em http://localhost:${PORT}`);
  console.log(`Pressione CTRL+C para parar`);
});