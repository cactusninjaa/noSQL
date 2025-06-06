import mongoose from "mongoose";

const TrainerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    bio: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    team: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pokemon',
        validate: {
            validator: function(v) {
                return this.team.length <= 6;
            },
            message: 'Team cannot exceed 6 Pokemon'
        }
    }]
})

TrainerSchema.index(
  { name: "text", bio: "text" },
  { weights: { name: 5, bio: 1 } }
);

TrainerSchema.methods.addPokemon = async function(pokemonId) {
    if (this.team.length >= 6) {
        throw new Error('Team is already full (maximum 6 Pokemon)');
    }
    if (this.team.includes(pokemonId)) {
        throw new Error('This Pokemon is already in your team');
    }
    this.team.push(pokemonId);
    return this.save();
};

TrainerSchema.methods.removePokemon = async function(pokemonId) {
    const index = this.team.indexOf(pokemonId);
    if (index === -1) {
        throw new Error('This Pokemon is not in your team');
    }
    this.team.splice(index, 1);
    return this.save();
};

const Trainer = mongoose.model("Trainer", TrainerSchema);

export default Trainer;