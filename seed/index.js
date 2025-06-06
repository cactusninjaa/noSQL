import mongoose from 'mongoose';
import seedPokemons from "./pokemon.js";
import seedTrainers from './trainer.js';
import seedBooks from './book.js';
import seedLibraries from './library.js';
import seedUsers from './user.js';
import seedLoans from './loan.js';

const seed = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Pokemon related seeds
        await seedPokemons();
        await seedTrainers();
        
        // Library related seeds
        await seedBooks();
        await seedLibraries();
        await seedUsers();
        await seedLoans();
        
        console.log('All seeds completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
}

seed();