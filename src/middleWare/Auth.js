const jwt = require("jsonwebtoken");
const mongoose = require('mongoose')
const bookModel = require("../models/BooksModel");
const userModel= require("../models/UserModel")

const mongooseIdcheck = ()=>{
     return mongoose.Types.ObjectId.isValid()

}


// ============================================ AUTHENTICATION ==============================================//

const authentication = (req, res, next) => {
    try {
        let token = req.headers["secret-key"];
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
     if (!mongooseIdcheck(userId)) 
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

        if(!mongooseIdcheck(bookId)){
           return res.status(400).send({status: false, message: 'Invalid book id'}); }

        let bookData = await bookModel.findOne({_id:bookId,isDeleted:false})
        if(!bookData){
            return res.status(404).send({status: false, message: 'No Book exists with that id or Might be Deleted'});}
    
        if((decodedtoken.userId !== bookData.userId.toString()))
        { return res.status(403).send({status : false, message : "You are not a authorized user"}) };
          next();
        
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })

    }
 }

// =======================================================================================================//
module.exports={authentication,authorisation,authorisationbyBId}












let token = jwt.sign(
    {
        userId: user._id.toString(),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000)+ 10*60*60
        },
        "functionUp" 
        )
        res.header("x-api-key" , token)
        res.status(200).send({status:true , msg:"login Success" , data: token })
}
