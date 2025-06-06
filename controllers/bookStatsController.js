import Book from '../models/Book.js';

// Obtenir les statistiques générales des livres
export const getBookStats = async (req, res) => {
    try {
        // Nombre total de livres
        const totalBooks = await Book.countDocuments();
        
        // Statistiques des pages
        const pageStats = await Book.aggregate([
            {
                $group: {
                    _id: null,
                    avgPages: { $avg: "$pageNumber" },
                    minPages: { $min: "$pageNumber" },
                    maxPages: { $max: "$pageNumber" },
                    totalPages: { $sum: "$pageNumber" }
                }
            }
        ]);

        // Statistiques des langues
        const languageStats = await Book.aggregate([
            {
                $group: {
                    _id: "$language",
                    count: { $sum: 1 },
                    percentage: { $sum: 1 }
                }
            },
            {
                $addFields: {
                    percentage: {
                        $multiply: [
                            { $divide: ["$count", totalBooks] },
                            100
                        ]
                    }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // Statistiques des types/genres
        const typeStats = await Book.aggregate([
            {
                $group: {
                    _id: "$types",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);

        // Statistiques des auteurs
        const authorStats = await Book.aggregate([
            {
                $group: {
                    _id: "$author",
                    bookCount: { $sum: 1 },
                    totalPages: { $sum: "$pageNumber" }
                }
            },
            {
                $sort: { bookCount: -1 }
            },
            {
                $limit: 10 // Top 10 des auteurs
            }
        ]);

        // Statistiques des éditeurs
        const publisherStats = await Book.aggregate([
            {
                $group: {
                    _id: "$publisher",
                    bookCount: { $sum: 1 }
                }
            },
            {
                $sort: { bookCount: -1 }
            },
            {
                $limit: 10 // Top 10 des éditeurs
            }
        ]);

        // Statistiques par année de publication
        const yearStats = await Book.aggregate([
            {
                $group: {
                    _id: { $year: "$publishedDate" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id": -1 }
            }
        ]);

        const stats = {
            general: {
                totalBooks,
                avgPages: pageStats[0]?.avgPages?.toFixed(2) || 0,
                minPages: pageStats[0]?.minPages || 0,
                maxPages: pageStats[0]?.maxPages || 0,
                totalPages: pageStats[0]?.totalPages || 0
            },
            languages: languageStats.map(lang => ({
                language: lang._id,
                count: lang.count,
                percentage: lang.percentage.toFixed(2)
            })),
            types: typeStats.map(type => ({
                type: type._id || 'Non spécifié',
                count: type.count
            })),
            topAuthors: authorStats.map(author => ({
                author: author._id,
                bookCount: author.bookCount,
                totalPages: author.totalPages || 0
            })),
            topPublishers: publisherStats.map(pub => ({
                publisher: pub._id || 'Non spécifié',
                bookCount: pub.bookCount
            })),
            publicationYears: yearStats.map(year => ({
                year: year._id,
                count: year.count
            }))
        };

        res.status(200).json({
            success: true,
            data: stats
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques des livres',
            error: error.message
        });
    }
};

// Obtenir les statistiques par langue spécifique
export const getStatsByLanguage = async (req, res) => {
    try {
        const { language } = req.params;
        
        const stats = await Book.aggregate([
            { $match: { language: language } },
            {
                $group: {
                    _id: null,
                    totalBooks: { $sum: 1 },
                    avgPages: { $avg: "$pageNumber" },
                    minPages: { $min: "$pageNumber" },
                    maxPages: { $max: "$pageNumber" },
                    totalPages: { $sum: "$pageNumber" }
                }
            }
        ]);

        const typesByLanguage = await Book.aggregate([
            { $match: { language: language } },
            {
                $group: {
                    _id: "$types",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                language,
                general: stats[0] || {
                    totalBooks: 0,
                    avgPages: 0,
                    minPages: 0,
                    maxPages: 0,
                    totalPages: 0
                },
                typeDistribution: typesByLanguage.map(type => ({
                    type: type._id || 'Non spécifié',
                    count: type.count
                }))
            }
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques par langue:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques par langue',
            error: error.message
        });
    }
};

// Obtenir les statistiques par type/genre
export const getStatsByType = async (req, res) => {
    try {
        const { type } = req.params;
        
        const stats = await Book.aggregate([
            { $match: { types: type } },
            {
                $group: {
                    _id: null,
                    totalBooks: { $sum: 1 },
                    avgPages: { $avg: "$pageNumber" },
                    minPages: { $min: "$pageNumber" },
                    maxPages: { $max: "$pageNumber" },
                    totalPages: { $sum: "$pageNumber" }
                }
            }
        ]);

        const languagesByType = await Book.aggregate([
            { $match: { types: type } },
            {
                $group: {
                    _id: "$language",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                type,
                general: stats[0] || {
                    totalBooks: 0,
                    avgPages: 0,
                    minPages: 0,
                    maxPages: 0,
                    totalPages: 0
                },
                languageDistribution: languagesByType.map(lang => ({
                    language: lang._id,
                    count: lang.count
                }))
            }
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des statistiques par type:', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques par type',
            error: error.message
        });
    }
};
