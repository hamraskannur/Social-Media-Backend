/* eslint-disable @typescript-eslint/comma-spacing */
/* eslint-disable @typescript-eslint/no-var-requires */
import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
const bcrypt = require("bcrypt");
import { generateToken } from "../utils/jws";
import UserCollection from "../models/userSchema";
import postCollection from "../models/postSchema";
import commentCollection from "../models/CommentSchema";
import token from "../models/token";
import { nodemailer } from "../utils/nodemailer";
const saltRounds = 10;

export default {
  postSignup: async (req: Request, res: Response, next: NextFunction) => {
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
  },

  verify: async (req: Request, res: Response) => {
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
  },
  userLogin: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userLogin: {
      Status: boolean;
      message: string;
      name: string;
      token: string;
      id: string;
    } = {
      Status: false,
      message: "",
      name: "",
      token: "",
      id: "",
    };

    const findUser = await UserCollection.find({ email });
    if (findUser.length !== 0) {
      if (findUser[0]?.verified === true) {
        const passwordVerify: boolean = await bcrypt.compare(
          password,
          findUser[0].password
        );
        if (passwordVerify) {
          const token = await generateToken(
            { id: findUser[0]?._id.toString() },
          );
          userLogin.token = token;
          userLogin.name = findUser[0].username;
          userLogin.id = findUser[0]._id;
          userLogin.Status = true;

          if (!findUser[0]?.status) {
            res.status(200).send({ userLogin });
          } else {
            userLogin.message = "Admin blocked please sent email from admin";
            userLogin.Status = false;
            res.send({ userLogin });
          }
        } else {
          userLogin.message = " Password is wrong";
          userLogin.Status = false;
          res.send({ userLogin });
        }
      } else {
        userLogin.message = "your signup not complete";
        userLogin.Status = false;
        res.send({ userLogin });
      }
    } else {
      userLogin.message = "wrong Email";
      userLogin.Status = false;
      res.send({ userLogin });
    }
  },
  addPost: async (req: Request, res: Response) => {
    const { imageLinks, description, userId } = req.body;
    const post = await new postCollection({
      userId,
      img: imageLinks,
      description,
    }).save();

    res.status(201).json({ status: true });
  },
  getMyPost: async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const allPost = await postCollection.find({ userId });
    res.status(201).json({ status: true, allPost });
  },
  getMyProfile: async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const useData = await postCollection.find({ userId: userId })
      .populate("userId");
      
      res.status(201).json({ useData });
  },
  getAllPosts: async (req: Request, res: Response) => {
    const AllPosts = await postCollection.find().populate("userId");
    res.status(201).json({ AllPosts });
  },
  getOnePost: async (req: Request, res: Response) => {
    const { userId, PostId } = req.params;
  },
  getFriendsAccount: async (req: Request, res: Response) => {
    const userId = req.params.userId;
      const FriendsAccount = await UserCollection.find({ _id: userId });
    res.status(201).json({ FriendsAccount });
  },
  googleLogin: async (req: Request, res: Response) => {
    const userLogin: {
      Status: boolean;
      message: string;
      name: string;
      token: string;
      id: string;
    } = {
      Status: false,
      message: "",
      name: "",
      token: "",
      id: "",
    };

    const { email, name } = req.body;

    const user = await UserCollection.find({ email });
    if (user.length === 0) {
      const user = await new UserCollection({
        name: name,
        email: email,
        username: name,
      }).save();
      console.log(user);
      const token = await generateToken({ id: user._id.toString() });
      userLogin.token = token;
      userLogin.name = user.username;
      userLogin.id = user._id;
      userLogin.Status = true;
      res.status(200).send({ userLogin });
    } else {
      const token = await generateToken({ id: user[0]._id.toString() });
      userLogin.token = token;
      userLogin.name = user[0].username;
      userLogin.id = user[0]._id;
      userLogin.Status = true;
      res.status(200).send({ userLogin });
    }
  },
  likePostReq: async (req: Request, res: Response) => {
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
  },

  postComment: async (req: Request, res: Response) => {
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
      console.log(postComment, "post comment after populate");

      res.json({
        message: "commented posted successfully",
        success: true,
        comment: postComment,
      });
    } catch (error) {}
  },
  getComment: async (req: Request, res: Response) => {
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
    console.log("comments");

    console.log(comments);
    return res.json({
      message: "comments fetched successfully",
      comments: comments,
      success: true,
    });
  },
  getUserData: async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const user = await UserCollection.find({ _id: userId });
    return res.json({
      message: "comments fetched successfully",
      user: user,
      success: true,
    });
  },

  getUserAllPost:async (req: Request, res: Response) => {
    const userId = req.params.userId;
  const AllPosts = await postCollection.find({ userId: userId }).populate("userId");
  console.log(AllPosts);
  
  res.json({
    message: "AllPosts fetched successfully",
    AllPosts: AllPosts,
    success: true,
  });
  }
};
