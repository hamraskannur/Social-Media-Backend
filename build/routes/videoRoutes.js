"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const video_1 = require("../controllers/video");
const router = (0, express_1.Router)();
const authMiddleware = require("../middleware/authMiddleware");
router.post("/uploadVideo", authMiddleware, video_1.uploadVideo);
router.get("/getAllPosts", authMiddleware, video_1.getAllVideo);
router.get("/getUserAllShorts/:userId", authMiddleware, video_1.getUserAllShorts);
router.use(function (req, res, next) {
    next(createError(404));
});
router.use(function (err, req, res, next) {
    res.status(500).json(err);
});
module.exports = router;
function createError(arg0) {
    throw new Error("Function not implemented.");
}
