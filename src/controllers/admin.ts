/* eslint-disable @typescript-eslint/no-var-requires */
import { Request, Response } from "express";
import { generateToken } from "../utils/jws";
import userCollection from "../models/userSchema";
import adminSchema from "../models/adminSchema";
import postCollection from "../models/postSchema";
const bcrypt = require("bcrypt");
import ReportSchema from "../models/ReportSchema";

export const adminLogin = async (req: Request, res: Response) => {
  const userSignUpp: { Status: boolean; message: string; token: string } = {
    Status: false,
    message: "",
    token: "",
  };

  try {
    const { email, password } = req.body;

    const Admin = await adminSchema.find({ email });

    if (Admin.length > 0) {
      const passwordVerify: boolean = await bcrypt.compare(
        password,
        Admin[0]?.password
      );
      if (passwordVerify) {
        const token = await generateToken({ id: Admin[0]?._id.toString() });
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
    console.log(error);
  }
};
export const getAllUser = async (req: Request, res: Response) => {
  try {
    const Users = await userCollection.find({ verified: true });
    res.send({ Users });
  } catch (error) {
    console.log(error);
  }
};
export const changeStatus = (req: Request, res: Response) => {
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
    console.log(error);
  }
};
export const getAllBlockPost = async (req: Request, res: Response) => {
  try {
    const allPost = await ReportSchema.find()
      .populate("PostId")
      .populate("userText.userId");
    res.status(200).send({ Status: true, Posts: allPost });
  } catch (error) {
    console.log(error);
  }
};

export const blockPost = async (req: Request, res: Response) => {
  try {
    const {PostId, status} =req.body
    await postCollection.findByIdAndUpdate(
      {
        PostId,
      },
      {
        $set: {
          status: status,
        },
      }
    );
    res.status(200).send({ Status: true });
  } catch (error) {
    console.log(error);
  }
};
