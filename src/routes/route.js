const express = require("express")
const router = express.Router()
const UserController = require('../controllers/UserController');
const BooksController = require('../controllers/BooksController');
const ReviewController = require('../controllers/ReviewController')
const middleWare =  require('../middleWare/Auth')


router.post('/register',UserController.createUser)
router.post('/login',UserController.login)

router.post('/books',middleWare.authentication,middleWare.authorisation,BooksController.createBooks)
router.get('/books',middleWare.authentication,BooksController.getBooks)
router.get('/books/:bookId',middleWare.authentication,BooksController.getBooksById)
router.put('/books/:bookId',middleWare.authentication,middleWare.authorisationbyBId,BooksController.updateBookById)
router.delete('/books/:bookId',middleWare.authentication,middleWare.authorisationbyBId,BooksController.BooksDeleteById)

router.post('/books/:bookId/review',ReviewController.createReview)
router.put('/books/:bookId/review/:reviewId',ReviewController.updateReview)
router.delete('/books/:bookId/review/:reviewId',ReviewController.deleteReview)

router.all("/*",(req,res)=>{
    res.status(400).send({status:false,error:"endpoint is not valid"})
})

module.exports = router