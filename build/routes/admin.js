"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const admin_1 = require("../controllers/admin");
const user_1 = require("../controllers/user");
const post_1 = require("../controllers/post");
const router = express_1.default.Router();
const authMiddleware = require('../middleware/authMiddleware');
router.post('/login', admin_1.adminLogin);
router.get('/getAllUser', admin_1.getAllUser);
router.get('/changeStatus/:Status/:userId', admin_1.changeStatus);
router.get('/getAllReportPost', admin_1.getAllReportPost);
router.put('/blockPost/', admin_1.blockPost);
router.get("/getFriendsAccount/:userId", authMiddleware, user_1.getFriendsAccount);
router.get("/getUserAllPost/:userId", authMiddleware, post_1.getUserAllPost);
router.get("/getComment/:postId", authMiddleware, post_1.getComment);
router.get('/getReplayComment/:commentId', authMiddleware, post_1.getReplayComment);
module.exports = router;
