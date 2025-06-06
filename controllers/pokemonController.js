import Pokemon from "../models/Pokemon.js";

export const getPokemons = async (req, res) => {
  const filters = {};

  const { page: queryPage, limit: queryLimit, ...queryFilters } = req.query;
  const limit = parseInt(queryLimit) || 10;
  const page = parseInt(queryPage) || 1;
  const skip = (page - 1) * limit;
  const splitAndAdd = (field, operator, values) => {
    if (!filters[field]) filters[field] = {};
    filters[field][operator] = values.split(",");
  };

  Object.entries(queryFilters).forEach(([key, value]) => {
    switch (key) {
      case "types":
        splitAndAdd("types", "$in", value);
        break;

      case "excludeTypes":
        splitAndAdd("types", "$nin", value);
        break;

      case "allTypes":
        splitAndAdd("types", "$all", value);
        break;

      case "abilities":
      case "weakness":
      case "strength":
        filters[key] = { $in: value.split(",") };
        break;

      case "name":
        filters.name = { $regex: value, $options: "i" };
        break;

      case "exactName":
        filters.name = value;
        break;

      case "evolutionPrevious":
        filters["evolution.previous"] = value;
        break;

      case "evolutionNext":
        filters["evolution.next"] = value;
        break;
    }
  });
  try {
    const count = await Pokemon.countDocuments(filters);
    const pokemons = await Pokemon.find(filters).skip(skip).limit(limit);
    res.json({
      data: pokemons,
      currentPage: Number(page),
      totalPages: Math.ceil(count / limit),
      totalItems: count,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPokemonById = async (req, res) => {
  const { id } = req.params;
  try {
    const pokemon = await Pokemon.findById(id);
    if (!pokemon) return res.status(404).json("Pokemon not found");
    res.json(pokemon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createPokemon = async (req, res) => {
  const { name, types, abilities, weakness, strength, evolution, previous } =
    req.body;
  try {
    const newPokemon = new Pokemon({
      name,
      types,
      abilities,
      weakness,
      strength,
      evolution,
      previous,
    });
    await newPokemon.save();
    res.status(201).json(newPokemon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const buildUpdateQuery = (obj, prefix = "") => {
  const setFields = {};
  const unsetFields = {};
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (
      value === null ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      unsetFields[fullKey] = "";
    } else if (typeof value === "object" && !Array.isArray(value)) {
      const nested = buildUpdateQuery(value, fullKey);
      Object.assign(setFields, nested.setFields);
      Object.assign(unsetFields, nested.unsetFields);
      if (
        Object.keys(nested.setFields).length === 0 &&
        Object.keys(nested.unsetFields).length === 0
      ) {
        unsetFields[fullKey] = "";
      }
    } else {
      setFields[fullKey] = value;
    }
  }

  return { setFields, unsetFields };
};

export const updatePokemon = async (req, res) => {
  const { id } = req.params;
  const updateFields = req.body;

  const { setFields, unsetFields } = buildUpdateQuery(updateFields);

  const updateQuery = {};
  if (Object.keys(setFields).length > 0) updateQuery.$set = setFields;
  if (Object.keys(unsetFields).length > 0) updateQuery.$unset = unsetFields;
  try {
    const updatedPokemon = await Pokemon.findByIdAndUpdate(id, updateQuery, {
      new: true,
      runValidators: true,
    });
    if (!updatedPokemon) return res.status(404).json("Pokemon not found");
    res.json(updatedPokemon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePokemon = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPokemon = await Pokemon.findByIdAndDelete(id);
    if (!deletedPokemon) return res.status(404).json("Pokemon not found");
    res.json("Pokemon successfully deleted");
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPokemonSummary = async (req, res) => {
  const { id } = req.params;
  try {
    const pokemon = await Pokemon.findById(id);
    if (!pokemon) return res.status(404).json({ message: "Pokémon not found" });

    res.json({ summary: pokemon.summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePokemonSummary = async (req, res) => {
  const { id } = req.params;
  const { summary } = req.body;

  try {
    const pokemon = await Pokemon.findById(id);
    if (!pokemon) return res.status(404).json({ message: "Pokémon not found" });

    pokemon.summary = summary;
    await pokemon.save();

    res.json({
      message: "Summary updated successfully",
      summary: pokemon.summary,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const countByType = async (req, res) => {
  const { type } = req.params;
  try {
    const count = await Pokemon.countByType(type);
    res.json({ type, count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const countPerType = async (req, res) => {
  try {
    const counts = await Pokemon.countPerType();
    res.json(counts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const findByName = async (req, res) => {
  const { name } = req.query;
  if (!name)
    return res.status(400).json({ error: "Name query parameter is required" });

  try {
    const results = await Pokemon.find().byName(name);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const isBasePokemon = async (req, res) => {
  try {
    const pokemon = await Pokemon.findById(req.params.id);
    if (!pokemon) return res.status(404).json({ message: "Pokemon not found" });

    res.json({ isBase: pokemon.isBase() });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
