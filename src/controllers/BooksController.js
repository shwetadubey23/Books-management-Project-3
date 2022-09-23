const BooksModel = require('../models/BooksModel')
const userModel = require('../models/userModel');

const ReviewModel = require('../models/ReviewModel')
const ReviewController = require('../controllers/ReviewController')


let checkValid = function (value) {
    if (typeof value == "undefined" || typeof value == "number" || typeof value == null) { return false }
    if (typeof value == "string" && value.trim().length == 0) 
    { return false }
    return true
}

//=======================CreateBooks==============================================

const createBooks = async function (req, res) {

    try {
        let data = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data
        if (Object.keys(data).length == 0) { return res.status(400).send({ status:false, msg:"Provide some data"}) }
        
        if (!checkValid(title))
            return res.status(400).send({ status: false, message: "Please enter title" });

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

        let checkUnique = await BooksModel.findOne({ $or: [{ title: title }, { ISBN: ISBN }] })

        if (checkUnique) {
            if (title === checkUnique.title) {
                return res.status(400).send({ status: false, message: "title already exist, please give another one" });
            }
            else {
                return res.status(400).send({ status: false, message: "isbn already exist, please give another one" });

//============================================ getBooksById =================================================//
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
       let allBooks = await BooksModel.findById({_id: bookId}).lean()//{isDeleted: false}]}).lean()
       if(allBooks.isDeleted == true) return res.status(404).send({status: false, msg: "No Books found"})
       let reviewData = await ReviewModel.findById(bookId)
       allBooks["reviewsData"] = [reviewData ]
       res.status(200).send({status: true, data: allBooks})
    }
    catch(err){
        res.status(500).send({status: "error", error:err.message})
    }
}


//=======================BooksDeleteById========================================

const BooksDeleteById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, msg: "bookId required in params" })
        if (!(/^[a-f\d]{24}$/i).test(bookId)) { return res.status(400).send({ status: false, message: "Please enter Correct bookId." }) }

        let isdelete = await BooksModel.findById({ _id: bookId}) //isDeleted: true })
        if (isdelete.isDeleted == true) return res.status(404).send({ status: false, msg: "book is already deleted" })
        let checkData = await BooksModel.findByIdAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true });
        res.status(200).send({ status: true, msg: "Document deleted Successfully" });

        if (!checkData) return res.status(404).send({ status: false, msg: "NO Books found" })
        //   let bookForDelete = await BooksModel.updateMany({ $and: [bookId, { isDeleted: false}], 
    }
    catch (err) {
        res.status(500).send({ msg: err.message });
    }
}


// const BooksDeleteById = async function (req,res){
//     try{
//       let bookId = req.params.bookId
//       if(!bookId) return res.status(400).send({status: false, msg: "bookId required in params"})
//       if (!(/^[a-f\d]{24}$/i).test(bookId)) { return res.status(400).send({ status: false, message: "Please enter Correct bookId." }) }

//       const checkData = await BooksModel.findById({_id: bookId})
//       if(!checkData.length == 0) return res.status(404).send({status: false, msg: "NO Books found"})
//       let bookForDelete = await BooksModel.updateMany({ $and: [bookId, { isDeleted: false}], $set: {isDeleted: true, deletedAt: Date.now()}}, { new: true});
//       if(bookForDelete.isDeleted == true) return res.status(404).send({status: false, msg: "Book already deleted "})
    
//       res.status(200).send({status: true, msg: "Document deleted Successfully"});
//     }
//     catch(err){
//         res.status(500).send({msg: err.message});
//     }
// }




module.exports.createBooks = createBooks
module.exports.getBooksById = getBooksById
module.exports.BooksDeleteById = BooksDeleteById
