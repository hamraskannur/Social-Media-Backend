/* eslint-disable @typescript-eslint/no-var-requires */
import express, { Application } from "express";
const CORS = require("cors");
const app: Application = express();

const adminRouter = require("./routes/adminRoutes");
const userRouter = require("./routes/userRoutes");
const postRouter =require("./routes/postRoutes")
const chatRouter =require("./routes/chatRoutes")
const videoRouter =require('./routes/videoRoutes')

const cookieParser = require("cookie-parser");
const dbConnect = require("./config/connects");

app.use(express.json());
app.use(cookieParser());

app.use(
  CORS({
    origin: ["https://www.locomate.smartworlds.shop"],
    methods: ["GET", "POST", "PUT", "DELETE","HEAD", "OPTIONS"],
    credentials: true,
    exposedHeaders: ["Content-Length", "X-Foo", "X-Bar"],

  })
);


dbConnect;

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/post", postRouter)
app.use('/chat',chatRouter)
app.use('/video',videoRouter)

const port = 3008;

app.listen(port, () => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  console.log(`connected port ${port}`);
});
