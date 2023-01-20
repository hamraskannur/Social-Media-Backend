/* eslint-disable @typescript-eslint/no-var-requires */
import { Request, Response } from "express";
import { generateToken } from "../utils/jws";
import userCollection from "../models/userSchema";
import adminSchema from "../models/adminSchema";
const bcrypt = require("bcrypt");

export const adminLogin = async (req: Request, res: Response) => {
  const userSignUpp: { Status: boolean; message: string; token: string } = {
    Status: false,
    message: "",
    token: "",
  };

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
};
export const getAllUser = async (req: Request, res: Response) => {
  const Users = await userCollection.find({ verified: true });
  res.send({ Users });
};
export const changeStatus = (req: Request, res: Response) => {
  const { Status, userId } = req.params;

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
};
