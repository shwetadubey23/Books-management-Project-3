const express = require("express")
const router = express.Router()
const UserController = require('../controllers/UserController');
const BooksController = require('../controllers/BooksController');



router.post('/register',UserController.createUser)

router.get('/books/:bookId',BooksController.getBooksById)

module.exports = router