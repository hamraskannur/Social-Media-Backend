import express from 'express'
import { addPost, getAllPosts, getOnePost, likePostReq, postComment, getComment, getUserAllPost, likeMainComment,
     postReplayComment, getReplayComment, likeReplayComment, savePost, getSavedPost, deletePost, editPost, reportPost} from '../controllers/post'
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router()

router.post("/addPost", authMiddleware, addPost);

router.get("/getAllPosts", authMiddleware, getAllPosts);

router.get("/getOnePost/:userId/:PostId", authMiddleware, getOnePost);

router.get("/likePostReq/:postId", authMiddleware, likePostReq);

router.post("/postComment/:postId", authMiddleware, postComment);

router.get("/getComment/:postId", authMiddleware, getComment);

router.get("/getUserAllPost/:userId", authMiddleware, getUserAllPost);

router.post("/likeMainComment", authMiddleware,likeMainComment)

router.post('/postReplayComment',authMiddleware,postReplayComment)

router.get('/getReplayComment/:commentId',authMiddleware,getReplayComment)

router.post('/likeReplayComment',authMiddleware,likeReplayComment)

router.put('/savePost',authMiddleware,savePost)

router.get('/getSavedPost/:userId',authMiddleware,getSavedPost)

router.delete('/deletePost/:postId',authMiddleware,deletePost)

router.put('/editPost',authMiddleware,editPost)

router.put('/reportPost',authMiddleware,reportPost)

module.exports = router;
