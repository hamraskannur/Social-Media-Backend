"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chat_1 = require("../controllers/chat");
const router = express_1.default.Router();
const authMiddleware = require('../middleware/authMiddleware');
router.post("/createChat", authMiddleware, chat_1.createChat);
router.get("/:userId", authMiddleware, chat_1.getChat);
router.get("/chatFind/:firstId/:secondId", authMiddleware, chat_1.chatFind);
router.post("/addMessage", authMiddleware, chat_1.addMessage);
router.get("/getMessages/:chatId", authMiddleware, chat_1.getMessages);
module.exports = router;
