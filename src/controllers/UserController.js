const userModel = require('../models/UserModel');
const jwt = require("jsonwebtoken")
const moment = require('moment')


const createUser = async function  (req, res) {
    try {
        let data = req.body
        let { title, name, email, phone, password } = data

            // checking all the required fields are present or not(sending error msg according to that)
        if (!title) return res.status(400).send({ status: false, msg: "title is mandatory" })
        if  ((title !== "Mr" && title !== "Mrs" && title !== "Miss")) return res.status(400).send({ status: false, msg: "give title only ['Mr'/ 'Mrs'/'Miss']" });

        if (!name) return res.status(400).send({ status: false, msg: "name is mandatory" })
        if (!email) return res.status(400).send({ status: false, msg: "email is mandatory" })
        if (!phone) return res.status(400).send({ status: false, msg: "mobile is mandatory " })
        if (!password) return res.status(400).send({ status: false, msg: "Password is required" });

        //validating fields with REGEX formats
        let nameValidation = (/^[a-zA-Z]+([\s][a-zA-Z]+)*$/.test(name));
        const validateEmail = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email));
        const validatePassword = (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(password))
        const validatePhone = ((/^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone)))

        if (typeof name !== "string"|| !nameValidation) 
        return res.status(400).send({ status: false, msg: "please enter a valid name" })
        if (!validatePhone) return res.status(400).send({ status: false, msg: "Please enter valid Phone Number" })
        if (!validateEmail) return res.status(400).send({ status: false, msg: "Email is invalid, Please check your Email address" });
        if (!validatePassword) return res.status(400).send({ status: false, msg: "use a strong password at least =>  one special, one Uppercase, one lowercase (character) one numericValue and password must be eight characters or longer)"});

        //PhoneNumber and emailId should be unique
        let findnumber = await userModel.find({ phone: phone })
        let findemail = await userModel.find({ email: email })
        if (findnumber.length > 0) return res.status(400).send({ status: false, msg: "mobile no. is already exist" })
        if (findemail.length > 0) return res.status(400).send({ status: false, msg: "email id is already exist" })

            let saveData = await userModel.create(data)
            res.status(201).send({  status: true, msg: saveData  })
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
}

//====================================LOGIN======================================================//


const login = async function (req, res) {
    try{
    let email = req.body.email;
    let password = req.body.password;
    if (!email)
        return res.status(400).send({ status: false, msg: "Please Input Email" });

    if (!password)
        return res.status(400).send({ status: false, msg: "Please Input Password" });

    let userData = await userModel.findOne({ email: email, password: password });

    if (!userData)
       return res.status(404).send({ status: false, msg: "No User Found With These Credentials" });

        let exp= "5h"
   let token = jwt.sign({ userId: userData._id }, "Book management secret key",{expiresIn: exp})
    
    res.setHeader("x-api-key", token);
    let dataT = {token,userId: userData._id, iat: moment(),exp:exp}
    return res.status(201).send({ status: true, msg: "login successfull",  data: dataT })
} catch (error) {
    res.status(500).send({ status: false, msg: error.message });
}
}

module.exports = { createUser, login }