const express = require("express")
const router = express.Router()
const UserControler = require('../controllers/UserController')
const BooksControler = require('../controllers/BooksController')

router.post('/register',UserControler.createUser)
router.post('/login',UserControler.login)



module.exports = router