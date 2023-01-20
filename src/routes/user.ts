/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Router } from "express";
import {
  postSignup,
  verify,
  userLogin,
  googleLogin,
  addPost,
  getMyPost,
  getUserData,
  getAllPosts,
  getOnePost,
  getFriendsAccount,
  likePostReq,
  getComment,
  getUserAllPost,
  postComment,
  updateUserData,
  followUser,
  getAllRequest,
  acceptRequest,
  deleteRequests,
  createChat,
  getChat,
  chatFind,
  addMessage,
  getMessages,
} from "../controllers/user";
const router: Router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", postSignup);

router.get("/verifySignUp/:id/:token", verify);

router.post("/login", userLogin);

router.post("/googleLogin", googleLogin);

router.post("/addPost", authMiddleware, addPost);

router.get("/getMyPost", authMiddleware, getMyPost);

router.get("/getMyProfile", authMiddleware, getUserData);

router.get("/getAllPosts", authMiddleware, getAllPosts);

router.get("/getOnePost/:userId/:PostId", authMiddleware, getOnePost);

router.get("/getFriendsAccount/:userId", authMiddleware, getFriendsAccount);

router.get("/likePostReq/:postId", authMiddleware, likePostReq);

router.post("/postComment/:postId", authMiddleware, postComment);

router.get("/getComment/:postId", authMiddleware, getComment);

router.get("/getUserData", authMiddleware, getUserData);

router.get("/getUserAllPost/:userId", authMiddleware, getUserAllPost);

router.put("/updateUserData", authMiddleware, updateUserData);

router.put("/followUser", authMiddleware, followUser);

router.get("/getAllRequest", authMiddleware, getAllRequest);

router.put("/acceptRequest", authMiddleware, acceptRequest);

router.delete("/deleteRequests/:deleteId", authMiddleware, deleteRequests);

router.post("/createChat", authMiddleware, createChat);

router.get("/chat/:userId", authMiddleware, getChat);

router.get("/chatFind/:firstId/:secondId", authMiddleware, chatFind);

router.post("/addMessage", authMiddleware, addMessage);

router.get("/getMessages/:chatId", authMiddleware, getMessages);

module.exports = router;
