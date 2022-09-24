const express = require("express")
const router = express.Router()
const UserControler = require('../controllers/UserController')
const BooksControler = require('../controllers/BooksController')
const authController = require('../middleware/auth')
//==================================== Routes =================================================================//
router.post('/register',UserControler.createUser)
router.post('/login',UserControler.login)
router.post('/books',authController.authentication,authController.authorisation,BooksControler.createBooks)
router.get("/books",authController.authentication,BooksControler.getBookDetails)
router.get("/books/:bookId",authController.authentication,BooksControler.getBooksById)
router.delete("/books/:bookId",authController.authentication,authController.authorisationbyBId,BooksControler.BooksDeleteById)

router.all("/*",(req,res)=>{
    res.status(400).send({status:false,error:"endpoint is not valid"})
})




module.exports = router;