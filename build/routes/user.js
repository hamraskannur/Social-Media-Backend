"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../controllers/user"));
const router = express_1.default.Router();
const authMiddleware = require('../middleware/authMiddleware');
router.post('/register', user_1.default.postSignup);
router.get('/verifySignUp/:id/:token', user_1.default.verify);
router.post('/login', user_1.default.userLogin);
router.post('/googleLogin', user_1.default.googleLogin);
router.post('/addPost', authMiddleware, user_1.default.addPost);
router.get('/getMyPost', authMiddleware, user_1.default.getMyPost);
router.get('/getMyProfile', authMiddleware, user_1.default.getUserData);
router.get('/getAllPosts', authMiddleware, user_1.default.getAllPosts);
router.get('/getOnePost/:userId/:PostId', authMiddleware, user_1.default.getOnePost);
router.get('/getFriendsAccount/:userId', authMiddleware, user_1.default.getFriendsAccount);
router.get('/likePostReq/:postId', authMiddleware, user_1.default.likePostReq);
router.post('/postComment/:postId', authMiddleware, user_1.default.postComment);
router.get('/getComment/:postId', authMiddleware, user_1.default.getComment);
router.get('/getUserData', authMiddleware, user_1.default.getUserData);
router.get('/getUserAllPost/:userId', authMiddleware, user_1.default.getUserAllPost);
module.exports = router;
