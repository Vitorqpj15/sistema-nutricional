const express = require('express');
const cors = require('cors');
require('dotenv').config();

const alimentosRoutes = require('./routes/alimentos');

const app = express();
const PORT = 3000;

app.use(cors());       
app.use(express.json()); 

app.get('/ping', (req, res) => res.send('pong'));

app.use('/alimentos', alimentosRoutes);

process.on('uncaughtException', (err) => {
    console.error('❌ ERRO CRÍTICO (O servidor ia cair):', err);
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor ATIVO em http://localhost:${PORT}`);
    console.log('Pressione CTRL+C para parar');
});