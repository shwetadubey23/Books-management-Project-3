const express = require("express")
const router = express.Router()
const UserControler = require('../controllers/UserController')
const BooksControler = require('../controllers/BooksController')

router.post('/register',UserControler.createUser)
router.post('/books', BooksControler.createBooks)


module.exports = router