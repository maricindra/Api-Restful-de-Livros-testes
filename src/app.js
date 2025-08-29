// App principal: conecta ao Mongo, registra middlewares(models) e rotas
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

const routes = require('./routes');

const app = express();

// Middlewares básicos
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Conexão com MongoDB
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://dba:api123@livro-api.pznmczg.mongodb.net/?retryWrites=true&w=majority&appName=Livro-Api';
mongoose
  .connect(mongoUri)
  .then(() => console.log('✅ Conectado ao MongoDB'))
  .catch((err) => {
    console.error('❌ Erro ao conectar no MongoDB:', err);
    process.exit(1);
  });

// Rotas
app.use('/api', routes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Handler central de erros
app.use((err, req, res, next) => {
  if (err?.name === 'ValidationError') {
    const details = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: 'Validação falhou', details });
  }
  if (err?.name === 'CastError' && err?.kind === 'ObjectId') {
    return res.status(400).json({ error: 'ID inválido' });
  }
  console.error('[ERROR]', err);
  res.status(err.status || 500).json({ error: err.message || 'Erro interno do servidor' });
});

// Sobe servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 API de Livros rodando em http://localhost:${port}`);
});