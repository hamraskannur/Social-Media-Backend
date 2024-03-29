/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from "express";
import {
  postSignup,verify,userLogin,googleLogin,getMyPost,getUserData,getFriendsAccount,updateUserData,followUser,
  getAllRequest,acceptRequest,deleteRequests,getFollowingUser,getFollowersUser, changeToPrivate, searchUser,
  getAllNotifications,suggestionUsers
} from "../controllers/user";
import { Request, Response, NextFunction } from "express";

const router: Router = Router();
const authMiddleware = require("../middleware/authMiddleware");


router.post("/register", postSignup);

router.get("/verifySignUp/:id/:token", verify);

router.post("/login", userLogin);

router.post("/googleLogin", googleLogin);

router.get("/getMyProfile", authMiddleware, getUserData);

router.get("/getMyPost", authMiddleware, getMyPost);

router.get("/getFriendsAccount/:userId", authMiddleware, getFriendsAccount);

router.get("/getUserData", authMiddleware, getUserData);

router.put("/updateUserData", authMiddleware, updateUserData);

router.put("/followUser", authMiddleware, followUser);

router.get("/getAllRequest", authMiddleware, getAllRequest);

router.put("/acceptRequest", authMiddleware, acceptRequest);

router.delete("/deleteRequests/:deleteId", authMiddleware, deleteRequests);

router.get('/getFollowingUser/:userId' , authMiddleware,getFollowingUser)

router.get('/getFollowersUser/:userId' , authMiddleware,getFollowersUser)

router.put('/changeToPrivate' , authMiddleware, changeToPrivate)

router.post('/searchUser',authMiddleware,searchUser)

router.get('/getAllNotifications',authMiddleware,getAllNotifications)

router.get('/suggestionUsers', authMiddleware,suggestionUsers)


// router.use(function (req, res, next) {
//   next(createError(404));
// });

// router.use(function (err:object, req:Request, res:Response, next:NextFunction) {
//   res.status(500).json(err);
// });


module.exports = router;

// function createError(arg0: number): any {
//   throw new Error("Function not implemented.");
// }