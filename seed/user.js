import User from "../models/User.js";

const users = [
  {
    firstName: "Jean",
    lastName: "Dupont"
  },
  {
    firstName: "Marie",
    lastName: "Martin"
  },
  {
    firstName: "Pierre",
    lastName: "Bernard"
  },
  {
    firstName: "Sophie",
    lastName: "Petit"
  },
  {
    firstName: "Thomas",
    lastName: "Dubois"
  },
  {
    firstName: "Emma",
    lastName: "Leroy"
  }
];

const seedUsers = async () => {
  await User.deleteMany({});
  console.log("Old users deleted");

  await User.insertMany(users);
  console.log("Seed users inserted");
  
  return User.find({}, "_id");
};

export default seedUsers;
