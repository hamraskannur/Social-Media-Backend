/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from 'express'
import controllers from '../controllers/user'
const router: Router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')

router.post('/register', controllers.postSignup)

router.get('/verifySignUp/:id/:token', controllers.verify)

router.post('/login', controllers.userLogin)

router.post('/googleLogin' ,controllers.googleLogin)

router.post('/addPost', authMiddleware,controllers.addPost )

router.get('/getMyPost', authMiddleware,controllers.getMyPost)

router.get('/getMyProfile', authMiddleware,controllers.getUserData)

router.get('/getAllPosts', authMiddleware,controllers.getAllPosts)

router.get('/getOnePost/:userId/:PostId', authMiddleware,controllers.getOnePost)

router.get('/getFriendsAccount/:userId',authMiddleware,controllers.getFriendsAccount)

router.get('/likePostReq/:postId', authMiddleware,controllers.likePostReq)

router.post('/postComment/:postId', authMiddleware,controllers.postComment)

router.get('/getComment/:postId', authMiddleware,controllers.getComment)

router.get('/getUserData' ,authMiddleware,controllers.getUserData)

router.get('/getUserAllPost/:userId', authMiddleware,controllers.getUserAllPost)

module.exports = router
