const express = require("express")
const router = express.Router()
const UserController = require('../controllers/UserController');
const BooksController = require('../controllers/BooksController');
const ReviewController = require('../controllers/ReviewController')


router.post('/register',UserController.createUser)
router.post('/login',UserController.login)

router.post('/books',BooksController.createBooks)
router.put('/books/:bookId',BooksController.updateBookById)
router.get('/books/:bookId',BooksController.getBooksById)
router.delete('/books/:bookId',BooksController.BooksDeleteById)

router.post('/books/:bookId/review',ReviewController.createReview)
router.put('/books/:bookId/review/:reviewId',ReviewController.updateReview)
router.delete('/books/:bookId/review/:reviewId',ReviewController.deleteReview)

router.all("/*",(req,res)=>{
    res.status(400).send({status:false,error:"endpoint is not valid"})
})

module.exports = router