import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// Routes de base pour les opérations CRUD
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Routes pour les relations
router.get('/:id/loans', userController.getUserLoans);

export default router;