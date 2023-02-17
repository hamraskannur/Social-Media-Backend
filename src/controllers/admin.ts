/* eslint-disable @typescript-eslint/no-var-requires */
import { NextFunction, Request, Response } from "express";
import { generateToken } from "../utils/jws";
import userCollection from "../models/userSchema";
import adminSchema from "../models/adminSchema";
import postCollection from "../models/photoSchema";
const bcrypt = require("bcrypt");
import ReportSchema from "../models/ReportSchema";
import mongoose from "mongoose";

export const adminLogin = async (req: Request, res: Response,next:NextFunction) => {
  const userSignUpp: { Status: boolean; message: string; token: string } = {
    Status: false,
    message: "",
    token: "",
  };

  try {
    const { email, password } = req.body;

    const Admin = await adminSchema.findOne({ email });

    if (Admin) {
      const passwordVerify: boolean = await bcrypt.compare(
        password,
        Admin?.password
      );
      if (passwordVerify) {
        const token = await generateToken({ id: Admin?._id.toString() });
        userSignUpp.Status = true;
        userSignUpp.token = token;

        res.status(200).send({ userSignUpp });
      } else {
        userSignUpp.message = "your password wrong";
        userSignUpp.Status = false;
        res.send({ userSignUpp });
      }
    } else {
      userSignUpp.message = "your Email wrong";
      userSignUpp.Status = false;
      res.send({ userSignUpp });
    }
  } catch (error) {
    next(error)
  }
};
export const getAllUser = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const Users = await userCollection.find({ verified: true }).select('-password');    
    res.send({ Users });
  } catch (error) {
 next(error)
  }
};
export const changeStatus = (req: Request, res: Response,next: NextFunction) => {
  const { Status, userId } = req.params;
  try {
    void userCollection
      .updateOne(
        { _id: userId },
        {
          $set: {
            status: Status,
          },
        }
      )
      .then((date) => {
        res.status(200).send({ Status: true });
      });
  } catch (error) {
    next(error)
  }
};
export const getAllReportPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allPost = await ReportSchema.find()
      .populate("PostId")
      .populate("userText.userId", { username: 1, name: 1, _id: 1, ProfileImg: 1 })      
      res.status(200).send({ Status: true, Posts: allPost });
  } catch (error) {
    next(error)
  }
};

export const blockPost = async (req: Request, res: Response,next: NextFunction) => {
  try {    
    const {postId, status} =req.body
    
    await postCollection.findByIdAndUpdate(
      {
       _id:new mongoose.Types.ObjectId(postId)
      },
      {
        $set: { 
          status: status,
        },
      }
    );
    res.status(200).send({ Status: true });
  } catch (error) {
    next(error)
  }
};

export const getAllNotifications = async (req: Request, res: Response,next: NextFunction) => {
  try{
     
    const admin=await adminSchema.find({username:"admin"}).populate('notification.userId', { username: 1, name: 1, _id: 1, ProfileImg: 1 })

    if(admin){
     await adminSchema.updateOne({ username:"admin"},{$set:{
        read:false,
      }})
      res.status(200).send({ Status: true,admin:admin[0]?.notification });
    }else{
      res.status(200).send({ Status: false });

    }
  }catch(error){
    next(error)

  }
}

export const checkNewNotification = async (req: Request, res: Response,next: NextFunction) => {
  try{
    const admin =await adminSchema.findOne({read:false})    
    if(admin){
     return res.status(200).send({ status: true})
    }else{
      return  res.status(200).send({ status: false})
    }
    
  }catch(error) {
    next(error)
  }
}

export const getUserChart = async (req: Request, res: Response,next: NextFunction) => {
  try {
    const userCount=await userCollection.find({verified:true}).count()
    const postCount=await postCollection.find({shorts:null}).count()
    const shortsCount=await postCollection.find({shorts:{$ne:null}}).count()

    const userGraph = await userCollection.aggregate([
      { 
        $match: { 
          verified:{
          $eq:true
          }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $limit: 7
    }
    ])

    const postGraph = await postCollection.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $limit: 7
    }
    ])      

    return  res.status(200).send({ status: true,userGraph,postGraph,userCount,postCount,shortsCount})
  
  } catch (error) {    
    next(error)

  }
}