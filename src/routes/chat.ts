import express from 'express'
import { createChat, getChat, chatFind, addMessage, getMessages } from '../controllers/chat'
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')


router.post("/createChat", authMiddleware, createChat);

router.get("/:userId", authMiddleware, getChat);

router.get("/chatFind/:firstId/:secondId", authMiddleware, chatFind);

router.post("/addMessage", authMiddleware, addMessage);

router.get("/getMessages/:chatId", authMiddleware, getMessages);



module.exports = router
