import Trainer from "../models/Trainer.js";
import Pokemon from "../models/Pokemon.js";

const allowedPopulates = ["team"];

export const createTrainer = async (req, res) => {
  try {
    const newTrainer = new Trainer(req.body);
    await newTrainer.save();
    res.status(201).json(newTrainer);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

export const getTrainers = async (req, res) => {
  const { search, populate, limit: queryLimit, page: queryPage } = req.query;
  const limit = parseInt(queryLimit) || 10;
  const page = parseInt(queryPage) || 1;
  const skip = (page - 1) * limit;
  try {
    const filter = search ? { $text: { $search: search } } : {};
    const count = await Trainer.countDocuments(filter);
    const populateOption = allowedPopulates.includes(populate)
      ? populate
      : null;
    const trainers = await Trainer.find(
      filter,
      search ? { score: { $meta: "textScore" } } : {}
    )
      .sort(search ? { score: { $meta: "textScore" } } : {})
      .skip(skip)
      .limit(limit)
      .populate(populateOption);
    res.json({
      data: trainers,
      currentPage: Number(page),
      totalPages: Math.ceil(count / limit),
      totalItems: count,
    });
  } catch (error) {
    res.status(500).json({message: error.message});
  }
};

export const getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id).populate("team");
    if (!trainer) return res.status(404).json({ message: "Trainer not found" });
    res.json(trainer);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

export const updateTrainer = async (req, res) => {
  try {
    const updatedTrainer = await Trainer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTrainer)
      return res.status(404).json({ message: "Trainer not found" });
    res.json(updatedTrainer);
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

export const deleteTrainer = async (req, res) => {
  try {
    const deleted = await Trainer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Trainer not found" });
    res.json({ message: "Trainer deleted successfully" });
  } catch (error) {
    res.status(400).json({message: error.message});
  }
};

export const addPokemonToTeam = async (req, res) => {
  try {
    const { trainerId, pokemonId } = req.params;
    const pokemon = await Pokemon.findById(pokemonId);
    if (!pokemon) {
      return res.status(404).json({ message: "Pokemon not found" });
    }
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    await trainer.addPokemon(pokemonId);
    const updatedTrainer = await Trainer.findById(trainerId).populate("team");
    res.json(updatedTrainer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const removePokemonFromTeam = async (req, res) => {
  try {
    const { trainerId, pokemonId } = req.params;
    const trainer = await Trainer.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    await trainer.removePokemon(pokemonId);
    const updatedTrainer = await Trainer.findById(trainerId).populate("team");
    res.json(updatedTrainer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getTrainerTeam = async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.trainerId).populate("team");
    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }
    res.json(trainer.team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
