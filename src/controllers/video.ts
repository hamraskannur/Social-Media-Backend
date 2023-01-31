import { NextFunction, Request, Response } from "express";
import videoSchema from "../models/videoSchema";
import videoCommentSchema from "../models/videoCommentSchema";
import mongoose from "mongoose";

export const uploadVideo = async (req: Request, res: Response) => {
  try {
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

export const getAllVideo = async (req: Request, res: Response) => {
  try {
    const AllPosts = await videoSchema.find().populate("userId");
    res.status(201).json({ AllPosts });
  } catch (error) {
    console.log(error);
  }
};

export const likeShortReq = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const postId = req.params.postId;
    const short = await videoSchema.findById(postId);

    if (!short) {
      return res.json({ Message: "post not fount", success: false });
    }
    if (!short.likes.includes(userId)) {
      await short.updateOne({ $push: { likes: userId } });
      return res.json({ Message: "post liked successfully", success: true });
    } else {
      await short.updateOne({ $pull: { likes: userId } });
      return res.json({ Message: "post liked successfully", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};

export const deleteShort = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  try {
    const response = await videoSchema.findByIdAndDelete({ _id: postId });
    res.status(200).json({ success: true, message: "deleted post" });
  } catch (error) {
    console.log(error);
  }
};

export const getShortComment = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    console.log(postId);
    const comments = await videoCommentSchema.find({postId:new mongoose.Types.ObjectId(postId)}).populate('userId').populate('replayComment.userId')
   console.log(comments);
   
    // const comments = await videoCommentSchema.aggregate([
    //   {
    //     $match: {
    //       postId: new mongoose.Types.ObjectId(postId),
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: "users",
    //       localField: "userId",
    //       foreignField: "_id",
    //       as: "author",
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: "$author",
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       userId: 1,
    //       postId: 1,
    //       comment: 1,
    //       likes: 1,
    //       replayComment:1,
    //       createdAt: 1,
    //       "author.username": 1,
    //       "author.ProfileImg": 1,
    //     },
    //   },
    //   {
    //     $replaceRoot: {
    //       newRoot: {
    //         $mergeObjects: ["$$ROOT", "$author"],
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       author: 0,
    //     },
    //   },
    //   {
    //     $sort: {
    //       createdAt: -1,
    //     },
    //   },
    // ]);

    return res.json({
      message: "comments fetched successfully",
      comments: comments,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const postShortsComment = async (req: Request, res: Response) => {
  const comment = req.body.comment;
  const userId = req.body.userId;
  const postId = req.params.postId;
  try {
    const post = await videoSchema.findById(postId);
    if (!post) {
      return res.json({ message: "post not found", success: false });
    }
    const postComment = new videoCommentSchema({
      userId,
      postId,
      comment,
    });
    await postComment.save();

    await videoCommentSchema.populate(postComment, {
      path: "userId",
      select: { username: 1 },
    });

    res.json({
      message: "commented posted successfully",
      success: true,
      comment: postComment,
    });
  } catch (error) {
    console.log(error);
  }
};

export const likeShortsMainComment = async (req: Request, res: Response) => {
  const { userId, commentId } = req.body;

  try {
    const comment = await videoCommentSchema.findById(commentId);

    if (!comment) res.json({ message: "no comment", success: false });

    if (comment) {
      if (comment?.likes?.includes(userId)) {
        await comment.updateOne({ $pull: { likes: userId } });
        res.json({ message: "unLiked comment", success: true });
      } else {
        await comment.updateOne({ $push: { likes: userId } });
        res.json({ message: "liked comment", success: true });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const shortsReplayComment = async (req: Request, res: Response) => {
  const { userId, commentId, newComment } = req.body;
  try {
    const comment = await videoCommentSchema.findOne({
      _id: new mongoose.Types.ObjectId(commentId),
    });
    if (comment) {
      comment?.replayComment?.push({
          userId,
          comment: newComment,
          likes: []
      });
      comment.save();
    }
    res.json({
      message: "liked comment",
      comments: newComment,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
