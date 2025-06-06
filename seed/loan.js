import Loan from "../models/Loan.js";
import Book from "../models/Book.js";
import User from "../models/User.js";
import Library from "../models/Library.js";

const seedLoans = async () => {
  await Loan.deleteMany({});
  console.log("Old loans deleted");

  const books = await Book.find({}, "_id");
  const users = await User.find({}, "_id");
  const libraries = await Library.find({}, "_id");

  if (!books.length || !users.length || !libraries.length) {
    console.log("No books, users or libraries found. Make sure to run their seeds first.");
    return;
  }

  // Helper function to get random element from array
  const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)];
  
  // Helper function to get random date between two ranges
  const getRandomDate = (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  };

  const loans = [];
  const today = new Date();
  
  for (let i = 0; i < 4; i++) {
    const loanDate = getRandomDate(new Date(today.getFullYear() - 1, 0, 1), today);
    
    // Return date is between 1 and 30 days after loan date
    const returnDate = new Date(loanDate);
    returnDate.setDate(returnDate.getDate() + Math.floor(Math.random() * 30) + 1);
    
    // Some loans have been returned, others not
    const returned = Math.random() > 0.5; // 70% chance of being returned

    loans.push({
        book: getRandomElement(books)._id,
        user: getRandomElement(users)._id,
        library: getRandomElement(libraries)._id,
        loanDate,
        returnDate,
        returned
    });
  }

  await Loan.insertMany(loans);
  console.log("Seed loans inserted");
};

export default seedLoans;
