import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Loan from '../models/Loan.js';

dotenv.config();

async function getUserLoans() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connecté à MongoDB');
    
    // Trouver un utilisateur
    const user = await User.findOne();
    
    if (!user) {
      console.log('Aucun utilisateur trouvé');
      return;
    }
    
    console.log(`Utilisateur: ${user.firstName} ${user.lastName}`);
    
    // Trouver tous les prêts associés à cet utilisateur
    const loans = await Loan.find({ user: user._id })
      .populate('book')
      .populate('library');
    
    if (loans.length > 0) {
      console.log(`\nCet utilisateur a ${loans.length} prêt(s):`);
      
      loans.forEach((loan, index) => {
        console.log(`\nPrêt #${index + 1}:`);
        console.log(`- Livre: ${loan.book ? loan.book.title : 'Inconnu'}`);
        console.log(`- Bibliothèque: ${loan.library ? loan.library.name : 'Inconnue'}`);
        console.log(`- Emprunté le: ${loan.loanDate.toLocaleDateString()}`);
        console.log(`- À rendre le: ${loan.returnDate.toLocaleDateString()}`);
        console.log(`- Statut: ${loan.returned ? 'Retourné' : 'En cours'}`);
        
        // Calcul du retard éventuel
        if (!loan.returned) {
          const today = new Date();
          if (today > loan.returnDate) {
            const diffTime = Math.abs(today - loan.returnDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            console.log(`- En retard de: ${diffDays} jour(s)!`);
          } else {
            const diffTime = Math.abs(loan.returnDate - today);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            console.log(`- Jours restants: ${diffDays} jour(s)`);
          }
        }
      });
    } else {
      console.log('Cet utilisateur n\'a pas d\'emprunts en cours');
    }

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Connexion à MongoDB fermée');
  }
}

// Exécuter la fonction
getUserLoans();
