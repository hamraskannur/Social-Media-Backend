/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config()
const nodemailer = require('nodemailer')

export const sendEmail =  async (email: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: 587,
      secure: true,
      auth: {
        user: ,
        pass: "
      }
    })

    await transporter.sendMail({
      from: ,
      to: email,
      subject: subject,
      text: text
    }).then(()=>{
      console.log('email sent successfully')
    })
  } catch (error) {
    console.log('email not sent')
    console.log(error)
  }
}

