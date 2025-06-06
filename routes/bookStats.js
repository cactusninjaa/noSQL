import express from 'express';
import { 
    getBookStats, 
    getStatsByLanguage, 
    getStatsByType 
} from '../controllers/bookStatsController.js';

const router = express.Router();

// Route pour obtenir les statistiques générales des livres
// GET /book-stats
router.get('/', getBookStats);
router.get('/language/:language', getStatsByLanguage);
router.get('/type/:type', getStatsByType);

export default router;
