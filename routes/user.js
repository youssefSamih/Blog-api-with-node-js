const express = require("express")
const { userById, allUsers, getUser, updateUser, deleteUser, userPhoto, addFollowing, addFollower, removeFollowing, removeFollower, findPeople } = require("../controllers/user")
const { requireSingin } = require("../controllers/auth")

const router = express.Router()

router.put('/user/follow', requireSingin, addFollowing, addFollower)
router.put('/user/unfollow', requireSingin, removeFollowing, removeFollower)
router.get("/users", allUsers)
router.get("/user/:userId", requireSingin, getUser)
router.put("/user/:userId", requireSingin, updateUser)
router.delete("/user/:userId", requireSingin, deleteUser)
router.get("/user/photo/:userId", userPhoto)
router.get('user/findpeople/:userId', requireSingin, findPeople)

router.param("userId", userById)

module.exports = router