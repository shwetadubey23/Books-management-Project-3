const express = require("express")
const router = express.Router()
const UserController = require('../controllers/UserController');
const BooksController = require('../controllers/BooksController');



router.post('/register',UserController.createUser)
router.post('/login',UserController.login)
router.post('/books',BooksController.createBooks)

router.get('/books/:bookId',BooksController.getBooksById)
router.delete('/books/:bookId',BooksController.BooksDeleteById)

module.exports = router