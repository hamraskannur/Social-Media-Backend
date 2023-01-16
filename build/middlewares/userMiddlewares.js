'use strict'
const __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
  function adopt (value) { return value instanceof P ? value : new P(function (resolve) { resolve(value) }) }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled (value) { try { step(generator.next(value)) } catch (e) { reject(e) } }
    function rejected (value) { try { step(generator.throw(value)) } catch (e) { reject(e) } }
    function step (result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected) }
    step((generator = generator.apply(thisArg, _arguments || [])).next())
  })
}
Object.defineProperty(exports, '__esModule', { value: true })
const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => __awaiter(void 0, void 0, void 0, function * () {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).send({
        message: 'auth failed',
        Status: false
      })
    }
    const [, token] = authHeader.split(' ')
    jwt.verify(token, process.env.SECRET_TOKEN, (err, decoded) => {
      if (err) {
        return res.send({
          message: 'auth failed',
          Status: false
        })
      } else {
        const { id } = decoded
        req.body.userIdd = id
        console.log(req.body.userIdd, 'kkkk')
        next()
      }
    })
  } catch (error) {
    return res.status(401).send({
      message: 'auth failed',
      success: false
    })
  }
})
