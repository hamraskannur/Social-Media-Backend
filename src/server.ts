/* eslint-disable @typescript-eslint/no-var-requires */
import express, { Application } from 'express'
const CORS = require('cors')
const app: Application = express()

const adminRouter = require('./routes/admin')
const userRouter = require('./routes/user')

const cookieParser = require('cookie-parser')
const dbConnect=require('./config/connects')

app.use(express.json())
app.use(cookieParser())

app.use(CORS({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true,
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}
))

dbConnect;

app.use('/', userRouter)
app.use('/admin', adminRouter)

const port = 3008

app.listen(port, () => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  console.log(`connected port ${port}`)
})
