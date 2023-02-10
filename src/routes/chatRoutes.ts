import { Router } from 'express'
import { createChat, getChat, chatFind, addMessage, getMessages } from '../controllers/chat'
const router = Router()
const authMiddleware = require('../middleware/authMiddleware')
import { Request, Response, NextFunction } from "express";


router.post("/createChat", authMiddleware, createChat);

router.get("/:userId", authMiddleware, getChat);

router.get("/chatFind/:firstId/:secondId", authMiddleware, chatFind);

router.post("/addMessage", authMiddleware, addMessage);

router.get("/getMessages/:chatId", authMiddleware, getMessages);


router.use(function (req, res, next) {
    next(createError(404));
  });
  
  router.use(function (err:object, req:Request, res:Response, next:NextFunction) {
    res.status(500).json(err);
  });
  
  function createError(arg0: number): any {
    throw new Error("Function not implemented.");
  }

module.exports = router
