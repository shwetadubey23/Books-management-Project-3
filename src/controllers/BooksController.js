const BooksModel = require('../models/BooksModel')
const ReviewModel = require('../models/ReviewModel')
const ReviewController = require('../controllers/ReviewController')

const getBooksById = async function(req,res){
    try{
        let bookId = req.params.bookId
        if(!bookId) return res.status(400).send({status: false, msg: "bookId required in params"})
       let allBooks = await BooksModel.findById(bookId).lean()
       if(!allBooks.length == 0) return res.status(404).send({status: false, msg: "No Books found"})
       allBooks.reviewsData = await ReviewModel.find(reviewsData)
       res.status(200).send({status: true, data: allBooks})
    }
    catch(err){
        res.status(500).send({status: "error", error:err.message})
    }
}

module.exports.getBooksById = getBooksById
