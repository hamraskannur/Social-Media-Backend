import { NextFunction, Request, Response } from "express";
import postCollection from "../models/photoSchema";
import mongoose from "mongoose";

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const { imageLinks, description, userId } = req.body;
    const post = await new postCollection({
      userId,
      shorts: imageLinks,
      description,
    }).save();

    res.status(201).json({ status: true });
  } catch (error) {
    console.log(error);
  }
};

export const getAllVideo = async (req: Request, res: Response) => {
  try {
    const AllPosts = await postCollection
      .find({shorts:{$exists:true}})
      .populate("userId", { username: 1, name: 1, _id: 1, ProfileImg: 1,public:1,Followers:1 });
      console.log(AllPosts);
      
    res.status(201).json({ AllPosts });
  } catch (error) {
    console.log(error);
  }
};


export const getUserAllShorts = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const AllPosts = await postCollection
      .find({ userId: userId ,shorts:{$exists:true }})
      .populate("userId");
      
    res.json({
      message: "AllPosts fetched successfully",
      AllPosts: AllPosts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};