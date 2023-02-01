import { Router } from "express";
import { uploadVideo, getAllVideo, likeShortReq, likeShortsReplayComment, deleteShort, shortsReplayComment, getShortComment, postShortsComment, likeShortsMainComment } from "../controllers/video";
const router: Router = Router();

const authMiddleware = require("../middleware/authMiddleware");

router.post("/uploadVideo", authMiddleware,uploadVideo );

router.get("/getAllPosts", authMiddleware, getAllVideo);

router.get("/likeShortReq/:postId", authMiddleware, likeShortReq);

router.delete('/deleteShort/:postId',authMiddleware,deleteShort)

router.get("/getShortComment/:postId", authMiddleware, getShortComment);

router.post("/postShortsComment/:postId", authMiddleware, postShortsComment);

router.post("/likeShortsMainComment", authMiddleware,likeShortsMainComment)

router.post('/shortsReplayComment',authMiddleware,shortsReplayComment)

router.post('/likeShortsReplayComment',authMiddleware,likeShortsReplayComment)

module.exports = router;