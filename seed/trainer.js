import Trainer from "../models/Trainer.js";
import Pokemon from "../models/Pokemon.js";

const trainers = [
  {
    name: "Red",
    bio: "A passionate Pokémon trainer aiming to become a Pokémon Master.",
  },
  {
    name: "Blue",
    bio: "A confident rival and expert Pokémon trainer.",
  },
  {
    name: "Misty",
    bio: "Gym leader specializing in Water-type Pokémon.",
  },
  {
    name: "Brock",
    bio: "Gym leader who is a rock-solid trainer with strong Pokémon.",
  },
];

const seedTrainers = async () => {
  await Trainer.deleteMany({});
  console.log("Old trainers deleted");

  const allPokemons = await Pokemon.find({}, "name");
  const getRandomTeam = (size = 3) => {
    const team = [];
    while (team.length < size && team.length < allPokemons.length) {
      const randomIndex = Math.floor(Math.random() * allPokemons.length);
      team.push(allPokemons[randomIndex]._id);
    }
    return team;
  };
  const trainersWithTeams = trainers.map(trainer => ({
    ...trainer,
    team: getRandomTeam(),
  }));

  await Trainer.insertMany(trainersWithTeams);
  console.log("Seed trainers inserted");
};

export default seedTrainers;
