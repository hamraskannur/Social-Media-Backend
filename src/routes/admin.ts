/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import { adminLogin,getAllUser,changeStatus } from '../controllers/admin'
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')

router.post('/login', adminLogin)

router.get('/getAllUser' , getAllUser)

router.get('/changeStatus/:Status/:userId', changeStatus)

module.exports = router
