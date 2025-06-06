import express from 'express';
import bookController from '../controllers/bookController.js';

const router = express.Router();

// Routes de base pour les opérations CRUD
router.get('/', bookController.getAllBooks);  // Inclut maintenant la recherche via le paramètre query
router.get('/:id', bookController.getBookById);
router.post('/', bookController.createBook);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

// Routes avancées
router.get('/type/:type', bookController.getBooksByType);
router.get('/language/:language', bookController.getBooksByLanguage);
router.get('/isbn/:isbn', bookController.getBookByIsbn);

// Routes pour les relations
router.get('/:id/loans', bookController.getBookLoans);
router.get('/:id/availability', bookController.checkBookAvailability);

export default router;
