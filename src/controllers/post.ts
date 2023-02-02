import { NextFunction, Request, response, Response } from "express";
import mongoose from "mongoose";
import postCollection from "../models/photoSchema";
import commentCollection from "../models/CommentSchema";
import ReplayComment from "../models/ReplayComment";
import UserCollection from "../models/userSchema";
import ReportSchema from "../models/ReportSchema";

export const addPost = async (req: Request, res: Response) => {
  try {
    const { imageLinks, description, userId } = req.body;
    const post = await new postCollection({
      userId,
      img: imageLinks,
      description,
    }).save();

    res.status(201).json({ status: true });
  } catch (error) {
    console.log(error);
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const AllPosts = await postCollection.find().populate("userId");
    res.status(201).json({ AllPosts });
  } catch (error) {
    console.log(error);
  }
};

export const getOnePost = async (req: Request, res: Response) => {
  const { userId, PostId } = req.params;

  const Post = await postCollection.find({ _id: PostId }).populate("userId");
  res.status(201).json({ Post });
};

export const likePostReq = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const postId = req.params.postId;
    const post = await postCollection.findById(postId);

    if (!post) {
      return res.json({ Message: "post not fount", success: false });
    }
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      return res.json({ Message: "post liked successfully", success: true });
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      return res.json({ Message: "post liked successfully", success: true });
    }
  } catch (error) {
    console.log(error);
  }
};

export const postComment = async (req: Request, res: Response) => {
  const comment = req.body.comment;
  const userId = req.body.userId;
  const postId = req.params.postId;
  try {
    const post = await postCollection.findById(postId);
    if (!post) {
      return res.json({ message: "post not found", success: false });
    }
    const postComment = new commentCollection({
      userId,
      postId,
      comment,
    });
    await postComment.save();

    await commentCollection.populate(postComment, {
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

export const getComment = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;
    const comments = await commentCollection.aggregate([
      {
        $match: {
          postId: new mongoose.Types.ObjectId(postId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          postId: 1,
          comment: 1,
          likes: 1,
          createdAt: 1,
          "author.username": 1,
          "author.ProfileImg": 1,
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$$ROOT", "$author"],
          },
        },
      },
      {
        $project: {
          author: 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    return res.json({
      message: "comments fetched successfully",
      comments: comments,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getUserAllPost = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const AllPosts = await postCollection
      .find({ userId: userId })
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

export const likeMainComment = async (req: Request, res: Response) => {
  const { userId, commentId } = req.body;

  try {
    const comment = await commentCollection.findById(commentId);

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

export const postReplayComment = async (req: Request, res: Response) => {
  const { userId, commentId, newComment } = req.body;
  try {
    const postComment = new ReplayComment({
      userId,
      commentId,
      comment: newComment,
    });
    postComment.save();
    res.json({
      message: "liked comment",
      comments: postComment,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getReplayComment = async (req: Request, res: Response) => {
  const commentId = req.params.commentId;
  try {
    const comments = await ReplayComment.aggregate([
      {
        $match: {
          commentId: new mongoose.Types.ObjectId(commentId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          postId: 1,
          comment: 1,
          likes: 1,
          createdAt: 1,
          "author.username": 1,
          "author.ProfileImg": 1,
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ["$$ROOT", "$author"],
          },
        },
      },
      {
        $project: {
          author: 0,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
    ]);

    res.json({ message: "liked comment", comments: comments, success: true });
  } catch (error) {
    console.log(error);
  }
};

export const likeReplayComment = async (req: Request, res: Response) => {
  const { userId, commentId } = req.body;

  try {
    const comment = await ReplayComment.findById(commentId);

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

export const savePost = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const { postId, userId } = req.body;
    const user = await UserCollection.findById(userId);
    if (user) {
      if (!user.saved.includes(postId)) {
        await user.updateOne({
          $push: { saved: new mongoose.Types.ObjectId(postId) },
        });
        res.json({ Message: "post saved successfully", success: true });
      } else {
        await user.updateOne({
          $pull: { saved: new mongoose.Types.ObjectId(postId) },
        });
        res.json({ Message: "post unsaved successfully", success: true });
      }
    } else {
      res.json({ noUser: true });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getSavedPost = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const result = await UserCollection.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          password: 0,
        },
      },
      {
        $unwind: {
          path: "$saved",
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "saved",
          foreignField: "_id",
          as: "post",
        },
      },
      {
        $unwind: {
          path: "$post",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "post.userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      {
        $unwind: {
          path: "$userId",
        },
      },
    ]);

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const postId = req.params.postId;
  try {
    const response = await postCollection.findByIdAndDelete({ _id: postId });
    res.status(200).json({ success: true, message: "deleted post" });
  } catch (error) {
    console.log(error);
  }
};

export const editPost = async (req: Request, res: Response) => {
  try {
    const postData = req.body;
    await postCollection.updateOne(
      { _id: req.body.postId },
      {
        $set: {
          description: req.body.newDescription,
        },
      }
    );
    res.status(200).json({
      success: true,
      newDescription: req.body.newDescription,
      message: "Edited post",
    });
  } catch (error) {
    console.log(error);
  }
};

export const reportPost = async (req: Request, res: Response) => {
  console.log(req.body.newDescription);
  const report = await ReportSchema.findOne({
    PostId: new mongoose.Types.ObjectId(req.body.postId),
  });
  if (report) {
    report?.userText?.push({
      userId: new mongoose.Types.ObjectId(req.body.userId),
      text: req.body.newDescription,
    });
    report.save();
    res.status(200).json({
      success: true,
      message: "report post",
    });
  } else {
    await new ReportSchema({
      PostId: req.body.postId,
      userText: [
        {
          userId: new mongoose.Types.ObjectId(req.body.userId),
          text: req.body.newDescription,
        },
      ],
    }).save();

    res.status(200).json({
      success: true,
      newDescription: req.body.newDescription,
      message: "report post",
    });
  }
};
