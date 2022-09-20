const express = require("express")
const router = express.Router()

const { createIntern } = require("../controllers/BooksController")
const { createCollege, functionupInterns } = require("../controllers/UserController")



router.post("/functionup/colleges", createCollege)
router.post("/functionup/interns", createIntern)
router.get("/functionup/collegeDetails", functionupInterns)



module.exports = router