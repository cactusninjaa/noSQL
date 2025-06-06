import Pokemon from "../models/Pokemon.js";
import dotenv from "dotenv";

dotenv.config();

const pokemons = [
  {
    name: "Pikachu",
    types: ["Electric"],
    abilities: ["Static", "Lightning Rod"],
    weakness: ["Ground"],
    strength: ["Flying", "Water"],
    evolution: {
      previous: "Pichu",
      next: "Raichu",
    },
  },
  {
    name: "Pichu",
    types: ["Electric"],
    abilities: ["Static"],
    weakness: ["Ground"],
    strength: [],
    evolution: {
      next: "Pikachu",
    },
  },
  {
    name: "Raichu",
    types: ["Electric"],
    abilities: ["Static", "Surge Surfer"],
    weakness: ["Ground"],
    strength: ["Flying", "Water"],
    evolution: {
      previous: "Pikachu",
    },
  },
  {
    name: "Bulbasaur",
    types: ["Grass", "Poison"],
    abilities: ["Overgrow", "Chlorophyll"],
    weakness: ["Fire", "Psychic", "Flying", "Ice"],
    strength: ["Water", "Ground", "Rock"],
    evolution: {
      next: "Ivysaur",
    },
  },
  {
    name: "Charmander",
    types: ["Fire"],
    abilities: ["Blaze", "Solar Power"],
    weakness: ["Water", "Ground", "Rock"],
    strength: ["Grass", "Ice", "Bug", "Steel"],
    evolution: {
      next: "Charmeleon",
    },
  },
  {
    name: "Squirtle",
    types: ["Water"],
    abilities: ["Torrent", "Rain Dish"],
    weakness: ["Electric", "Grass"],
    strength: ["Fire", "Ground", "Rock"],
    evolution: {
      next: "Wartortle",
    },
  },
  {
    name: "Jigglypuff",
    types: ["Normal", "Fairy"],
    abilities: ["Cute Charm", "Competitive"],
    weakness: ["Steel", "Poison"],
    strength: ["Fighting", "Dragon"],
    evolution: {
      next: "Wigglytuff",
    },
  },
  {
    name: "Meowth",
    types: ["Normal"],
    abilities: ["Pickup", "Technician"],
    weakness: ["Fighting"],
    strength: ["Ghost"],
    evolution: {
      next: "Persian",
    },
  },
  {
    name: "Machop",
    types: ["Fighting"],
    abilities: ["Guts", "No Guard"],
    weakness: ["Psychic", "Flying", "Fairy"],
    strength: ["Normal", "Rock", "Dark"],
    evolution: {
      next: "Machoke",
    },
  },
  {
    name: "Psyduck",
    types: ["Water"],
    abilities: ["Damp", "Cloud Nine"],
    weakness: ["Electric", "Grass"],
    strength: ["Fire", "Rock", "Ground"],
    evolution: {
      next: "Golduck",
    },
  },
  {
    name: "Growlithe",
    types: ["Fire"],
    abilities: ["Intimidate", "Flash Fire"],
    weakness: ["Water", "Ground", "Rock"],
    strength: ["Grass", "Bug", "Ice", "Steel"],
    evolution: {
      next: "Arcanine",
    },
  },
  {
    name: "Abra",
    types: ["Psychic"],
    abilities: ["Synchronize", "Inner Focus"],
    weakness: ["Bug", "Ghost", "Dark"],
    strength: ["Fighting", "Poison"],
    evolution: {
      next: "Kadabra",
    },
  },
  {
    name: "Geodude",
    types: ["Rock", "Ground"],
    abilities: ["Sturdy", "Rock Head"],
    weakness: ["Water", "Grass", "Ice", "Fighting", "Ground", "Steel"],
    strength: ["Fire", "Electric", "Poison", "Flying"],
    evolution: {
      next: "Graveler",
    },
  },
  {
    name: "Gastly",
    types: ["Ghost", "Poison"],
    abilities: ["Levitate"],
    weakness: ["Psychic", "Ghost", "Dark"],
    strength: ["Grass", "Fairy"],
    evolution: {
      next: "Haunter",
    },
  },
  {
    name: "Onix",
    types: ["Rock", "Ground"],
    abilities: ["Rock Head", "Sturdy"],
    weakness: ["Water", "Grass", "Fighting", "Ground", "Ice", "Steel"],
    strength: ["Fire", "Electric", "Poison"],
    evolution: {
      next: "Steelix",
    },
  },
  {
    name: "Eevee",
    types: ["Normal"],
    abilities: ["Run Away", "Adaptability"],
    weakness: ["Fighting"],
    strength: [],
    evolution: {
      next: "Vaporeon",
    },
  },
  {
    name: "Snorlax",
    types: ["Normal"],
    abilities: ["Immunity", "Thick Fat"],
    weakness: ["Fighting"],
    strength: [],
    evolution: {
      previous: "Munchlax",
    },
  },
  {
    name: "Magikarp",
    types: ["Water"],
    abilities: ["Swift Swim"],
    weakness: ["Electric", "Grass"],
    strength: [],
    evolution: {
      next: "Gyarados",
    },
  },
  {
    name: "Lapras",
    types: ["Water", "Ice"],
    abilities: ["Water Absorb", "Shell Armor"],
    weakness: ["Electric", "Grass", "Fighting", "Rock"],
    strength: ["Dragon", "Ground", "Flying"],
  },
  {
    name: "Dratini",
    types: ["Dragon"],
    abilities: ["Shed Skin"],
    weakness: ["Ice", "Dragon", "Fairy"],
    strength: ["Fire", "Water", "Electric", "Grass"],
    evolution: {
      next: "Dragonair",
    },
  },
  {
    name: "Mankey",
    types: ["Fighting"],
    abilities: ["Vital Spirit", "Anger Point"],
    weakness: ["Flying", "Psychic", "Fairy"],
    strength: ["Rock", "Steel", "Dark", "Ice"],
    evolution: {
      next: "Primeape",
    },
  },
  {
    name: "Cubone",
    types: ["Ground"],
    abilities: ["Rock Head", "Lightning Rod"],
    weakness: ["Water", "Ice", "Grass"],
    strength: ["Fire", "Electric", "Poison"],
    evolution: {
      next: "Marowak",
    },
  },
  {
    name: "Voltorb",
    types: ["Electric"],
    abilities: ["Soundproof", "Static"],
    weakness: ["Ground"],
    strength: ["Flying", "Water"],
    evolution: {
      next: "Electrode",
    },
  },
  {
    name: "Hitmonlee",
    types: ["Fighting"],
    abilities: ["Limber", "Reckless"],
    weakness: ["Flying", "Psychic", "Fairy"],
    strength: ["Rock", "Steel", "Ice", "Normal"],
    evolution: {
      previous: "Tyrogue",
    },
  },
  {
    name: "Hitmonchan",
    types: ["Fighting"],
    abilities: ["Keen Eye", "Iron Fist"],
    weakness: ["Flying", "Psychic", "Fairy"],
    strength: ["Rock", "Steel", "Normal"],
    evolution: {
      previous: "Tyrogue",
    },
  },
  {
    name: "Chansey",
    types: ["Normal"],
    abilities: ["Natural Cure", "Serene Grace"],
    weakness: ["Fighting"],
    strength: [],
    evolution: {
      previous: "Happiny",
      next: "Blissey",
    },
  },
  {
    name: "Scyther",
    types: ["Bug", "Flying"],
    abilities: ["Swarm", "Technician"],
    weakness: ["Fire", "Electric", "Rock", "Ice"],
    strength: ["Grass", "Fighting"],
    evolution: {
      next: "Scizor",
    },
  },
  {
    name: "Jynx",
    types: ["Ice", "Psychic"],
    abilities: ["Oblivious", "Forewarn"],
    weakness: ["Fire", "Dark", "Rock", "Ghost"],
    strength: ["Fighting", "Dragon"],
    evolution: {
      previous: "Smoochum",
    },
  },
  {
    name: "Electabuzz",
    types: ["Electric"],
    abilities: ["Static"],
    weakness: ["Ground"],
    strength: ["Water", "Flying"],
    evolution: {
      previous: "Elekid",
      next: "Electivire",
    },
  },
  {
    name: "Magmar",
    types: ["Fire"],
    abilities: ["Flame Body"],
    weakness: ["Water", "Ground", "Rock"],
    strength: ["Grass", "Ice", "Bug", "Steel"],
    evolution: {
      previous: "Magby",
      next: "Magmortar",
    },
  },
  {
    name: "Gengar",
    types: ["Ghost", "Poison"],
    abilities: ["Cursed Body"],
    weakness: ["Psychic", "Ghost", "Dark"],
    strength: ["Fairy", "Grass"],
    evolution: {
      previous: "Haunter",
    },
  },
  {
    name: "Dragonite",
    types: ["Dragon", "Flying"],
    abilities: ["Inner Focus"],
    weakness: ["Ice", "Dragon", "Fairy", "Rock"],
    strength: ["Grass", "Fire", "Water", "Bug"],
    evolution: {
      previous: "Dragonair",
    },
  },
];

const seedPokemons = async () => {
  await Pokemon.deleteMany({});
  console.log("Old pokemon deleted");
  await Pokemon.insertMany(pokemons);
  console.log("Seed pokemon inserted");
};

export default seedPokemons;
