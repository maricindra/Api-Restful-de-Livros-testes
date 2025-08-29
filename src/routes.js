// Rotas da API com validações de entrada
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const { Book } = require('./models');

const router = express.Router();
const currentYear = new Date().getFullYear();

// Retornar erros do express-validator
function returnValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validação falhou',
      details: errors.array().map(e => `${e.path}: ${e.msg}`)
    });
  }
}

// 1) Cadastro de livros - POST /api/books

router.post(
  '/books',
  [
    body('titulo').isString().trim().notEmpty().withMessage('Título é obrigatório'),
    body('autor').isString().trim().notEmpty().withMessage('Autor é obrigatório'),
    body('editora').isString().trim().notEmpty().withMessage('Editora é obrigatória'),
    body('anoPublicacao')
      .isInt({ min: 1450, max: currentYear + 1 })
      .withMessage(`Ano deve estar entre 1450 e ${currentYear + 1}`),
    body('numeroPaginas')
      .isInt({ min: 1, max: 100000 })
      .withMessage('Número de páginas deve ser >= 1'),
  ],
  async (req, res, next) => {
    try {
      const invalid = returnValidationErrors(req, res);
      if (invalid) return;

      const created = await Book.create(req.body); // inclui sinopse
      return res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  }
);


 // 2) Listagem de livros - GET /api/books
router.get('/books', async (req, res, next) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    return res.json(books);
  } catch (err) {
    next(err);
  }
});

// 3) Consulta de livro por ID - GET /api/books/:id
router.get(
  '/books/:id',
  [
    param('id')
      .custom(v => mongoose.Types.ObjectId.isValid(v))
      .withMessage('ID inválido')
  ],
  async (req, res, next) => {
    try {
      const invalid = returnValidationErrors(req, res);
      if (invalid) return;

      const book = await Book.findById(req.params.id);
      if (!book) return res.status(404).json({ error: 'Livro não encontrado' });
      return res.json(book);
    } catch (err) {
      next(err);
    }
  }
);

// 4) Remoção de livro - DELETE /api/books/:id

router.delete(
  '/books/:id',
  [
    param('id')
      .custom(v => mongoose.Types.ObjectId.isValid(v))
      .withMessage('ID inválido')
  ],
  async (req, res, next) => {
    try {
      const invalid = returnValidationErrors(req, res);
      if (invalid) return;

      const removed = await Book.findByIdAndDelete(req.params.id);
      if (!removed) return res.status(404).json({ error: 'Livro não encontrado' });
      return res.status(204).send(); // No Content
    } catch (err) {
      next(err);
    }
  }
);

// 5) Atualização de livro - PUT /api/books/:id
router.put(
  '/books/:id',
  [
    param('id')
      .custom(v => mongoose.Types.ObjectId.isValid(v))
      .withMessage('ID inválido'),
    body('titulo').isString().trim().notEmpty().withMessage('Título é obrigatório'),
    body('autor').isString().trim().notEmpty().withMessage('Autor é obrigatório'),
    body('editora').isString().trim().notEmpty().withMessage('Editora é obrigatória'),
    body('anoPublicacao')
      .isInt({ min: 1450, max: currentYear + 1 })
      .withMessage(`Ano deve estar entre 1450 e ${currentYear + 1}`),
    body('numeroPaginas')
      .isInt({ min: 1, max: 100000 })
      .withMessage('Número de páginas deve ser >= 1'),
  ],
  async (req, res, next) => {
    try {
      const invalid = returnValidationErrors(req, res);
      if (invalid) return;

      const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });
      if (!updated) return res.status(404).json({ error: 'Livro não encontrado' });
      return res.json(updated);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;