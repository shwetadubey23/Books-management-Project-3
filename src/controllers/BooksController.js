const BooksModel = require('../models/BooksModel')
const userModel = require('../models/userModel');
const mongoose = require('mongoose')
const ReviewModel = require('../models/ReviewModel')
const ReviewController = require('../controllers/ReviewController')



//=======================CreateBooks==============================================

const createBooks = async function (req, res) {

    try {
        let data = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = data
        if (Object.keys(data).length == 0) { return res.status(400).send({ status:false, msg:"Provide some data"}) }
        
        if (!(title))
            return res.status(400).send({ status: false, message: "Please enter title" });

        if (!(excerpt))
            return res.status(400).send({ status: false, message: "Please enter valid excerpt" });

        if (!(ISBN))
            return res.status(400).send({ status: false, message: "Please enter valid ISBN" });

        if (!(category))
            return res.status(400).send({ status: false, message: "Please enter valid category" });

        if (!(subcategory))
            return res.status(400).send({ status: false, message: "Please enter valid subcategory" });

        if (!mongoose.Types.ObjectId.isValid(userId)) { return res.status(400).send({ status: false, message: "Please enter Correct userId." }) }
        let userData = await userModel.findById(userId);
        if (!userData) return res.status(404).send({ status: false, msg: "UserID not found." });

        let checkUnique = await BooksModel.findOne({ $or: [{ title: title }, { ISBN: ISBN }] })

        if (checkUnique) {
            if (title === checkUnique.title) {
                return res.status(400).send({ status: false, message: "title already exist, please give another one" });
            }
            else {
                return res.status(400).send({ status: false, message: "isbn already exist, please give another one" });
            }}
       
        let createBooks = await BooksModel.create(data);
        return res.status(201).send({ status: true, message: 'Success', data: createBooks });

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}
// /=================================== get All Books Api===================================================///







module.exports.createBooks = createBooks
module.exports.getBooksById = getBooksById
module.exports.BooksDeleteById = BooksDeleteById
module.exports.getBookDetails = getBookDetails