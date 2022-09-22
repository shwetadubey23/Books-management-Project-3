const BooksModel = require('../models/BooksModel');
const userModel = require('../models/userModel');
const mongoose = require('mongoose')
let forUserid = /^[a-f\d]{24}$/i
let ISBNcheck = /(?=.{17}$)97(?:8|9)([ -])\d{1,5}\1\d{1,7}\1\d{1,6}\1\d$/
let Datecheck = /^(18|19|20)[0-9]{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/




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
            return res.status(400).send({ status: false, message: "Please enter  excerpt" });

        if (!checkValid(ISBN) && (!ISBNcheck.test(ISBN)))
            return res.status(400).send({ status: false, message: "Please enter valid ISBN" });

        if (!checkValid(category))
            return res.status(400).send({ status: false, message: "Please enter  category" });

        if (!checkValid(subcategory))
            return res.status(400).send({ status: false, message: "Please enter subcategory" });

            if (!checkValid(releasedAt) && !Datecheck.test(releasedAt))
            return res.status(400).send({ status: false, message: "Please enter valid format of date ex:-YYYY-MM-DD" });

        if (!forUserid.test(userId)) { return res.status(400).send({ status: false, message: "Please enter Correct userId." }) }
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


//============================================ getBooksById =================================================//

const getBooksById = async function(req,res){
    try{
        let bookId = req.params.bookId
        if(!bookId) return res.status(400).send({status: false, msg: "bookId required in params"})
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ status: false, message: "not a valid bookId" })}

       let allBooks = await BooksModel.findById({ $and : [{bookId}, {isDeleted: false}]}).lean()
       if(!allBooks.length) return res.status(404).send({status: false, msg: "No Books found"})
       let reviewData = await ReviewModel.findById(bookId)
       allBooks["reviewsData"] = [reviewData ]
       res.status(200).send({status: true, data: allBooks})
    }
    catch(err){
        res.status(500).send({status: "error", error:err.message})
    }
}

//======================= get All Books Api====================================

const getBookDetails = async function (req, res) {
    try {
        let Data = req.query

        if(Data.userId){
            if (!forUserid.test(Data.userId )) {
              return res.status(400).send({ status: false, msg: "!!Oops userId is not valid" });}
            }
        
        let allBooks = await BooksModel.find({ $and: [Data, { isDeleted: false }] 
        }).sort({ title: 1 }).select("title excerpt userId category subcategory releasedAt reviews")
        if (!allBooks.length) {
            return res.status(404).send({ status: false, msg: "Book not found" })
        }
        return res.status(200).send({ status: true, message: 'Books list', data: allBooks })


    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }

}
//========================================== BooksDeleteById ===================================================//

const BooksDeleteById = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!bookId) return res.status(400).send({ status: false, msg: "bookId required in params" })
        if (!(/^[a-f\d]{24}$/i).test(bookId)) { return res.status(400).send({ status: false, message: "Please enter Correct bookId." }) }
        
        let check1 = await BooksModel.findById(bookId)
        if (typeof check1.isDeleted) {
        console.log(check1.isDeleted)

                return res.status(404).send({ status: false, msg: "book doesn't exist" })
            }

        let result= await BooksModel.updateOne((check1) ,{ $set: { isDeleted: true, deletedAt: Date.now() } })
        res.status(200).send({ status: true, msg: "Document deleted Successfully" });

         
    }
    catch (err) {
        res.status(500).send({ msg: err.message });
    }
}


module.exports={createBooks,getBookDetails,getBooksById,BooksDeleteById}