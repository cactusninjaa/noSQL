import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    author: {
        type: String,
        required: true
    }, 
    publisher: {
        type: String, 
        maxlength: 200
    },
    description: {
        type: String,
        maxlength: 1000
    },
    types: {
        type: String,
        enum: ['Fantaisie', 'Policier', 'SF']
    }, 
    language: {
        type: String,
        required: true,
        enum: ['fr', 'en'],
        default: 'fr'
    },
    publishedDate: {
        type: Date,
        required: true,
        trim: true
    },
    isbn: {
        type: Number, 
        trim: true
    },
    pageNumber:{
        type: Number
    }
})

// Index de texte pour la recherche
BookSchema.index(
    { title: "text", author: "text", publisher: "text", description: "text" },
    { weights: { title: 5, author: 3, publisher: 2, description: 1 } }
);

// Index numérique pour l'ISBN
BookSchema.index({ isbn: 1 });

const Book = mongoose.model("Book", BookSchema)

export default Book