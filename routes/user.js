const express = require("express")
const { userById, allUsers, getUser, updateUser, deleteUser } = require("../controllers/user")
const { requireSingin } = require("../controllers/auth")

const router = express.Router()

router.get("/users", allUsers)
router.get("/user/:userId", requireSingin, getUser)
router.put("/user/:userId", requireSingin, updateUser)
router.delete("/user/:userId", requireSingin, deleteUser)

router.param("userId", userById)

module.exports = router