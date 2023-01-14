/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/consistent-type-assertions */

import jwt from 'jsonwebtoken'

export const generateToken = async (payload: { id: string }, expired: string) => {
  return jwt.sign(payload, <string>process.env.SECRET_TOKEN, {
    expiresIn: '1d'
  })
}
