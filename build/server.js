"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-var-requires */
const express_1 = __importDefault(require("express"));
const CORS = require('cors');
const app = (0, express_1.default)();
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
app.use(express_1.default.json());
app.use(cookieParser());
app.use(CORS({
    origin: ['http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar']
}));
mongoose.connect(process.env.MONGODB).then(() => {
    console.log('mongodb connected');
}).catch((error) => {
    console.log(error);
});
app.use('/', userRouter);
app.use('/admin', adminRouter);
const port = 3008;
app.listen(port, () => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    console.log(`connected port ${port}`);
});
