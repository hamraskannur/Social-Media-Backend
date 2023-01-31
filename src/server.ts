/* eslint-disable @typescript-eslint/no-var-requires */
import express, { Application } from "express";
const CORS = require("cors");
const app: Application = express();

const io = require("socket.io")(8800, {
  cors: {
    origin: "http://localhost:3000",
  },
});
let activeUser: any[] = [];

io.on("connection", (socket: any) => {
  socket.on("new-user-add", (newUserId: string) => {
    if (!activeUser.some((user) => user.userId === newUserId)) {
      activeUser.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }

    io.emit("get-user", activeUser);
  });
  socket.on("send-message", (data: any) => {
    const { receiverId } = data;
    const user = activeUser.find((user) => user.userId === receiverId);
    if (user) {
      io.to(user.socketId).emit("receive-message",data);
    }
  });
  socket.on("disconnect", () => {
    activeUser = activeUser.filter((user) => user.socketId !== socket.id);
    console.log("user disconnect ", activeUser);
    io.emit("get-user", activeUser);
  });
});

const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const postRouter =require("./routes/post")
const chatRouter =require("./routes/chat")

const cookieParser = require("cookie-parser");
const dbConnect = require("./config/connects");

app.use(express.json());
app.use(cookieParser());

app.use(
  CORS({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: ["Content-Length", "X-Foo", "X-Bar"],
  })
);

dbConnect;

app.use("/", userRouter);
app.use("/admin", adminRouter);
app.use("/post", postRouter)
app.use('/chat',chatRouter)

const port = 3008;

app.listen(port, () => {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  console.log(`connected port ${port}`);
});
