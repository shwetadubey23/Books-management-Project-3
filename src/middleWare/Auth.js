
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')
const bookModel = require("../models/BooksModel");
const userModel= require("../models/UserModel")


// ============================================ AUTHENTICATION ==============================================//

const authentication = (req, res, next) => {
    try {
        let token = req.headers["x-api-key"];
        if (!token)
            return res.status(400).send({ status: false, msg: "token is required" });
        jwt.verify(token, "Book management secret key", function (error, decoded) {
            if (error) {
                return res.status(401).send({ status: false, msg: "Authentication failed Or Token Expired..!" });
            } else {
                req.token = decoded;
                
                next();
            }
        });
    } catch (error) {
        res.status(500).send({ status: false, err: error.message });
    }
};


// ============================================AUTHORISATION==================================================//


    const authorisation =async  function (req, res, next) {

    try {
        let decodedtoken=req.token
        let userId = req.body.userId;
     if (!mongoose.Types.ObjectId.isValid(userId)) 
     { return res.status(400).send({ status: false, msg: "Enter valid user Id"}); }  
      let user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ status: false, msg: "No such user exist" });
    }   
        if (decodedtoken.userId != userId) {
            return res.status(403).send({ status: false, msg: "Not Authorised" })
        }

        next()
    }
    catch (error) {
        return res.status(500).send({ status: false, msg: error.message })

    }

}

// ================================== AUTHORISATIONnBOOKID =============================================
    
const authorisationbyBId = async function(req,res,next){
    try {
        let bookId = req.params.bookId
        let decodedtoken=req.token
        if(!mongoose.Types.ObjectId.isValid(bookId)){
           return res.status(400).send({status: false, message: 'Invalid book id'}); }

        let bookData = await bookModel.findById(bookId)
        if(!bookData)
            return res.status(404).send({status: false, message: 'No Book exists with that id '});
            if(bookData.isDeleted == true)
            return res.status(404).send({status: false, message: 'Book is already Deleted'});

        if((decodedtoken.userId !== bookData.userId))
        { return res.status(403).send({status : false, message : "You are not a authorized user"}) };
          next();
        
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })

    }
 }

// =======================================================================================================//
module.exports={authentication,authorisation,authorisationbyBId}











