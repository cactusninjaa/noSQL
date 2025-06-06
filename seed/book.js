import Book from "../models/Book.js";

const books = [
  {
    title: "Harry Potter et la Pierre Philosophale",
    author: "J.K. Rowling",
    publisher: "Gallimard Jeunesse",
    types: "Fantaisie",
    language: "fr",
    publishedDate: new Date("1998-10-09"),
    isbn: 9782070541270,
    pageNumber: 305
  },
  {
    title: "La grandeur des incas",
    author: "National Geographic",
    publisher: "National Geographic",
    language: "fr",
    publishedDate: new Date("2010-01-01"),
    pageNumber: 256,
  },
  {
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    publisher: "HarperCollins",
    types: "Fantaisie",
    language: "en",
    publishedDate: new Date("1954-07-29"),
    isbn: 9780261103252,
    pageNumber: 1216
  },
  {
    title: "Le Petit Prince",
    author: "Antoine de Saint-Exupéry",
    publisher: "Gallimard",
    types: "Fantaisie",
    language: "fr",
    publishedDate: new Date("1943-04-06"),
    isbn: 9782070612758,
    pageNumber: 96
  },
  {
    title: "Sherlock Holmes: A Study in Scarlet",
    author: "Arthur Conan Doyle",
    publisher: "Ward Lock & Co",
    types: "Policier",
    language: "en",
    publishedDate: new Date("1887-11-01"),
    isbn: 9780755334476,
    pageNumber: 176
  },

  {
    title: "Dune",
    author: "Frank Herbert",
    publisher: "Robert Laffont",
    types: "SF",
    language: "fr",
    publishedDate: new Date("1965-08-01"),
    isbn: 9782221252055,
    pageNumber: 696
  }
];

const seedBooks = async () => {
  await Book.deleteMany({});
  console.log("Old books deleted");

  await Book.insertMany(books);
  console.log("Seed books inserted");
  
  return Book.find({}, "_id");
};

export default seedBooks;
