/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-var-requires */
import Token from '../models/token'
const crypto = require('crypto')
import { sendEmail } from './sentEmail'

export const  nodemailer = async(id: string, email: string) => {
   
  const userToken = await new Token({
    userId: id,
    token: crypto.randomBytes(32).toString('hex')
  }).save()
     
  const url = `${process.env.BASE_URL}user/verify/${id}/${userToken.token}`

  sendEmail(email, 'verify Email', url)
}

