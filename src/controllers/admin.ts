/* eslint-disable @typescript-eslint/no-var-requires */
import { Request, Response } from 'express'
import { generateToken } from '../utils/jws'
import userCollection from '../models/userSchema'
import adminSchema from '../models/adminSchema'
const bcrypt = require('bcrypt')

export default {
  adminLogin: async (req: Request, res: Response) => {
    const userSignUpp: { Status: Boolean, message: string, token: string } = {
      Status: false,
      message: '',
      token: ''

    }

    const { email, password } = req.body

    const Admin = await adminSchema.find({ email })

    if (Admin.length > 0) {
      const passwordVerify: boolean = await bcrypt.compare(
        password,
        Admin[0]?.password
      )
      if (passwordVerify) {
        const token = await generateToken({ id: Admin[0]?._id.toString() }, '30m')
        userSignUpp.Status = true
        userSignUpp.token = token

        res.status(200).send({ userSignUpp })
      } else {
        userSignUpp.message = 'your password wrong'
        userSignUpp.Status = false
        res.send({ userSignUpp })
      }
    } else {
      userSignUpp.message = 'your Email wrong'
      userSignUpp.Status = false
      res.send({ userSignUpp })
    }
  },
  getAllUser: async (req: Request, res: Response) => {
    const Users = await userCollection.find({ verified: true })
    res.send({ Users })
  },
  changeStatus: (req: Request, res: Response) => {
    const { Status, userId } = req.params
    console.log(Status)
    console.log("kokokok");
    
    void userCollection.updateOne({ _id: userId }, {
      $set: {
        status:Status
      }
    }).then((date) => {
      res.status(200).send({ Status: true })
    })
  }

}
