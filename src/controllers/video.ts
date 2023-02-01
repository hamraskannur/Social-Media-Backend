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
    const AllPosts = await videoSchema
      .find()
      .populate("userId", { username: 1, name: 1, _id: 1, ProfileImg: 1 });
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

    const comments = await videoCommentSchema
      .find({ postId: new mongoose.Types.ObjectId(postId) })
      .populate("userId", { username: 1, name: 1, _id: 1, ProfileImg: 1 })
      .populate("replayComment.userId", {
        username: 1,
        name: 1,
        _id: 1,
        ProfileImg: 1,
      });

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

    const newComment = await videoCommentSchema.populate(postComment, {
      path: "userId",
    });

    res.json({
      message: "commented posted successfully",
      success: true,
      comment: newComment,
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
      const index = await comment?.replayComment?.push({
        userId,
        comment: newComment,
        likes: [],
      });
      await await comment.save();
    }
    const addNewComment = await videoCommentSchema
      .findById(comment)
      .populate("replayComment.userId");

    res.json({
      message: "liked comment",
      comments: addNewComment?.replayComment,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const likeShortsReplayComment = async (req: Request, res: Response) => {
  const { secondCommentId, userId, commentId, like } = req.body;
  console.log(secondCommentId, userId, commentId, like);

  try {
    if (!like) {
      await videoCommentSchema.updateOne(
        {
          _id: new mongoose.Types.ObjectId(commentId),
          "replayComment._id": new mongoose.Types.ObjectId(secondCommentId),
        },
        { $set: { "replayComment.$.likes": [userId] } }
      );
      res.status(200).json({ message: "liked comment", success: true });
    } else {
      await videoCommentSchema.updateOne(
        {
          _id: new mongoose.Types.ObjectId(commentId),
          "replayComment._id": new mongoose.Types.ObjectId(secondCommentId),
        },
        { $unset: { "replayComment.$.likes": [userId] } }
      );
      res.status(200).json({ message: "unLiked comment", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};

