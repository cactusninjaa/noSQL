import Loan from '../models/Loan.js';
import Book from '../models/Book.js';
import User from '../models/User.js';
import Library from '../models/Library.js';
import mongoose from 'mongoose';

// Récupérer tous les prêts avec pagination et filtrage
export const getAllLoans = async (req, res) => {
    try {
        const { returned, overdue, notReturned, sort, page = 1, limit = 10 } = req.query;
        
        // Construction du filtre
        const filter = {};
        
        // Filtre pour les prêts retournés/non retournés
        if (returned !== undefined) {
            filter.returned = returned === 'true';
        }
        
        // Filtre spécifique pour les prêts non retournés
        if (notReturned === 'true') {
            filter.returned = false;
        }
        
        // Filtrer les prêts en retard (seulement ceux non retournés)
        if (overdue === 'true') {
            filter.returnDate = { $lt: new Date() };
            filter.returned = false;
        }
        
        // Construction des options de tri
        const sortOptions = sort 
            ? sort.split(',').reduce((acc, field) => {
                const isDescending = field.startsWith('-');
                const fieldName = isDescending ? field.substring(1) : field;
                acc[fieldName] = isDescending ? -1 : 1;
                return acc;
            }, {})
            : { loanDate: -1 };

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const [loans, total] = await Promise.all([
            Loan.find(filter)
                .populate('book', 'title author isbn')
                .populate('user', 'firstName lastName email')
                .populate('library', 'name location')
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum),
            Loan.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            count: loans.length,
            total,
            pagination: {
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            },
            data: loans
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des prêts",
            error: error.message
        });
    }
};

// Récupérer un prêt par ID
export const getLoanById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID de prêt invalide"
            });
        }

        const loan = await Loan.findById(id)
            .populate('book', 'title author isbn pageNumber')
            .populate('user', 'firstName lastName email phone')
            .populate('library', 'name location');

        if (!loan) {
            return res.status(404).json({
                success: false,
                message: "Prêt non trouvé"
            });
        }

        res.status(200).json({
            success: true,
            data: loan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération du prêt",
            error: error.message
        });
    }
};

// Créer un nouveau prêt
export const createLoan = async (req, res) => {
    try {
        const { book, user, library, returnDate } = req.body;

        // Validation des champs requis
        if (!book || !user || !library) {
            return res.status(400).json({
                success: false,
                message: "Les IDs du livre, de l'utilisateur et de la bibliothèque sont requis"
            });
        }

        // Validation des ObjectIds
        if (!mongoose.Types.ObjectId.isValid(book) || 
            !mongoose.Types.ObjectId.isValid(user) || 
            !mongoose.Types.ObjectId.isValid(library)) {
            return res.status(400).json({
                success: false,
                message: "Un ou plusieurs IDs sont invalides"
            });
        }

        // Vérifier que les entités existent
        const [bookExists, userExists, libraryExists] = await Promise.all([
            Book.findById(book),
            User.findById(user),
            Library.findById(library)
        ]);

        if (!bookExists) {
            return res.status(404).json({
                success: false,
                message: "Livre non trouvé"
            });
        }

        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }

        if (!libraryExists) {
            return res.status(404).json({
                success: false,
                message: "Bibliothèque non trouvée"
            });
        }

        // Vérifier si le livre est déjà emprunté
        const existingLoan = await Loan.findOne({ book, returned: false });
        if (existingLoan) {
            return res.status(400).json({
                success: false,
                message: "Ce livre est déjà emprunté"
            });
        }

        // Calculer la date de retour si non fournie (14 jours par défaut)
        const calculatedReturnDate = returnDate ? new Date(returnDate) : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

        const newLoan = new Loan({
            book,
            user,
            library,
            loanDate: new Date(),
            returnDate: calculatedReturnDate,
            returned: false
        });

        const savedLoan = await newLoan.save();
        
        // Populer les références pour la réponse
        const populatedLoan = await Loan.findById(savedLoan._id)
            .populate('book', 'title author isbn')
            .populate('user', 'firstName lastName email')
            .populate('library', 'name location');

        res.status(201).json({
            success: true,
            message: "Prêt créé avec succès",
            data: populatedLoan
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Erreur lors de la création du prêt",
            error: error.message
        });
    }
};

// Mettre à jour un prêt (principalement pour le retour)
export const updateLoan = async (req, res) => {
    try {
        const { id } = req.params;
        const { returned, returnDate } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID de prêt invalide"
            });
        }

        const updateData = {};
        
        if (returned !== undefined) {
            updateData.returned = returned;
        }
        
        if (returnDate) {
            updateData.returnDate = new Date(returnDate);
        }

        const updatedLoan = await Loan.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
        .populate('book', 'title author isbn')
        .populate('user', 'firstName lastName email')
        .populate('library', 'name location');

        if (!updatedLoan) {
            return res.status(404).json({
                success: false,
                message: "Prêt non trouvé"
            });
        }

        res.status(200).json({
            success: true,
            message: "Prêt mis à jour avec succès",
            data: updatedLoan
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Erreur lors de la mise à jour du prêt",
            error: error.message
        });
    }
};

// Supprimer un prêt
export const deleteLoan = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID de prêt invalide"
            });
        }

        const deletedLoan = await Loan.findByIdAndDelete(id);

        if (!deletedLoan) {
            return res.status(404).json({
                success: false,
                message: "Prêt non trouvé"
            });
        }

        res.status(200).json({
            success: true,
            message: "Prêt supprimé avec succès"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression du prêt",
            error: error.message
        });
    }
};

// Marquer un prêt comme retourné
export const returnLoan = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID de prêt invalide"
            });
        }

        const loan = await Loan.findById(id);
        
        if (!loan) {
            return res.status(404).json({
                success: false,
                message: "Prêt non trouvé"
            });
        }

        if (loan.returned) {
            return res.status(400).json({
                success: false,
                message: "Ce prêt a déjà été retourné"
            });
        }

        loan.returned = true;
        await loan.save();

        const populatedLoan = await Loan.findById(loan._id)
            .populate('book', 'title author isbn')
            .populate('user', 'firstName lastName email')
            .populate('library', 'name location');

        res.status(200).json({
            success: true,
            message: "Livre retourné avec succès",
            data: populatedLoan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors du retour du livre",
            error: error.message
        });
    }
};

// Récupérer les prêts en retard
export const getOverdueLoans = async (req, res) => {
    try {
        const overdueLoans = await Loan.find({
            returnDate: { $lt: new Date() },
            returned: false
        })
        .populate('book', 'title author isbn')
        .populate('user', 'firstName lastName email phone')
        .populate('library', 'name location')
        .sort({ returnDate: 1 });

        // Calculer les jours de retard
        const loansWithDelays = overdueLoans.map(loan => {
            const daysOverdue = Math.floor((new Date() - loan.returnDate) / (1000 * 60 * 60 * 24));
            return {
                ...loan.toObject(),
                daysOverdue
            };
        });

        res.status(200).json({
            success: true,
            count: loansWithDelays.length,
            data: loansWithDelays
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des prêts en retard",
            error: error.message
        });
    }
};

// Récupérer tous les prêts non retournés (fonction dédiée)
export const getNotReturnedLoans = async (req, res) => {
    try {
        const { sort, page = 1, limit = 10 } = req.query;
        
        // Filtre pour les prêts non retournés
        const filter = { returned: false };
        
        // Construction des options de tri
        const sortOptions = sort 
            ? sort.split(',').reduce((acc, field) => {
                const isDescending = field.startsWith('-');
                const fieldName = isDescending ? field.substring(1) : field;
                acc[fieldName] = isDescending ? -1 : 1;
                return acc;
            }, {})
            : { loanDate: -1 };

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const [loans, total] = await Promise.all([
            Loan.find(filter)
                .populate('book', 'title author isbn')
                .populate('user', 'firstName lastName email')
                .populate('library', 'name location')
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum),
            Loan.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            count: loans.length,
            total,
            pagination: {
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            },
            data: loans
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des prêts non retournés",
            error: error.message
        });
    }
};

export default {
    getAllLoans,
    getLoanById,
    createLoan,
    updateLoan,
    deleteLoan,
    returnLoan,
    getOverdueLoans,
    getNotReturnedLoans
};