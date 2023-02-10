/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { adminLogin,getAllUser,changeStatus,getAllReportPost,blockPost, getAllNotifications, checkNewNotification } from '../controllers/admin'
import { getFriendsAccount, getFollowingUser, getFollowersUser } from "../controllers/user";
import { getUserAllPost, getComment, getReplayComment, getOnePost,getUserAllShorts,getAllPosts } from "../controllers/post";
import { getAllVideo} from "../controllers/video";
import { Request, Response, NextFunction } from "express";

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

router.get('/getUserAllShorts/:userId',authMiddleware,getUserAllShorts)

router.get('/getFollowingUser/:userId' , authMiddleware,getFollowingUser)

router.get('/getFollowersUser/:userId' , authMiddleware,getFollowersUser)

router.get('/getAllNotifications' , authMiddleware,getAllNotifications)

router.get('/checkNewNotification',authMiddleware,checkNewNotification)

router.get('/getAllPost',authMiddleware,getAllPosts)

router.get('/getAllVideo',authMiddleware,getAllVideo)


router.use(function (req, res, next) {
    next(createError(404));
  });
  
  router.use(function (err:object, req:Request, res:Response, next:NextFunction) {
    res.status(500).json(err);
  });
  
  function createError(arg0: number): any {
    throw new Error("Function not implemented.");
  }
  
module.exports = router


