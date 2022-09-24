const createReview = async function (req, res) {
    try {
      const reviewData = req.body;
      const bookId = req.params.bookId;
      if (!valid.isValidRequestBody(reviewData)) {
        return res.status(400).send({ status: false, msg: "plz provide data" });
      }
      const { rating, reviewedBy } = reviewData;
      if (!valid.isValidObjectId(bookId)) {
        return res
          .status(400)
          .send({ status: false, msg: " valid book id is required" });
      }
      
      let present = await bookModel.findById(bookId)
      if (!present) { return res.status(404).send({ status: false, msg: "Book not Available" }); }
      if (present.isDeleted === true) { return res.status(404).send({ status: false, msg: "Book is deleted" }); }
      if (!rating)
        return res
          .status(400)
          .send({ status: false, message: "rating Is Mandatory" });
      if (!(rating >= 1 && rating <= 5)) {
        return res
          .status(400)
          .send({ status: false, msg: "Rating should be inbetween 1-5 " });
      }
      
      if (!reviewedBy) {
        reviewData.reviewedBy = "Guest";
  
      } else {
        if (!valid.isValidName(reviewedBy)) {
          return res.status(404).send({ status: false, message: "provide name" });
        }
      }
  
     const book = await bookModel.findOneAndUpdate(
        { bookId: bookId, isDeleted: false },
        { $inc: { reviews: 1 } }
      );
  
      reviewData.bookId = bookId;
      
      reviewData.reviewedAt = moment();
      const createdReview = await reviewModel.create(reviewData);
  
      const data= await reviewModel.findOne(reviewData).populate("bookId").select({updatedAt:0,createdAt:0,__v:0})
      res.status(201)
        .send({ status: true, message: "success", data: data  });
    } catch (error) {
      res.status(500).send({ status: false, err: error.message });
    }
  };