/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adminLogin,getAllUser,changeStatus,getAllReportPost,blockPost } from '../controllers/admin'
import { getFriendsAccount } from "../controllers/user";
import { getUserAllPost, getComment, getReplayComment, getOnePost } from "../controllers/post";

const router = Router() 
const authMiddleware = require('../middleware/authMiddleware')

router.post('/login', adminLogin)

router.get('/getAllUser' , getAllUser)

router.get('/changeStatus/:Status/:userId', changeStatus)

router.get('/getAllReportPost',getAllReportPost)

router.put('/blockPost/',blockPost)

router.get("/getFriendsAccount/:userId", authMiddleware, getFriendsAccount);

router.get("/getUserAllPost/:userId", authMiddleware, getUserAllPost);

router.get("/getComment/:postId", authMiddleware, getComment);

router.get('/getReplayComment/:commentId',authMiddleware,getReplayComment)

router.get('/getOnePost/:postId',authMiddleware, getOnePost);

module.exports = router