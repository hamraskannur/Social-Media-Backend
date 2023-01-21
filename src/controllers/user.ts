/* eslint-disable @typescript-eslint/comma-spacing */
/* eslint-disable @typescript-eslint/no-var-requires */
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
const bcrypt = require("bcrypt");
import { generateToken } from "../utils/jws";
import UserCollection from "../models/userSchema";
import postCollection from "../models/postSchema";
import messageCollection from "../models/messageSchema";
import commentCollection from "../models/CommentSchema";
import chatCollection from "../models/chatSchema";
import ReplayComment from "../models/ReplayComment";
import token from "../models/token";
import { nodemailer } from "../utils/nodemailer";
const saltRounds = 10;

export const postSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userSignup: { Status: boolean; message: string } = {
    Status: false,
    message: "",
  };
  try {
    const { name, email, dob, phoneNo, password, username } = req.body;
    const user = await UserCollection.find({ email });

    if (user.length > 0) {
      if (user[0].verified === false) {
        nodemailer(user[0].id, email);
        userSignup.message = "An Email resent to your account please verify";
        userSignup.Status = true;
        res.status(201).json({ userSignup });
      }

      userSignup.message = "Email Exist";
      res.json({ userSignup });
    } else {
      const userName = await UserCollection.find({ username });

      if (userName.length > 0) {
        userSignup.message = "userName Exist";
        res.json({ userSignup });
      }

      const user = await new UserCollection({
        username,
        name,
        email,
        dob,
        phoneNo,
        password: await bcrypt.hash(password, saltRounds),
      }).save();

      await nodemailer(user.id, user.email);
      userSignup.message = "An Email sent to your account please verify";
      userSignup.Status = true;
      res.status(201).json({ userSignup });
    }
  } catch (error) {
    userSignup.message = "some thing is wong";
    userSignup.Status = false;
    res.json({ userSignup });
  }
};

export const verify = async (req: Request, res: Response) => {
  const Verify: { Status: boolean; message: string } = {
    Status: false,
    message: "",
  };
  try {
    const user = await UserCollection.findOne({ _id: req.params.id });
    Verify.message = "Invalid link";

    if (user == null) return res.status(400).send({ Verify });
    const Token = await token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    Verify.message = "Invalid link";
    if (token == null) return res.status(400).send({ Verify });

    await UserCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          verified: true,
        },
      }
    );
    await token.findByIdAndRemove(Token?._id);
    Verify.Status = true;
    Verify.message = "email verified successfully";
    res.send(Verify);
  } catch (error) {
    Verify.Status = false;
    Verify.message = "Invalid link ";
    res.status(400).send({ Verify });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const userLogin: {
    Status: boolean;
    message: string;
    user: [];
    token: string;
    id: string;
  } = {
    Status: false,
    message: "",
    user: [],
    token: "",
    id: "",
  };
  try {
    const findUser = await UserCollection.find({ email });
    if (findUser.length !== 0) {
      if (findUser[0]?.verified === true) {
        const passwordVerify: boolean = await bcrypt.compare(
          password,
          findUser[0].password
        );
        if (passwordVerify) {
          const token = await generateToken({
            id: findUser[0]?._id.toString(),
          });

          if (!findUser[0]?.status) {
            res.status(200).send({
              message: "",
              user: findUser[0],
              Status: true,
              token: token,
            });
          } else {
            res.send({
              message: "Admin blocked please sent email from admin",
              Status: true,
            });
          }
        } else {
          res.send({ message: " Password is wrong", Status: false });
        }
      } else {
        res.send({ message: "your signup not complete", Status: false });
      }
    } else {
      res.send({ message: "wrong Email", Status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

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

export const getMyPost = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const allPost = await postCollection.find({ userId });
    res.status(201).json({ status: true, allPost });
  } catch (error) {
    console.log(error);
  }
};

export const getMyProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const useData = await postCollection
      .find({ userId: userId })
      .populate("userId");

    res.status(201).json({ useData });
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
};

export const getFriendsAccount = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const FriendsAccount = await UserCollection.find({ _id: userId });
    res.status(201).json({ FriendsAccount });
  } catch (error) {
    console.log(error);
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;

    const user = await UserCollection.find({ email });
    if (user.length === 0) {
      const user = await new UserCollection({
        name: name,
        email: email,
        username: name,
      }).save();
      const token = await generateToken({ id: user._id.toString() });

      res.status(200).send({ token: token, user: user, Status: true });
    } else {
      const token = await generateToken({ id: user[0]._id.toString() });

      res.status(200).send({ token: token, user: user[0], Status: true });
    }
  } catch (error) {
    console.log(error);
  }
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

export const getUserData = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const user = await UserCollection.find({ _id: userId });
    return res.json({
      message: "comments fetched successfully",
      user: user,
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

export const updateUserData = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const user = await UserCollection.find({ username: req.body.userName });
    if (user.length === 0 || user[0]?._id === userId) {
      UserCollection.updateOne(
        { _id: userId },
        {
          $set: {
            username: req.body.username,
            name: req.body.name,
            phoneNo: req.body.phoneNo,
            dob: req.body.dob,
            country: req.body.country,
            description: req.body.description,
            city: req.body.city,
            PostalCode: req.body.PostalCode,
            ProfileImg: req.body.ProfileImg,
            coverImg: req.body.coverImg,
          },
        }
      ).then((data) => {
        if (data) {
          if (data.modifiedCount > 0) {
            return res.json({
              message: "user data updated successfully",
              success: true,
            });
          } else {
            return res.json({
              message: "",
              success: "noUpdates",
            });
          }
        } else {
          return res.json({
            message: "something is wrong",
            success: false,
          });
        }
      });
    } else {
      return res.json({
        message: "userName Exist",
        success: false,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const followUser = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const followUserId = req.body.followId;

    const user = await UserCollection.findById(followUserId);
    const mainUser = await UserCollection.findById(userId);

    if (!user) res.json({ message: "no user", success: false });
    if (!mainUser) res.json({ message: "no user", success: false });
    if (user?.public) {
      if (!user?.Followers?.includes(userId)) {
        await user.updateOne({ $push: { Followers: userId } });
        await mainUser?.updateOne({ $push: { Following: userId } });
        res.json({ message: "successfully followed user", success: true });
      } else {
        await user.updateOne({ $pull: { Followers: userId } });
        await mainUser?.updateOne({ $pull: { Following: userId } });
        res.json({ message: "successfully unFollowed user", success: true });
      }
    } else {
      if (user?.Followers?.includes(userId)) {
        await user.updateOne({ $pull: { Followers: userId } });
        await mainUser?.updateOne({ $pull: { Following: userId } });
        res.json({ message: "successfully unFollowed user", success: true });
      } else {
        if (!user?.Requests?.includes(userId)) {
          await user?.updateOne({ $push: { Requests: userId } });
          res.json({ message: "successfully Requested user", success: true });
        } else {
          await user.updateOne({ $pull: { Requests: userId } });
          res.json({
            message: "successfully unRequested user",
            success: true,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAllRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    const Request = await UserCollection.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $project: {
          Requests: 1,
        },
      },
      {
        $unwind: {
          path: "$Requests",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "Requests",
          foreignField: "_id",
          as: "Requests",
        },
      },
    ]);
    res.json({
      message: "get All Request",
      Request: Request,
      success: false,
    });
  } catch (error) {
    console.log(error);
  }
};

export const acceptRequest = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const acceptId = req.body.acceptId;

    const user = await UserCollection.findById(userId);
    const acceptUserId = await UserCollection.findById(acceptId);

    if (!acceptUserId) res.json({ message: "no user", success: false });

    if (!user) res.json({ message: "no user", success: false });
    if (user?.Requests?.includes(acceptId)) {
      await user.updateOne({ $pull: { Requests: acceptId } });
      await user.updateOne({ $push: { Followers: acceptId } });
      await acceptUserId?.updateOne({ $push: { Following: acceptId } });
    }
    res.json({ message: "success accepted user ", success: true });
  } catch (error) {
    console.log(error);
  }
};

export const deleteRequests = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;
    const deleteId = req.params.deleteId;

    const user = await UserCollection.findById(userId);
    if (!user) res.json({ message: "no user", success: false });

    if (user?.Requests?.includes(deleteId)) {
      await user.updateOne({ $pull: { Requests: deleteId } });
      res.json({ message: "success delete request ", success: true });
    } else {
      res.json({ message: "something is wrong ", success: false });
    }
  } catch (error) {
    console.log(error);
  }
};
export const createChat = async (req: Request, res: Response) => {
  try {
    const chat = await chatCollection.find({
      members: { $in: [req.body.senderId, req.body.receiverId] },
    });
    if (!chat) {
      const newChat = new chatCollection({
        members: [req.body.senderId, req.body.receiverId],
      });

      const result = await newChat.save();
      res.status(200).json(result);
    }
    res.status(200).json("ok");
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const getChat = async (req: Request, res: Response) => {
  try {
    const chat = await chatCollection.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const chatFind = async (req: Request, res: Response) => {
  try {
    const chat = await chatCollection.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const addMessage = async (req: Request, res: Response) => {
  const { chatId, senderId, text } = req.body;
  console.log(chatId);
  console.log(senderId);
  console.log(text);

  const message = new messageCollection({
    chatId,
    senderId,
    text,
  });

  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
export const getMessages = async (req: Request, res: Response) => {
  const { chatId } = req.params;
  try {
    const result = await messageCollection.find({ chatId });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
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
    res.json({ message: "liked comment",comments:postComment, success: true });

  } catch (error) {
    console.log(error);
  }
};

export const getReplayComment =async (req: Request, res: Response) => {
  const commentId=req.params.commentId
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
    
    res.json({ message: "liked comment",comments:comments, success: true });

   } catch (error) {
    console.log(error);
    
   }
   
}


export const likeReplayComment =async(req: Request, res: Response) => {

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
}