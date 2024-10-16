import express from 'express';

import bookControllers from '../controllers/bookControllers.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

const { getAll, getById, getAddBookForm, addBook, updateBook, deleteBook } =
    bookControllers;

// routes
router.get('/books', getAll);
router.get('/books/:id', getById);
router.get('/get-add', getAddBookForm);
router.post('/books/add', verifyToken, addBook);
router.put('/books/:id', verifyToken, updateBook);
router.delete('/books/:id', verifyToken, deleteBook);

export default router;
