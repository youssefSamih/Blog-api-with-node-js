const express = require('express')
const {getPosts, createPost, postsByUser, postById, isPoster, deletePost, updatePost, photo} = require('../controllers/post')
const { requireSingin } = require("../controllers/auth")
const {createPostValidator} = require('../validator')
const { userById } = require('../controllers/user')

const router = express.Router()

router.get('/posts', getPosts)
router.post('/post/new/:userId', requireSingin, createPost, createPostValidator)
router.delete('/post/:postId', requireSingin, isPoster, deletePost)
router.put('/post/:postId', requireSingin, isPoster, updatePost)
router.get("/user/photo/:postId", photo)
router.get("/posts/by/:userId", postsByUser)
router.param("postId", postById)
router.param("userId", userById)
module.exports = router