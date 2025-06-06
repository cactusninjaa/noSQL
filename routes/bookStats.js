import express from 'express';
import { 
    getBookStats, 
} from '../controllers/bookStatsController.js';

const router = express.Router();

// Route pour obtenir les statistiques générales des livres
// GET /book-stats
router.get('/', getBookStats);

export default router;
