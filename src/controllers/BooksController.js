const BooksModel = require('../models/BooksModel')
const userModel = require('../models/UserModel');
const ObjectId = require('mongoose').Types.ObjectId

const ReviewModel = require('../models/ReviewModel')




//=======================CreateBooks==============================================

const createBooks = async function (req, res) {

    try {
        let data = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data

        // if (!(title && excerpt && userId && ISBN && category && subcategory && releasedAt))
        //     return res.status(400).send({ status: false, msg: "Please fill the Mandatory Fields." });

        if (!(title))
            return res.status(400).send({ status: false, message: "Please enter  title" });
        if (!(excerpt))
            return res.status(400).send({ status: false, message: "Please enter  excerpt" });
        if (!(userId))
            return res.status(400).send({ status: false, message: "Please enter  userId" });

        if (!(ISBN))
            return res.status(400).send({ status: false, message: "Please enter  ISBN" });
        if (!(category))
            return res.status(400).send({ status: false, message: "Please enter  category" });
        if (!(subcategory))
            return res.status(400).send({ status: false, message: "Please enter  subcategory" });
        if (!releasedAt) {
            return res.status(400).send({ status: false, message: "Please enter  releasedAt" });
        }
        if (!(/^[a-f\d]{24}$/i).test(userId)) { return res.status(400).send({ status: false, message: "Please enter Correct userId." }) }
        let userData = await userModel.findById(userId);
        if (!userData) return res.status(404).send({ status: false, msg: "UserID not found." });

        if (!(/^(?=(?:\D*\d){13}(?:(?:\D*\d){})?$)[\d-]+$/).test(ISBN))
            return res.status(400).send({ status: false, message: "Please enter Correct ISBN." })

        if (!(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/).test(releasedAt))
            return res.status(400).send({ status: false, message: "Please enter valid releasedAt Date format('YYYY-MM-DD')" });

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


//=========================Get All Books===========================================

const getBooks = async function(req, res) {
    try {
        let queries = req.query;
        console.log(queries)
        let allBooks = await BooksModel.find({ $and: [queries, { isDeleted: false }] }).select({ title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 });
        if (allBooks.length == 0) return res.status(404).send({ status: false, msg: "No book found" });;
        return res.status(200).send({ status: true, data: allBooks });
    } catch (error) {
        res.status(500).send({ status: false, error: error.message });
    }
}


//=====================GetAllBooksById====================================================

const getBooksById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, msg: "Please give a Valid bookId " })

        let allBooks = await BooksModel.findById({ _id: bookId })//{isDeleted: false}]}).lean()
        if(!allBooks || allBooks.isDeleted == true)
        return res.status(404).send({ status: false, msg: "Book not found" })
     
         
        let reviewData = await ReviewModel.find({bookId: allBooks._id, isDeleted: false})
        let bookReview = {allBooks, reviewsData: reviewData}
        res.status(200).send({ status: true, data: bookReview })
    }
    catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}


//=========================Update Book================================================

const updateBookById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, msg: "bookId required in params" })
        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, msg: "Please give a Valid bookId " })

        let checkId = await BooksModel.findById(bookId)
        if (!checkId) return res.status(404).send({ status: false, msg: "No Books found" })
        if (checkId.isDeleted == true)
            return res.status(404).send({ status: false, msg: "book is already deleted" })

        let details = req.body
        if (Object.keys(details.length) == 0) return res.status(400).send({ status: false, msg: "Please give Details in body" })
        let checkDatainDb = await BooksModel.findOne({ title: details.title })
        if (checkDatainDb) return res.status(400).send({ status: false, msg: "title is already used" })
        let bookIsbnInDb = await BooksModel.findOne({ ISBN: details.ISBN })
        if (bookIsbnInDb)
            return res.status(400).send({ status: false, msg: "ISBN is already used" })
        if (!(/^(?=(?:\D*\d){13}(?:(?:\D*\d){})?$)[\d-]+$/).test(details.ISBN))
            return res.status(400).send({ status: false, message: "Please enter Correct ISBN." })

        const updatedBook = await BooksModel.findOneAndUpdate({ _id: bookId },
            { $set: { title: details.title, excerpt: details.excerpt, releasedAt: details.releasedAt, ISBN: details.ISBN } },
            { new: true })
        return res.status(200).send({ status: true, data: updatedBook })
    }
    catch (err) {
        res.status(500).send({ status: "error", error: err.message })
    }
}




//=======================BooksDeleteById========================================

const BooksDeleteById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, msg: "bookId required in params" })
        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, msg: "Please give a Valid bookId " })

        let isdelete = await BooksModel.findById({ _id: bookId }) //isDeleted: true })
        if (isdelete.isDeleted == true)
            return res.status(404).send({ status: false, msg: "book is already deleted" })
        let checkData = await BooksModel.findByIdAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true });
        res.status(200).send({ status: true, msg: "Document deleted Successfully" });

        if (!checkData) return res.status(404).send({ status: false, msg: "NO Books found" })
        //   let bookForDelete = await BooksModel.updateMany({ $and: [bookId, { isDeleted: false}], 
    }
    catch (err) {
        res.status(500).send({ msg: err.message });
    }
}






module.exports.createBooks = createBooks
module.exports.getBooks  =  getBooks
module.exports.getBooksById = getBooksById
module.exports.updateBookById = updateBookById
module.exports.BooksDeleteById = BooksDeleteById

