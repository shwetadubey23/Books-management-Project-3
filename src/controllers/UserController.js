const userModel = require('../models/userModel');







const createUser = async function(req, res) {
    try {
        let data = req.body

    } catch (error) {
        res.status(500).send({status:false , msg: error.message});
    }
}
