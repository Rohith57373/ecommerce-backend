const Book = require("./book.model");
const cloudinary = require('cloudinary').v2;

const postABook = async (req, res) => {
    try {
        const newBook = await Book({ ...req.body });
        await newBook.save();
        res.status(200).send({ message: "Book posted sucessfully", book: newBook })
    } catch (error) {
        console.error("error creating book", error);
        res.status(500).send({ message: "Failed to create book" })
    }
}


// get all books
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.status(200).send(books)

    } catch (error) {
        console.error("error fetching books", error);
        res.status(500).send({ message: "Failed to fetch book" })
    }
}


const getSingleBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            res.status(404).send({ message: "Book not Found!" })
        }
        res.status(200).send(book)

    } catch (error) {
        console.error("error fetching books", error);
        res.status(500).send({ message: "Failed to fetch book" })
    }
}

// update book date
const UpdateBook = async (req, res) => {
    try {

        const { id } = req.params;
        const UpdatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
        if (!UpdatedBook) {
            res.status(404).send({ message: "Book is not Found!" })
        }
        res.status(200).send({
            message: "Book Updated sucessfully",
            book: UpdatedBook
        })
    } catch (error) {
        console.error("Error updating a book", error);
        res.status(500).send({ message: "Failed to fetch book!" })
    }
}

// delete a book
const DeleteBook = async (req, res) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found!" });
        }

        const extractPublicId = (url) => {
            const path = url.split('/upload/')[1]; // e.g., v1234/GayathriSilks/krishna/img.png
            const withoutVersion = path.split('/').slice(1).join('/');
            return withoutVersion.split('.')[0]; // returns "GayathriSilks/krishna/img"
        };

        // Extract folder name from any image (we'll use the first additional image or fallback to cover)
        const sampleImageUrl = book.additionalImages?.[0] || book.coverImage;
        let folderToDelete = "";
        if (sampleImageUrl) {
            const parts = sampleImageUrl.split('/upload/')[1].split('/');
            folderToDelete = parts.slice(1, -1).join('/'); // Skip version and file name
        }

        // Delete cover image
        if (book.coverImage) {
            const publicId = extractPublicId(book.coverImage);
            console.log("Deleting cover image with public_id:", publicId);
            const result = await cloudinary.uploader.destroy(publicId);
            console.log("Cover image deleted:", result);
        }

        // Delete additional images
        if (book.additionalImages && book.additionalImages.length > 0) {
            for (let i = 0; i < book.additionalImages.length; i++) {
                const imageUrl = book.additionalImages[i];
                const publicId = extractPublicId(imageUrl);
                console.log(`Deleting additional image with public_id: ${publicId}`);
                const result = await cloudinary.uploader.destroy(publicId);
                console.log(`Deleted additional image ${i}:`, result);
            }
        }

        // Delete the folder from Cloudinary (optional, only if folder is empty)
        if (folderToDelete) {
            console.log("Trying to delete folder:", folderToDelete);
            const folderResult = await cloudinary.api.delete_folder(folderToDelete);
            console.log("Folder deleted:", folderResult);
        }

        // Delete book from DB
        const deletedBook = await Book.findByIdAndDelete(id);
        res.status(200).json({
            message: "Book deleted successfully!",
            book: deletedBook
        });

    } catch (error) {
        console.error("Error deleting a book:", error);
        res.status(500).json({ message: "Failed to delete book!" });
    }
};



module.exports = {
    postABook,
    getAllBooks,
    getSingleBook,
    UpdateBook,
    DeleteBook
}