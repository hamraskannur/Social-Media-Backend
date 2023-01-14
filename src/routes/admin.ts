/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express'
import controller from '../controllers/admin'
const router = express.Router()
const authMiddleware = require('../middleware/authMiddleware')

router.post('/login', controller.adminLogin)

router.get('/getAllUser' , controller.getAllUser)

router.get('/changeStatus/:Status/:userId', controller.changeStatus)

module.exports = router
