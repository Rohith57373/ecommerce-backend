const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    trending: {
        type: Boolean,
        required: true,
    },
    coverImage: {
        type: String,
        required: true,
    },
    additionalImages: [String],
    oldPrice: Number,
    newPrice: Number,
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
})


const Book = mongoose.model("book", bookSchema)

module.exports = Book;