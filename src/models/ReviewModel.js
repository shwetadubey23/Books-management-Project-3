const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: ObjectId,
        ref: 'Book',
        required: true
    },

    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest',
    },

    reviewedAt: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        required: true
    },

    review :  String,

    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

module.exports = mongoose.model('Review', reviewSchema);

