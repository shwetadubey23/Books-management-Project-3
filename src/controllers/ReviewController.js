const ReviewModel = require("../models/ReviewModel");
const BooksModel = require('../models/BooksModel')
const ObjectId = require('mongoose').Types.ObjectId



//=================================Review APIs____ Createing a review==========================

const createReview = async function (req, res) {
    try {
        let book_Id = req.params.bookId
        if (!ObjectId.isValid(book_Id)) return res.status(400).send({ status: false, msg: "Please give a Valid bookId " })

        let checkBookIdInDb = await BooksModel.findById(book_Id)
        if (!checkBookIdInDb) return res.status(404).send({ status: false, msg: "bookId not exist" });
        if (checkBookIdInDb.isDeleted == true) return res.status(400).send({ status: false, msg: "No Book found" })

        let reviewData = req.body
        if (Object.keys(reviewData).length == 0) return res.status(400).send({ status: false, msg: "Please give Details in body" })

        let { bookId, reviewedBy, reviewedAt, rating } = reviewData
        if (!bookId)
            return res.status(400).send({ status: false, message: "Please enter  BookId" });
        //if(!reviewedBy)
        //   return res.status(400).send({ status: false, message: "Please enter  reviewer's Name" });
        if (!reviewedAt)
            return res.status(400).send({ status: false, message: "Please enter  reviewedAt" });
        if (!rating) {
            return res.status(400).send({ status: false, message: "Please enter  rating" });
        }
        if (!(/^([1-5]|1[5])$/).test(rating)) {
            return res.status(400).send({ status: false, message: "Please give rating only 1-5 ." })
        }
        let createdReivew = await ReviewModel.create(reviewData)
        let reviewId = createdReivew._id

        await BooksModel.findOneAndUpdate({ _id: book_Id }, { $inc: { reviews: +1 } })
        let updatedBookReview = await ReviewModel.findOne({ _id: reviewId }).populate("bookId")

        return res.status(201).send({ status: true, message: 'Success', data: updatedBookReview });

    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}


//=================================Put API____Update a review============================

const updateReview = async function (req, res) {
    try {
        let book_Id = req.params.bookId
        let reviewId = req.params.reviewId
        if (!ObjectId.isValid(book_Id)) return res.status(400).send({ status: false, msg: "Please give a Valid bookId " })
        if (!ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, msg: "Please give a Valid reviewId " })

        let checkBookIdInDb = await BooksModel.findById(book_Id)
        if (!checkBookIdInDb)
            return res.status(404).send({ status: false, msg: "bookId not exist" });
        if (checkBookIdInDb.isDeleted == true)
            return res.status(400).send({ status: false, msg: "No Book found" })

        let checkRview = await ReviewModel.findById({ _id: reviewId })
        if (!checkRview)
            return res.status(404).send({ status: false, msg: "NO review found" })
        if (book_Id === checkRview.bookId)
            return res.status(400).send({ status: false, msg: "bookId not matched to reviewData" })
        if (checkRview.isDeleted == true)
            return res.status(404).send({ status: false, msg: "Review not exist" })

        let reviewDetail = req.body
        let {reviewedBy, rating, review} = reviewDetail
        if(rating){
        if (!(/^([1-5]|1[5])$/).test(rating))
        return res.status(400).send({ status: false, message: "Please give rating only 1-5 ." })
        }
        await ReviewModel.findOneAndUpdate({ _id: reviewId }, { $set: { reviewedBy: reviewDetail.reviewedBy, rating: reviewDetail.rating, review: reviewDetail.review } }, { new: true })

      
        let updateReviewInDb = await ReviewModel.findOne({ _id: reviewId }).populate("bookId")

        return res.status(201).send({ status: true, message: 'Success', data: updateReviewInDb });

    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}


//================================Delete API_____Delete a riview==================================

const deleteReview = async function (req, res) {
    try {
        let bookId = req.params.bookId
        let reviewId = req.params.reviewId
        if (!ObjectId.isValid(bookId)) return res.status(400).send({ status: false, msg: "Please give currect bookId " })
        if (!ObjectId.isValid(reviewId)) return res.status(400).send({ status: false, msg: "Please give a Valid reviewId " })

        let checkBookId = await BooksModel.findById({ _id: bookId })
        if (!checkBookId) return res.status(404).send({ status: false, msg: "NO Book found" })
        if (checkBookId.isDeleted == true) return res.status(404).send({ status: false, msg: " Book already deleted" })

        let checkRview = await ReviewModel.findById({ _id: reviewId })
        if (!checkRview) return res.status(404).send({ status: false, msg: "NO review found" })
        if (checkRview.isDeleted == true) return res.status(404).send({ status: false, msg: "Review already deleted" })

        await BooksModel.findOneAndUpdate({ _id: bookId }, { $inc: { reviews: -1 } })

        await ReviewModel.findByIdAndUpdate({ _id: reviewId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true });
        res.status(200).send({ status: true, msg: "Document deleted Successfully" });


    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message });

    }
}




module.exports.createReview = createReview
module.exports.updateReview = updateReview
module.exports.deleteReview = deleteReview