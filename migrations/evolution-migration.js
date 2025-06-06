import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pokemon from '../models/Pokemon.js';

dotenv.config();

async function runMigration() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    const pokemons = await Pokemon.find();
    const updates = pokemons.map((pokemon) => {
      const newEvolution = {};
      if (pokemon.previous)  newEvolution.previous = pokemon.previous;
      if (pokemon.evolution && typeof pokemon.evolution === 'string') newEvolution.next = pokemon.evolution;
      const update = {
        ...(Object.keys(newEvolution).length > 0 && { $set: { evolution: newEvolution } }),
        $unset: { previous: "" }
      };

      return Pokemon.updateOne({ _id: pokemon._id }, update)
        .then(() => {
          console.log(`Migrated ${pokemon.name}`);
        })
        .catch((err) => {
          console.error(`Error migrating ${pokemon.name}:`, err);
        });
    });

    await Promise.all(updates);

    console.log('All migrations complete');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}


runMigration();
