import { Router } from "express";
import {
  uploadVideo,
  getAllVideo,
  getUserAllShorts,
} from "../controllers/video";
const router: Router = Router();

const authMiddleware = require("../middleware/authMiddleware");

router.post("/uploadVideo", authMiddleware, uploadVideo);

router.get("/getAllPosts", authMiddleware, getAllVideo);

router.get("/getUserAllShorts/:userId", authMiddleware, getUserAllShorts);


module.exports = router;
