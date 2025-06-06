import express from 'express';
import loanController from '../controllers/loanController.js';

const router = express.Router();

// Routes de base pour les opérations CRUD
router.get('/', loanController.getAllLoans);
router.get('/:id', loanController.getLoanById);
router.post('/', loanController.createLoan);
router.put('/:id', loanController.updateLoan);
router.delete('/:id', loanController.deleteLoan);

// Routes spécialisées
router.patch('/:id/return', loanController.returnLoan);
router.get('/overdue/list', loanController.getOverdueLoans);

export default router;