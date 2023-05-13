import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
const bcrypt = require("bcrypt");
import { generateToken } from "../utils/jws";
import UserCollection from "../models/userSchema";
import postCollection from "../models/photoSchema";
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
    const user = await UserCollection.findOne({ email });

    if (user) {
      if (user.verified === false) {
        nodemailer(user.id, email);
        userSignup.message = "An Email resent to your account please verify";
        userSignup.Status = true;
        return res.status(201).json({ userSignup });
      }

      userSignup.message = "Email Exist";
      res.json({ userSignup });
    } else {
      
      const userName = await UserCollection.find({ username });

      if (userName.length > 0) {
        userSignup.message = "userName Exist";
        return res.json({ userSignup });
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
    next(error)
  }
};

export const verify = async (req: Request, res: Response,next: NextFunction) => {
  const Verify: { Status: boolean; message: string } = {
    Status: false,
    message: "",
  };
  try {
    const user = await UserCollection.findOne({ _id: req.params.id });
    Verify.message = "Invalid link";

    if (user == null) return res.status(200).send({ Verify });
    const Token = await token.findOne({
      userId: user._id,
      token: req.params.token,
    });

    Verify.message = "Invalid link";
    if (token == null) return res.status(200).send({ Verify });

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
    next(error)
  }
};

export const userLogin = async (req: Request, res: Response,next: NextFunction) => {
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
    console.log(password);
    
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
              Status: false,
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
    
    next(error)
  }
};

export const getMyPost = async (req: Request, res: Response,next: NextFunction) => {
  try {
    const userId = req.body.userId;
    const allPost = await postCollection.find({ userId });
    res.status(201).json({ status: true, allPost });
  } catch (error) {
    next(error)
  }
};

export const getMyProfile = async (req: Request, res: Response,next: NextFunction) => {
  try {
    const userId = req.body.userId;
    const useData = await postCollection
      .find({ userId: userId })
      .populate("userId", { username: 1, name: 1, _id: 1, ProfileImg: 1 });

    res.status(201).json({ useData });
  } catch (error) {
    next(error)
  }
};

export const getFriendsAccount = async (req: Request, res: Response,next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const FriendsAccount = await UserCollection.find({ _id: userId }).select('-password');
    res.status(201).json({ FriendsAccount });
  } catch (error) {
    next(error)
    }
};

export const googleLogin = async (req: Request, res: Response,next: NextFunction) => {
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
    next(error)
  }
};

export const getUserData = async (req: Request, res: Response,next: NextFunction) => {
  try {
    const userId = req.body.userId;
    const user = await UserCollection.findById(userId).select('-password');

    return res.json({
      message: "comments fetched successfully",
      user: user,
      success: true,
    });
  } catch (error) {
    next(error)
  }
};

export const updateUserData = async (req: Request, res: Response,next: NextFunction) => {
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
    next(error)
  }
};

export const followUser = async (req: Request, res: Response,next: NextFunction) => {
  try {
    const userId = req.body.userId;
    const followUserId = req.body.followId;

    const user = await UserCollection.findById(followUserId);
    const mainUser = await UserCollection.findById(userId);

    if (!user) res.json({ message: "no user", success: false });

    if (!mainUser) res.json({ message: "no user", success: false });

    if (user?.public) {
      if (!user?.Followers?.includes(userId)) {
        await UserCollection.findOneAndUpdate(
          { _id: user._id },
          {
            $push: {
              notification: {
                postId: userId,
                userId: userId,
                text: "start Followed you",
                read: false,
              },
            },
          }
        );
        await user.updateOne({ $push: { Followers: mainUser?._id } });
        await mainUser?.updateOne({ $push: { Following: user._id } });
        res.json({ message: "successfully followed user", success: true });
      } else {
        await user.updateOne({ $pull: { Followers: mainUser?._id } });
        await mainUser?.updateOne({ $pull: { Following: user._id } });
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
    next(error)
  }
};

export const getAllRequest = async (req: Request, res: Response,next: NextFunction) => {
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
    next(error)
  }
};

export const acceptRequest = async (req: Request, res: Response,next: NextFunction) => {
  try {
    const userId = req.body.userId;
    const acceptId = req.body.acceptId;

    const user = await UserCollection.findById(userId);
    const acceptUserId = await UserCollection.findById(acceptId);

    if (!acceptUserId) res.json({ message: "no user", success: false });

    if (!user) res.json({ message: "no user", success: false });
    if (user?.Requests?.includes(acceptId)) {
      await UserCollection.findOneAndUpdate(
        { _id: acceptId },
        {
          $push: {
            notification: {
              userId: userId,
              text: " accepted you request",
              read: false,
            },
          },
        }
      );
      await user.updateOne({ $pull: { Requests: acceptId } });
      await user.updateOne({ $push: { Followers: acceptId } });
      await acceptUserId?.updateOne({ $push: { Following: userId } });
    }
    res.json({ message: "success accepted user ", success: true });
  } catch (error) {
    next(error)
  }
};

export const deleteRequests = async (req: Request, res: Response,next: NextFunction) => {
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
    next(error)
  }
};

export const getFollowingUser = async (req: Request, res: Response,next: NextFunction) => {
  try {
    const user = await UserCollection.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.userId),
        },
      },
      {
        $project: {
          Following: 1,
        },
      },
      {
        $unwind: {
          path: "$Following",
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "Following",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $project: {
          result: { $arrayElemAt: ["$result", 0] },
        },
      },
      {
        $project: {
          "result.name": 1,
          "result.ProfileImg": 1,
          "result.username": 1,
          "result._id": 1,
        },
      },
    ]);

    res.json({ message: "successfully", user: user });
  } catch (error) {
    next(error)
  }
};

export const getFollowersUser = async (req: Request, res: Response,next: NextFunction) => {
  try {
    const userId = req.params.userId;
    const user = await UserCollection.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.userId),
        },
      },
      {
        $project: {
          Followers: 1,
        },
      },
      {
        $unwind: {
          path: "$Followers",
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "Followers",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $project: {
          result: { $arrayElemAt: ["$result", 0] },
        },
      },
      {
        $project: {
          "result.name": 1,
          "result.ProfileImg": 1,
          "result.username": 1,
          "result._id": 1,
        },
      },
    ]);

    res.json({ message: "successfully", user: user });
  } catch (error) {
    next(error)
  }
};

export const changeToPrivate = async (req: Request, res: Response,next: NextFunction) => {
  const userId = req.body.userId;
  UserCollection.updateOne(
    { _id: userId },
    {
      $set: {
        public: req.body.checked,
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
};
export const searchUser = async (req: Request, res: Response,next: NextFunction) => {
  try {
    const { searchData: searchExpression } = req.body;

    const searchData = await UserCollection.find({
      username: { $regex: searchExpression, $options: "i" },
    });
    if (searchData) {
      res.status(200).json(searchData);
    } else {
      res.status(404).json({ noUsers: true });
    }
  } catch (error) {
    next(error)
  }
};

export const getAllNotifications = async (req: Request, res: Response,next: NextFunction) => {
  try {
    const user = await UserCollection.find({ _id: req.body.userId }).populate(
      "notification.userId",
      { username: 1, name: 1, _id: 1, ProfileImg: 1 }
    );

    if (user) {
      await UserCollection.updateOne(
        { _id: req.body.userId },
        {
          $set: {
            read: false,
          },
        }
      );

      res.status(200).send({ Status: true, user: user[0]?.notification });
    } else {
      res.status(200).send({ Status: false });
    }
  } catch (error) {
    next(error)
  }
};

export const suggestionUsers = async (req: Request, res: Response,next: NextFunction) => {
  try {
    const userId = req.body.userId;
    const user = await UserCollection.findOne({ _id: userId });
    if (!user) return;
    const notFollowedUsers = await UserCollection.aggregate([
      {
        $match: {
          $and: [
            { _id: { $nin: user.Following } },
            { _id: { $ne: userId } },
            {verified:true}
          ]
        },
      },
      { $sample: { size: 5} },
    ]);
     
    res.status(200).send({ Status: true, notFollowedUsers: notFollowedUsers });
  } catch (error) {
    next(error)
  }
};
