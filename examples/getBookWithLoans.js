import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from '../models/Book.js';

dotenv.config();

async function getBookWithLoans() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');
    
    // Trouver un livre et peupler (populate) ses prêts
    const book = await Book.findOne().populate({
      path: 'loan',
      model: 'Loan',
      // Vous pouvez également peupler les données de l'utilisateur et de la bibliothèque pour chaque prêt
      populate: [
        { path: 'user', model: 'User' },
        { path: 'library', model: 'Library' }
      ]
    });
    
    if (!book) {
      console.log('Aucun livre trouvé');
      return;
    }
    
    console.log(`Livre: ${book.title} par ${book.author}`);
    
    if (book.loan && book.loan.length > 0) {
      console.log(`Ce livre a ${book.loan.length} prêt(s):`);
      
      book.loan.forEach((loan, index) => {
        console.log(`\nPrêt #${index + 1}:`);
        console.log(`- Emprunté le: ${loan.loanDate.toLocaleDateString()}`);
        console.log(`- À rendre le: ${loan.returnDate.toLocaleDateString()}`);
        console.log(`- Statut: ${loan.returned ? 'Retourné' : 'En cours'}`);
        
        if (loan.user) {
          console.log(`- Emprunteur: ${loan.user.firstName} ${loan.user.lastName}`);
        }
        
        if (loan.library) {
          console.log(`- Bibliothèque: ${loan.library.name} (${loan.library.localisation})`);
        }
      });
    } else {
      console.log('Ce livre n\'a pas encore été emprunté');
    }

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connexion à MongoDB fermée');
  }
}

// Exécuter la fonction
getBookWithLoans();
