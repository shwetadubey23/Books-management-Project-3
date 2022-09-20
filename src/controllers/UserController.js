const userModel = require('../models/userModel');




const createUser = async function(req, res) {
    try {
        let data = req.body
       let  { title, name, email, phone, password} = data

    // checking all the required fields are present or not(sending error msg according to that)
        if (!title) return res.status(400).send({ status: false, msg: "title is mandatory" })
        if(title != ("Mr"|| "Mrs"|| "Miss")) return res.status(400).send({ status: false, msg: "give title only ['Mr'/ 'Mrs'/'Miss']" });

        if (!name) return res.status(400).send({ status: false, msg: "name is mandatory" })
        if (!email) return res.status(400).send({ status: false, msg: "email is mandatory" })
        if (!phone) return res.status(400).send({ status: false, msg: "mobile is mandatory " })
        if (!password) return res.status(400).send({ status: false, msg: "Password is required" });

    //validating fields with REGEX formats
    const validateEmail = (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email));
    const validatePassword = (/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/.test(password))
    const validatePhone =   ((/^(\+\d{1,3}[- ]?)?\d{10}$/.test(phone)))

    if(!validatePhone) return res.status(400).send({status: false, msg: "Please enter valid Phone Number"})
    if (!validateEmail) return res.status(400).send({ status: false, msg: "Email is invalid, Please check your Email address" });
    if (!validatePassword) return res.status(400).send({ status: false, msg: "use a strong password at least =>  one special, one Uppercase, one lowercase (character) one numericValue and password must be eight characters or longer)" });
   
    //PhoneNumber and emailId should be unique
    let findnumber = await userModel.find({ phone: phone })
    let findemail = await userModel.find({ email: email })
    if (findnumber.length > 0) return res.status(400).send({ status: false, msg: "mobile no. is already exist" })
    if (findemail.length > 0) return res.status(400).send({ status: false, msg: "email id is already exist" })

    let saveData = await userModel.create(data)
    res.status(200).send({status: true, msg: saveData})
    } catch (error) {
        res.status(500).send({status:false , msg: error.message});
    }
}


module.exports.createUser = createUser