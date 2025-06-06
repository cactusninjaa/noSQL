import User from '../models/User.js';
import Loan from '../models/Loan.js';
import mongoose from 'mongoose';

// Récupérer tous les utilisateurs avec pagination et filtrage
export const getAllUsers = async (req, res) => {
    try {
        const { firstName, lastName, email, sort, page = 1, limit = 10 } = req.query;
        
        // Construction du filtre
        const filter = {};
        if (firstName) filter.firstName = { $regex: firstName, $options: 'i' };
        if (lastName) filter.lastName = { $regex: lastName, $options: 'i' };
        if (email) filter.email = { $regex: email, $options: 'i' };
        
        // Construction des options de tri
        const sortOptions = sort 
            ? sort.split(',').reduce((acc, field) => {
                const isDescending = field.startsWith('-');
                const fieldName = isDescending ? field.substring(1) : field;
                acc[fieldName] = isDescending ? -1 : 1;
                return acc;
            }, {})
            : { firstName: 1, lastName: 1 };

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const [users, total] = await Promise.all([
            User.find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum),
            User.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            pagination: {
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            },
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des utilisateurs",
            error: error.message
        });
    }
};

// Récupérer un utilisateur par ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID utilisateur invalide"
            });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération de l'utilisateur",
            error: error.message
        });
    }
};

// Créer un nouvel utilisateur
export const createUser = async (req, res) => {
    try {
        const { firstName, lastName, email, phone } = req.body;

        // Validation des champs requis
        if (!firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: "Le prénom et le nom sont requis"
            });
        }

        // Vérifier l'unicité de l'email s'il est fourni
        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Un utilisateur avec cet email existe déjà"
                });
            }
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            phone,
            membershipDate: new Date()
        });

        const savedUser = await newUser.save();

        res.status(201).json({
            success: true,
            message: "Utilisateur créé avec succès",
            data: savedUser
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Erreur lors de la création de l'utilisateur",
            error: error.message
        });
    }
};

// Mettre à jour un utilisateur
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, phone } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID utilisateur invalide"
            });
        }

        // Vérifier l'unicité de l'email s'il est modifié
        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: id } });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Un autre utilisateur avec cet email existe déjà"
                });
            }
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { firstName, lastName, email, phone },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }

        res.status(200).json({
            success: true,
            message: "Utilisateur mis à jour avec succès",
            data: updatedUser
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Erreur lors de la mise à jour de l'utilisateur",
            error: error.message
        });
    }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID utilisateur invalide"
            });
        }

        // Vérifier s'il y a des prêts actifs
        const activeLoans = await Loan.countDocuments({ userId: id, returned: false });
        if (activeLoans > 0) {
            return res.status(400).json({
                success: false,
                message: "Impossible de supprimer un utilisateur avec des prêts actifs"
            });
        }

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "Utilisateur non trouvé"
            });
        }

        res.status(200).json({
            success: true,
            message: "Utilisateur supprimé avec succès"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la suppression de l'utilisateur",
            error: error.message
        });
    }
};

// Récupérer les prêts d'un utilisateur
export const getUserLoans = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "ID utilisateur invalide"
            });
        }

        const loans = await Loan.find({ userId: id })
            .populate('bookId', 'title author isbn')
            .populate('libraryId', 'name location')
            .sort({ loanDate: -1 });

        res.status(200).json({
            success: true,
            count: loans.length,
            data: loans
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des prêts de l'utilisateur",
            error: error.message
        });
    }
};

export default {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserLoans
};