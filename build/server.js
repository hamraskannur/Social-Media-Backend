"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
const express_1 = __importDefault(require("express"));
const CORS = require("cors");
const app = (0, express_1.default)();
const adminRouter = require("./routes/adminRoutes");
const userRouter = require("./routes/userRoutes");
const postRouter = require("./routes/postRoutes");
const chatRouter = require("./routes/chatRoutes");
const videoRouter = require('./routes/videoRoutes');
const cookieParser = require("cookie-parser");
const dbConnect = require("./config/connects");
app.use(express_1.default.json());
app.use(cookieParser());
// app.use(
//   CORS({
//     origin: [process.env.BASE_URL],
//     methods: ["GET", "POST", "PUT", "DELETE","HEAD"],
//     credentials: true,
//     exposedHeaders: ["Content-Length", "X-Foo", "X-Bar"],
//   })
// );
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://locomate.smartworlds.shop');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Pass to next layer of middleware
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
dbConnect;
app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/post", postRouter);
app.use('/chat', chatRouter);
app.use('/video', videoRouter);
const port = 3008;
app.listen(port, () => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`connected port ${port}`);
});
