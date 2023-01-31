import { NextFunction, Request, Response } from "express";
import videoSchema from "../models/videoSchema";

export const uploadVideo = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        
      const { imageLinks, description, userId } = req.body;
      const post = await new videoSchema({
        userId,
        img: imageLinks,
        description,
      }).save();
  
      res.status(201).json({ status: true });
    } catch (error) {
      console.log(error);
    }
  };