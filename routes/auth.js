const express = require("express")
const { signup, sigin, signout, forgotPassword, resetPassword } = require("../controllers/auth")
const { userById } = require("../controllers/user")
const { userSignupValidator } = require('../validator')

const router = express.Router()

router.post("/signup", userSignupValidator,signup)
router.post("/signin", sigin)
router.get("/signout", signout)

router.put("/forgot-password", forgotPassword)
router.put("/reset-password", resetPassword)

router.param("userId", userById)

module.exports = router