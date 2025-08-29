// Modelos e validações do Mongoose
const mongoose = require('mongoose');

const currentYear = new Date().getFullYear();

const BookSchema = new mongoose.Schema(
  {
    // Todos os campos obrigatórios + validações
    titulo: {
      type: String,
      required: [true, 'Título é obrigatório'],
      trim: true,
      minlength: [1, 'Título não pode ser vazio'],
      maxlength: [200, 'Título muito longo (máx. 200)']
    },
    autor: {
      type: String,
      required: [true, 'Autor é obrigatório'],
      trim: true,
      minlength: [1, 'Autor não pode ser vazio'],
      maxlength: [200, 'Autor muito longo (máx. 200)']
    },
    editora: {
      type: String,
      required: [true, 'Editora é obrigatória'],
      trim: true,
      minlength: [1, 'Editora não pode ser vazia'],
      maxlength: [200, 'Editora muito longa (máx. 200)']
    },
    anoPublicacao: {
      type: Number,
      required: [true, 'Ano de publicação é obrigatório'],
      min: [1450, 'Ano muito antigo (mín. 1450)'],
      max: [currentYear + 1, `Ano inválido (máx. ${currentYear + 1})`]
    },
    numeroPaginas: {
      type: Number,
      required: [true, 'Número de páginas é obrigatório'],
      min: [1, 'Número de páginas deve ser >= 1'],
      max: [100000, 'Número de páginas muito alto']
    },

  },
  { timestamps: true }
);

const Book = mongoose.model('Book', BookSchema);

module.exports = { Book };