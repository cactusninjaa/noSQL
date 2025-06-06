import Book from "../models/Book.js";
import Loan from "../models/Loan.js";
import mongoose from "mongoose";

// Récupérer tous les livres avec possibilité de recherche textuelle
export const getAllBooks = async (req, res) => {
    try {
        const { title, author, types, language, sort, page = 1, limit = 10, query } = req.query;
        
        let filter = {};
        
        if (query) {
            filter = { $text: { $search: query } };
        } else {
            filter = Object.entries({ title, author, types, language })
                .reduce((acc, [key, value]) => {
                    if (value) {
                        acc[key] = ['title', 'author'].includes(key) 
                            ? { $regex: value, $options: 'i' }
                            : value;
                    }
                    return acc;
                }, {});
        }
        
        // Construction des options de tri
        const sortOptions = sort 
            ? sort.split(',').reduce((acc, field) => {
                const isDescending = field.startsWith('-');
                const fieldName = isDescending ? field.substring(1) : field;
                acc[fieldName] = isDescending ? -1 : 1;
                return acc;
            }, {})
            : { title: 1 };

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const [books, total] = await Promise.all([
            Book.find(filter)
                .sort(sortOptions)
                .skip(skip)
                .limit(limitNum),
            Book.countDocuments(filter)
        ]);

        // Formatage de la réponse
        return res.status(200).json({
            success: true,
            count: books.length,
            total,
            pagination: {
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            },
            data: books
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Erreur lors de la récupération des livres",
            error: error.message
        });
    }
};

// Récupérer un livre par son ID
export const getBookById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "ID de livre invalide"
        });
        }

        const book = await Book.findById(id);

        if (!book) {
        return res.status(404).json({
            success: false,
            message: "Livre non trouvé"
        });
        }

        res.status(200).json({
        success: true,
        data: book
        });
    } catch (error) {
        res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération du livre",
        error: error.message
        });
    }
};

// Créer un nouveau livre
export const createBook = async (req, res) => {
    try {
        const newBook = await Book.create(req.body);

        res.status(201).json({
        success: true,
        data: newBook
        });
    } catch (error) {
        res.status(400).json({
        success: false,
        message: "Erreur lors de la création du livre",
        error: error.message
        });
    }
};

// Mettre à jour un livre
export const updateBook = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "ID de livre invalide"
        });
        }

        const book = await Book.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
        });

        if (!book) {
        return res.status(404).json({
            success: false,
            message: "Livre non trouvé"
        });
        }

        res.status(200).json({
        success: true,
        data: book
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Erreur lors de la mise à jour du livre",
            error: error.message
        });
    }
};

// Supprimer un livre
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de livre invalide"
      });
    }

    // Vérifier si le livre a des prêts actifs
    const activeLoans = await Loan.countDocuments({
      book: id,
      returned: false
    });

    if (activeLoans > 0) {
      return res.status(400).json({
        success: false,
        message: "Impossible de supprimer un livre avec des prêts actifs"
      });
    }

    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Livre non trouvé"
      });
    }

    // Supprimer également les références dans les prêts
    await Loan.deleteMany({ book: id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du livre",
      error: error.message
    });
  }
};

// Recherche avancée de livres
export const searchBooks = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Paramètre de recherche requis"
      });
    }

    const books = await Book.find({
      $text: { $search: query }
    }, {
      score: { $meta: "textScore" }
    }).sort({ score: { $meta: "textScore" } });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la recherche de livres",
      error: error.message
    });
  }
};

// Récupérer les prêts d'un livre spécifique
export const getBookLoans = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de livre invalide"
      });
    }

    const loans = await Loan.find({ book: id })
      .populate('user', 'firstName lastName')
      .populate('library', 'name localisation');

    res.status(200).json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des prêts du livre",
      error: error.message
    });
  }
};

// Vérifier la disponibilité d'un livre
export const checkBookAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "ID de livre invalide"
      });
    }

    // Vérifier si le livre existe
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Livre non trouvé"
      });
    }

    // Vérifier si le livre est actuellement emprunté
    const activeLoans = await Loan.countDocuments({
      book: id,
      returned: false
    });

    const isAvailable = activeLoans === 0;

    res.status(200).json({
      success: true,
      data: {
        book: {
          _id: book._id,
          title: book.title,
          author: book.author
        },
        isAvailable,
        activeLoansCount: activeLoans
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la vérification de la disponibilité du livre",
      error: error.message
    });
  }
};

// Récupérer les livres par type/genre
export const getBooksByType = async (req, res) => {
  try {
    const { type } = req.params;
    
    // Vérifier si le type est valide
    const validTypes = ['Fantaisie', 'Policier', 'SF'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type de livre invalide. Les types valides sont: Fantaisie, Policier, SF"
      });
    }

    const books = await Book.find({ types: type });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des livres par type",
      error: error.message
    });
  }
};

// Récupérer les livres par langue
export const getBooksByLanguage = async (req, res) => {
  try {
    const { language } = req.params;
    
    // Vérifier si la langue est valide
    const validLanguages = ['fr', 'en'];
    if (!validLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Langue invalide. Les langues valides sont: fr, en"
      });
    }

    const books = await Book.find({ language });

    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des livres par langue",
      error: error.message
    });
  }
};

// Recherche d'un livre par ISBN
export const getBookByIsbn = async (req, res) => {
  try {
    const { isbn } = req.params;
    
    // Vérifier que l'ISBN est un nombre valide
    if (isNaN(isbn)) {
      return res.status(400).json({
        success: false,
        message: "L'ISBN doit être un nombre valide"
      });
    }

    // Rechercher le livre par ISBN
    const book = await Book.findOne({ isbn: Number(isbn) });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Aucun livre trouvé avec cet ISBN"
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la recherche du livre par ISBN",
      error: error.message
    });
  }
};

// Exporter toutes les fonctions du controller
export default {
    getAllBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
    searchBooks,
    getBookLoans,
    checkBookAvailability,
    getBooksByType,
    getBookByIsbn,

    getBooksByLanguage
};