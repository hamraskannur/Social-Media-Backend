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

router.put('/updateUserData', authMiddleware,controllers.updateUserData)

router.put('/followUser' ,authMiddleware,controllers.followUser)

router.get('/getAllRequest', authMiddleware,controllers.getAllRequest)

router.put('/acceptRequest', authMiddleware,controllers.acceptRequest)

router.delete('/deleteRequests/:deleteId', authMiddleware,controllers.deleteRequests)

router.post('/createChat', authMiddleware,controllers.createChat)

router.get('/chat/:userId', authMiddleware,controllers.getChat)

router.get('/chatFind/:firstId/:secondId', authMiddleware,controllers.chatFind)

router.post('/addMessage',authMiddleware,controllers.addMessage)

router.get('/getMessages/:chatId', authMiddleware,controllers.getMessages)

module.exports = router
