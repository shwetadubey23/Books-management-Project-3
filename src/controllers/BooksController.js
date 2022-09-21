const BooksModel = require('../models/BooksModel')
const userModel = require('../models/userModel');

const ReviewModel = require('../models/ReviewModel')
const ReviewController = require('../controllers/ReviewController')


let checkValid = function (value) {
    if (typeof value == "undefined" || typeof value == "number" || typeof value == null) { return false }
    if (typeof value == "string" && value.trim().length == 0) { return false }
    return true
}

//=======================CreateBooks==============================================

const createBooks = async function (req, res) {

    try {
        let data = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data

        if (!(title && excerpt && userId && ISBN && category && subcategory && releasedAt))
            return res.status(400).send({ status: false, msg: "Please fill the Mandatory Fields." });

        if (!checkValid(title))
            return res.status(400).send({ status: false, message: "Please enter valid title" });

        if (!checkValid(excerpt))
            return res.status(400).send({ status: false, message: "Please enter valid excerpt" });

        if (!checkValid(ISBN))
            return res.status(400).send({ status: false, message: "Please enter valid ISBN" });

        if (!checkValid(category))
            return res.status(400).send({ status: false, message: "Please enter valid category" });

        if (!checkValid(subcategory))
            return res.status(400).send({ status: false, message: "Please enter valid subcategory" });

        if (!(/^[a-f\d]{24}$/i).test(userId)) { return res.status(400).send({ status: false, message: "Please enter Correct userId." }) }
        let userData = await userModel.findById(userId);
        if (!userData) return res.status(404).send({ status: false, msg: "UserID not found." });



        let checkUnique = await BooksModel.findOne({ $or: [{ title: title }, { ISBN: ISBN }] })

        if (checkUnique) {
            if (title === checkUnique.title) {
                return res.status(400).send({ status: false, message: "title already exist, please give another one" });
            }
            else {
                return res.status(400).send({ status: false, message: "isbn already exist, please give another one" });

            }
        }
        let createBooks = await BooksModel.create(data);
        return res.status(201).send({ status: true, message: 'Success', data: createBooks });

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}

//=====================GetAllBooksById========================================

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


module.exports.createBooks = createBooks
module.exports.getBooksById = getBooksById
