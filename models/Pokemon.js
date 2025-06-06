import mongoose from "mongoose";

const PokemonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  types: {
    type: [String],
    required: true,
  },
  abilities: [String],
  weakness: [String],
  strength: [String],
  evolution: {
    previous: String,
    next: String
  }
},{
statics: {
  async countByType(type) {
    return this.countDocuments({ types: type });
  },
  async countPerType() {
    return this.aggregate([
      { $unwind: "$types" },
      { $group: { _id: "$types", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
  }
},
  query: {
    byName(name) {
      return this.where({name: new RegExp(name, 'i')})
    }
}});

PokemonSchema.index({ types: 1 });
PokemonSchema.index({ abilities: 1 });
PokemonSchema.index({ types: 1, name: -1 });

PokemonSchema.methods.isBase = function () {
    return !this.evolution.previous
}

PokemonSchema.virtual('summary')
  .get(function () {
    return `${this.name} (${this.types.join(', ')})`;
  })
  .set(function (value) {
    const match = value.match(/^(.+?)\s*\((.+)\)$/);
    if (match) {
      this.name = match[1].trim();
      this.types = match[2].split(',').map(t => t.trim());
    } else {
      throw new Error("Invalid format for summary. Example: 'Pikachu (Electric)'");
    }
  });


const Pokemon = mongoose.model("Pokemon", PokemonSchema);



export default Pokemon;