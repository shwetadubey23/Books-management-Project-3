const mongoose = require("mongoose")
const objectId = new mongoose.Schema.Types.objectId

let ReviewModel = new mongoose.Schema({
    bookId: {type:ObjectId,required:true, ref:BookModel},
  reviewedBy: {type:string, required:true, default: 'Guest', value: reviewer's name},
  reviewedAt: {Date, mandatory},
  rating: {number, min 1, max 5, mandatory},
  review: {string, optional}
  isDeleted: {boolean, default: false},
}
})