const express = require("express")
const app = express()
const multer= require("multer");
const {AppConfig} = require('aws-sdk');
const route = require("./routes/route.js")
const mongoose = require("mongoose")


app.use(multer().any())

app.use(express.json())

mongoose.connect("mongodb+srv://Shwetadubey:QvtqJ8hdhmn0fhlT@cluster0.ymyddly.mongodb.net/Project-3", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )


app.use("/",route)

app.listen(3000, function () {
    console.log('Express app running on port ' +  3000)
});

