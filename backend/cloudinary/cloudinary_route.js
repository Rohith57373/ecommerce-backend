const express = require('express');
const cloudinary = require('./cloudinary');
const Book = require('../src/books/book.model'); // adjust the path if needed
const router = express.Router();

router.post('/upload', async (req, res) => {
    try {
        const { image, title, description, category, trending, oldPrice, newPrice } = req.body;

        // Upload to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(image, {
            public_id: `GayathriSilks_${Date.now()}`,
        });

        // Create a new book entry
        const newBook = new Book({
            title,
            description,
            category,
            trending,
            coverImage: uploadResult.secure_url,
            oldPrice,
            newPrice,
        });

        await newBook.save();

        res.status(201).json({ message: "Book uploaded and saved successfully!", book: newBook });
    } catch (error) {
        console.error("Upload or DB save error:", error);
        res.status(500).json({ message: "Something went wrong!", error });
    }
});

module.exports = router;
