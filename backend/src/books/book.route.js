const express = require('express')
const Book = require('./book.model');
const { postABook, getAllBooks, getSingleBook, UpdateBook, DeleteBook } = require('./book.controller');
const verifyAdminToken = require('../middlewares/VerifyAdminToken');
const router = express.Router();

// frontend -> request -> api -> backend -> contreoller -> database -> backend -> frontend
// Post a book
// post = when submit something frontend to db
// get = when get something frontend from db
// put/patch = when edit or update something

// post a book
router.post('/create-book', verifyAdminToken, postABook)


// get all books
router.get("/", getAllBooks)

// single book endpoint
router.get("/:id", getSingleBook)

// update a book endpoint
router.put("/edit/:id", UpdateBook)

// delete a book endpoint
router.delete("/:id", verifyAdminToken, DeleteBook)



module.exports = router;
