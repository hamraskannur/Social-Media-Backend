import { Router } from "express";
import {
  uploadVideo,
  getAllVideo,
  getUserAllShorts,
} from "../controllers/video";
import { Request, Response, NextFunction } from "express";

const router: Router = Router();

const authMiddleware = require("../middleware/authMiddleware");

router.post("/uploadVideo", authMiddleware, uploadVideo);

router.get("/getAllPosts", authMiddleware, getAllVideo);

router.get("/getUserAllShorts/:userId", authMiddleware, getUserAllShorts);


router.use(function (req, res, next) {
  next(createError(404));
});

router.use(function (err:object, req:Request, res:Response, next:NextFunction) {
  res.status(500).json(err);
});

module.exports = router;

function createError(arg0: number): any {
  throw new Error("Function not implemented.");
}
