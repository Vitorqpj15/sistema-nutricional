const express = require('express');
const cors = require('cors');
require('dotenv').config();

const alimentosRoutes = require('./routes/alimentos');

const app = express();
const PORT = 3000;

app.use(cors());       
app.use(express.json()); 

app.use('/alimentos', alimentosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});