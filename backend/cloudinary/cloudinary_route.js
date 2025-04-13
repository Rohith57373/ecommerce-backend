const express = require('express');
const cloudinary = require('./cloudinary');
const Book = require('../src/books/book.model');
const router = express.Router();

router.post('/upload', async (req, res) => {
    try {
        const {
            image, // cover image
            images, // array of additional images
            title,
            description,
            category,
            trending,
            oldPrice,
            newPrice
        } = req.body;

        const coverUpload = await cloudinary.uploader.upload(image, {
            public_id: `GayathriSilks/cover_${Date.now()}`,
        });

        const additionalImages = [];
        if (images && images.length > 0) {
            for (let i = 0; i < images.length; i++) {
                const result = await cloudinary.uploader.upload(images[i], {
                    folder: `GayathriSilks/${title.replace(/\s+/g, '_')}`,
                    public_id: `image_${Date.now()}_${i}`,
                });
                additionalImages.push(result.secure_url);
            }
        }

        const newBook = new Book({
            title,
            description,
            category,
            trending,
            coverImage: coverUpload.secure_url,
            additionalImages,
            oldPrice,
            newPrice,
        });

        await newBook.save();

        res.status(201).json({
            message: "Book uploaded with multiple images successfully!",
            book: newBook
        });

    } catch (error) {
        console.error("Upload or DB save error:", error);
        res.status(500).json({ message: "Something went wrong!", error });
    }
});

module.exports = router;