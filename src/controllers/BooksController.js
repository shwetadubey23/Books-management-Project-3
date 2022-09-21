const BooksModel = require('../models/BooksModel');
const userModel = require('../models/userModel');
// const UserModel = require('../models/UserModel');


let checkValid = function (value) {
    if (typeof value == "undefined" || typeof value == "number" || typeof value == null) { return false }
    if (typeof value == "string" && value.trim().length == 0) { return false }
    return true
}

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






        let checkTitle = await BooksModel.findOne({ title: title })

        

        if (!checkTitle) {
            let createBooks = await BooksModel.create(data);
            return res.status(201).send({ status: true, message: 'Success', data: createBooks });
        }

        if (title === checkTitle.title) {
            return res.status(400).send({ status: false, message: "title already exist, please give another one" });
        }

        //---

        // let checkIsbn = await BooksModel.findOne({ ISBN: ISBN })

        // if (!checkIsbn) {
        //     let createBooks = await BooksModel.create(data);
        //     return res.status(201).send({ status: true, message: 'Success', data: createBooks });
        // }

        // if (ISBN === checkIsbn.ISBN) {
        //     return res.status(400).send({ status: false, message: "ISBN already exist, please give another one" });
        // }


    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}

module.exports.createBooks = createBooks