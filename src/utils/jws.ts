

import jwt from 'jsonwebtoken'

export const generateToken = async (payload: { id: string }) => {
  return jwt.sign(payload, <string> process.env.SECRET_TOKEN, {
    expiresIn: '1d'
  })
}
