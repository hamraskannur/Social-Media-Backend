"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_1 = require("../controllers/post");
const authMiddleware = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post("/addPost", authMiddleware, post_1.addPost);
router.get("/getAllPosts", authMiddleware, post_1.getAllPosts);
router.get("/getOnePost/:userId/:PostId", authMiddleware, post_1.getOnePost);
router.get("/likePostReq/:postId", authMiddleware, post_1.likePostReq);
router.post("/postComment/:postId", authMiddleware, post_1.postComment);
router.get("/getComment/:postId", authMiddleware, post_1.getComment);
router.get("/getUserAllPost/:userId", authMiddleware, post_1.getUserAllPost);
router.post("/likeMainComment", authMiddleware, post_1.likeMainComment);
router.post('/postReplayComment', authMiddleware, post_1.postReplayComment);
router.get('/getReplayComment/:commentId', authMiddleware, post_1.getReplayComment);
router.post('/likeReplayComment', authMiddleware, post_1.likeReplayComment);
router.put('/savePost', authMiddleware, post_1.savePost);
router.get('/getSavedPost/:userId', authMiddleware, post_1.getSavedPost);
router.delete('/deletePost/:postId', authMiddleware, post_1.deletePost);
router.put('/editPost', authMiddleware, post_1.editPost);
router.put('/reportPost', authMiddleware, post_1.reportPost);
module.exports = router;
