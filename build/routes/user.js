"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const router = express_1.default.Router();
const authMiddleware = require("../middleware/authMiddleware");
router.post("/register", user_1.postSignup);
router.get("/verifySignUp/:id/:token", user_1.verify);
router.post("/login", user_1.userLogin);
router.post("/googleLogin", user_1.googleLogin);
router.get("/getMyProfile", authMiddleware, user_1.getUserData);
router.get("/getMyPost", authMiddleware, user_1.getMyPost);
router.get("/getFriendsAccount/:userId", authMiddleware, user_1.getFriendsAccount);
router.get("/getUserData", authMiddleware, user_1.getUserData);
router.put("/updateUserData", authMiddleware, user_1.updateUserData);
router.put("/followUser", authMiddleware, user_1.followUser);
router.get("/getAllRequest", authMiddleware, user_1.getAllRequest);
router.put("/acceptRequest", authMiddleware, user_1.acceptRequest);
router.delete("/deleteRequests/:deleteId", authMiddleware, user_1.deleteRequests);
router.get('/getFollowingUser/:userId', authMiddleware, user_1.getFollowingUser);
router.get('/getFollowersUser/:userId', authMiddleware, user_1.getFollowersUser);
module.exports = router;
