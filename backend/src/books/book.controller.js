const Book = require("./book.model");

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
        const deleteBook = await Book.findByIdAndDelete(id);
        if (!deleteBook) {
            res.status(404).send({ message: "Book is not found!" })
        } res.status(200).send({
            message: "Book Deleted sucessfully",
            book: deleteBook
        })

    } catch (error) {
        console.error("Error deleting a book", error);
        res.status(500).send({ message: "Failed to Delete book!" })
    }
}


module.exports = {
    postABook,
    getAllBooks,
    getSingleBook,
    UpdateBook,
    DeleteBook
}