"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const video_1 = require("../controllers/video");
const router = (0, express_1.Router)();
const authMiddleware = require("../middleware/authMiddleware");
router.post("/uploadVideo", authMiddleware, video_1.uploadVideo);
module.exports = router;
