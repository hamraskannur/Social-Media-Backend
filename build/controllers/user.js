"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt = require("bcrypt");
const jws_1 = require("../utils/jws");
const userSchema_1 = __importDefault(require("../models/userSchema"));
const postSchema_1 = __importDefault(require("../models/postSchema"));
const CommentSchema_1 = __importDefault(require("../models/CommentSchema"));
const token_1 = __importDefault(require("../models/token"));
const nodemailer_1 = require("../utils/nodemailer");
const saltRounds = 10;
exports.default = {
    postSignup: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const userSignup = {
            Status: false,
            message: "",
        };
        try {
            const { name, email, dob, phoneNo, password, username } = req.body;
            const user = yield userSchema_1.default.find({ email });
            if (user.length > 0) {
                if (user[0].verified === false) {
                    (0, nodemailer_1.nodemailer)(user[0].id, email);
                    userSignup.message = "An Email resent to your account please verify";
                    userSignup.Status = true;
                    res.status(201).json({ userSignup });
                }
                userSignup.message = "Email Exist";
                res.json({ userSignup });
            }
            else {
                const userName = yield userSchema_1.default.find({ username });
                if (userName.length > 0) {
                    userSignup.message = "userName Exist";
                    res.json({ userSignup });
                }
                const user = yield new userSchema_1.default({
                    username,
                    name,
                    email,
                    dob,
                    phoneNo,
                    password: yield bcrypt.hash(password, saltRounds),
                }).save();
                yield (0, nodemailer_1.nodemailer)(user.id, user.email);
                userSignup.message = "An Email sent to your account please verify";
                userSignup.Status = true;
                res.status(201).json({ userSignup });
            }
        }
        catch (error) {
            userSignup.message = "some thing is wong";
            userSignup.Status = false;
            res.json({ userSignup });
        }
    }),
    verify: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const Verify = {
            Status: false,
            message: "",
        };
        try {
            const user = yield userSchema_1.default.findOne({ _id: req.params.id });
            Verify.message = "Invalid link";
            if (user == null)
                return res.status(400).send({ Verify });
            const Token = yield token_1.default.findOne({
                userId: user._id,
                token: req.params.token,
            });
            Verify.message = "Invalid link";
            if (token_1.default == null)
                return res.status(400).send({ Verify });
            yield userSchema_1.default.updateOne({ _id: user._id }, {
                $set: {
                    verified: true,
                },
            });
            yield token_1.default.findByIdAndRemove(Token === null || Token === void 0 ? void 0 : Token._id);
            Verify.Status = true;
            Verify.message = "email verified successfully";
            res.send(Verify);
        }
        catch (error) {
            Verify.Status = false;
            Verify.message = "Invalid link ";
            res.status(400).send({ Verify });
        }
    }),
    userLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const { email, password } = req.body;
        const userLogin = {
            Status: false,
            message: "",
            name: "",
            token: "",
            id: "",
        };
        const findUser = yield userSchema_1.default.find({ email });
        if (findUser.length !== 0) {
            if (((_a = findUser[0]) === null || _a === void 0 ? void 0 : _a.verified) === true) {
                const passwordVerify = yield bcrypt.compare(password, findUser[0].password);
                if (passwordVerify) {
                    const token = yield (0, jws_1.generateToken)({ id: (_b = findUser[0]) === null || _b === void 0 ? void 0 : _b._id.toString() }, "30m");
                    userLogin.token = token;
                    userLogin.name = findUser[0].username;
                    userLogin.id = findUser[0]._id;
                    userLogin.Status = true;
                    if (!((_c = findUser[0]) === null || _c === void 0 ? void 0 : _c.status)) {
                        res.status(200).send({ userLogin });
                    }
                    else {
                        userLogin.message = "Admin blocked please sent email from admin";
                        userLogin.Status = false;
                        res.send({ userLogin });
                    }
                }
                else {
                    userLogin.message = " Password is wrong";
                    userLogin.Status = false;
                    res.send({ userLogin });
                }
            }
            else {
                userLogin.message = "your signup not complete";
                userLogin.Status = false;
                res.send({ userLogin });
            }
        }
        else {
            userLogin.message = "wrong Email";
            userLogin.Status = false;
            res.send({ userLogin });
        }
    }),
    addPost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { imageLinks, description, userId } = req.body;
        const post = yield new postSchema_1.default({
            userId,
            img: imageLinks,
            description,
        }).save();
        res.status(201).json({ status: true });
    }),
    getMyPost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.body.userId;
        const allPost = yield postSchema_1.default.find({ userId });
        res.status(201).json({ status: true, allPost });
    }),
    getMyProfile: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.body.userId;
        const useData = yield postSchema_1.default.find({ userId: userId })
            .populate("userId");
        res.status(201).json({ useData });
    }),
    getAllPosts: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const AllPosts = yield postSchema_1.default.find().populate("userId");
        res.status(201).json({ AllPosts });
    }),
    getOnePost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId, PostId } = req.params;
    }),
    getFriendsAccount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.params.userId;
        const FriendsAccount = yield userSchema_1.default.find({ _id: userId });
        res.status(201).json({ FriendsAccount });
    }),
    googleLogin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userLogin = {
            Status: false,
            message: "",
            name: "",
            token: "",
            id: "",
        };
        const { email, name } = req.body;
        const user = yield userSchema_1.default.find({ email });
        if (user.length === 0) {
            const user = yield new userSchema_1.default({
                name: name,
                email: email,
                username: name,
            }).save();
            console.log(user);
            const token = yield (0, jws_1.generateToken)({ id: user._id.toString() }, "30m");
            userLogin.token = token;
            userLogin.name = user.username;
            userLogin.id = user._id;
            userLogin.Status = true;
            res.status(200).send({ userLogin });
        }
        else {
            const token = yield (0, jws_1.generateToken)({ id: user[0]._id.toString() }, "30m");
            userLogin.token = token;
            userLogin.name = user[0].username;
            userLogin.id = user[0]._id;
            userLogin.Status = true;
            res.status(200).send({ userLogin });
        }
    }),
    likePostReq: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.body.userId;
        const postId = req.params.postId;
        const post = yield postSchema_1.default.findById(postId);
        if (!post) {
            return res.json({ Message: "post not fount", success: false });
        }
        if (!post.likes.includes(userId)) {
            yield post.updateOne({ $push: { likes: userId } });
            return res.json({ Message: "post liked successfully", success: true });
        }
        else {
            yield post.updateOne({ $pull: { likes: userId } });
            return res.json({ Message: "post liked successfully", success: true });
        }
    }),
    postComment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const comment = req.body.comment;
        const userId = req.body.userId;
        const postId = req.params.postId;
        try {
            const post = yield postSchema_1.default.findById(postId);
            if (!post) {
                return res.json({ message: "post not found", success: false });
            }
            const postComment = new CommentSchema_1.default({
                userId,
                postId,
                comment,
            });
            yield postComment.save();
            yield CommentSchema_1.default.populate(postComment, {
                path: "userId",
                select: { username: 1 },
            });
            console.log(postComment, "post comment after populate");
            res.json({
                message: "commented posted successfully",
                success: true,
                comment: postComment,
            });
        }
        catch (error) { }
    }),
    getComment: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const postId = req.params.postId;
        const comments = yield CommentSchema_1.default.aggregate([
            {
                $match: {
                    postId: new mongoose_1.default.Types.ObjectId(postId),
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "author",
                },
            },
            {
                $unwind: {
                    path: "$author",
                },
            },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    postId: 1,
                    comment: 1,
                    likes: 1,
                    createdAt: 1,
                    "author.username": 1,
                },
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: ["$$ROOT", "$author"],
                    },
                },
            },
            {
                $project: {
                    author: 0,
                },
            },
            {
                $sort: {
                    createdAt: -1,
                },
            },
        ]);
        console.log("comments");
        console.log(comments);
        return res.json({
            message: "comments fetched successfully",
            comments: comments,
            success: true,
        });
    }),
    getUserData: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.body.userId;
        const user = yield userSchema_1.default.find({ _id: userId });
        return res.json({
            message: "comments fetched successfully",
            user: user,
            success: true,
        });
    }),
    getUserAllPost: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const userId = req.params.userId;
        const AllPosts = yield postSchema_1.default.find({ userId: userId }).populate("userId");
        console.log(AllPosts);
        res.json({
            message: "AllPosts fetched successfully",
            AllPosts: AllPosts,
            success: true,
        });
    })
};
