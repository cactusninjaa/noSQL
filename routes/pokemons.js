import express from "express";
import {
  getPokemons,
  createPokemon,
  getPokemonById,
  updatePokemon,
  deletePokemon,
  getPokemonSummary,
  updatePokemonSummary,
  countByType,
  countPerType,
  findByName,
  isBasePokemon
} from "../controllers/PokemonController.js";

const router = express.Router();

router.get("/", getPokemons);
router.post("/", createPokemon);

router.get("/summary/:id", getPokemonSummary);
router.put("/summary/:id", updatePokemonSummary);
router.get("/count/type/:type", countByType);
router.get("/count/per-type", countPerType);
router.get("/search/by-name", findByName);
router.get("/is-base/:id", isBasePokemon);

router.get("/:id", getPokemonById);
router.put("/:id", updatePokemon);
router.delete("/:id", deletePokemon);

export default router;