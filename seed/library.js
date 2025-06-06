import Library from "../models/Library.js";

const libraries = [
  {
    name: "Bibliothèque Nationale de France",
    localisation: "Paris, France"
  },
  {
    name: "Médiathèque Centrale",
    localisation: "Lyon, France"
  },
  {
    name: "Bibliothèque Municipale",
    localisation: "Bordeaux, France"
  },
  {
    name: "Centre Culturel et Littéraire",
    localisation: "Marseille, France"
  },
  {
    name: "Maison du Livre",
    localisation: "Strasbourg, France"
  }
];

const seedLibraries = async () => {
  await Library.deleteMany({});
  console.log("Old libraries deleted");

  await Library.insertMany(libraries);
  console.log("Seed libraries inserted");
  
  return Library.find({}, "_id");
};

export default seedLibraries;
