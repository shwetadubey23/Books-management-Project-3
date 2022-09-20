const express = require("express")
const router = express.Router()
const UserControler = require('../controllers/UserController')

router.post('/register',UserControler.createUser)


module.exports = router