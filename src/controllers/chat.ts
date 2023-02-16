import { NextFunction, Request, Response } from "express";
import chatCollection from "../models/chatSchema";
import messageCollection from "../models/messageSchema";

export const createChat = async (req: Request, res: Response,next: NextFunction) => {
    try {
      const chat = await chatCollection.findOne({
        members:  [req.body.senderId, req.body.receiverId] ,
      });
           
      if (!chat) {
        const newChat = new chatCollection({
          members: [req.body.senderId, req.body.receiverId],
        });
  
        const result = await newChat.save();
        return res.status(200).json(result);
      }
      res.status(200).json("ok");
    } catch (error) {
      next(error)
    }
  };

  export const getChat = async (req: Request, res: Response,next: NextFunction) => {
    try {
      const chat = await chatCollection.find({
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(chat);
    } catch (error) {
      next(error)
    }
  };

  
export const chatFind = async (req: Request, res: Response,next: NextFunction) => {
    try {
      const chat = await chatCollection.findOne({
        members: { $all: [req.params.firstId, req.params.secondId] },
      });
      res.status(200).json(chat);
    } catch (error) {
      next(error)
    }
  };

  export const addMessage = async (req: Request, res: Response,next: NextFunction) => {
    const { chatId, senderId, text } = req.body;
  
    const message = new messageCollection({
      chatId,
      senderId,
      text,
    });
  
    try {
      const result = await message.save();
      res.status(200).json(result);
    } catch (error) {
      next(error)
    }
  };


  
export const getMessages = async (req: Request, res: Response,next: NextFunction) => {
    const { chatId } = req.params;
    try {
      const result = await messageCollection.find({ chatId });
  
      res.status(200).json(result);
    } catch (error) {
      next(error)
    }
  };
  