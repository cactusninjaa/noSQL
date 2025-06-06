import express from "express"
import { 
    createTrainer, 
    deleteTrainer, 
    getTrainerById, 
    getTrainers, 
    updateTrainer,
    addPokemonToTeam,
    removePokemonFromTeam,
    getTrainerTeam
} from "../controllers/trainerController.js";

const router = express.Router();

router.get('/', getTrainers);
router.post('/', createTrainer);
router.get('/:trainerId/team', getTrainerTeam);
router.post('/:trainerId/team/:pokemonId', addPokemonToTeam);
router.delete('/:trainerId/team/:pokemonId', removePokemonFromTeam);
router.get('/:id', getTrainerById);
router.put('/:id', updateTrainer);
router.delete('/:id', deleteTrainer);

export default router;