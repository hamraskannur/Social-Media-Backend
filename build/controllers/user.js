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
exports.likeReplayComment = exports.getReplayComment = exports.postReplayComment = exports.likeMainComment = exports.getMessages = exports.addMessage = exports.chatFind = exports.getChat = exports.createChat = exports.deleteRequests = exports.acceptRequest = exports.getAllRequest = exports.followUser = exports.updateUserData = exports.getUserAllPost = exports.getUserData = exports.getComment = exports.postComment = exports.likePostReq = exports.googleLogin = exports.getFriendsAccount = exports.getOnePost = exports.getAllPosts = exports.getMyProfile = exports.getMyPost = exports.addPost = exports.userLogin = exports.verify = exports.postSignup = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt = require("bcrypt");
const jws_1 = require("../utils/jws");
const userSchema_1 = __importDefault(require("../models/userSchema"));
const postSchema_1 = __importDefault(require("../models/postSchema"));
const messageSchema_1 = __importDefault(require("../models/messageSchema"));
const CommentSchema_1 = __importDefault(require("../models/CommentSchema"));
const chatSchema_1 = __importDefault(require("../models/chatSchema"));
const ReplayComment_1 = __importDefault(require("../models/ReplayComment"));
const token_1 = __importDefault(require("../models/token"));
const nodemailer_1 = require("../utils/nodemailer");
const saltRounds = 10;
const postSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.postSignup = postSignup;
const verify = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
});
exports.verify = verify;
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { email, password } = req.body;
    const userLogin = {
        Status: false,
        message: "",
        user: [],
        token: "",
        id: "",
    };
    try {
        const findUser = yield userSchema_1.default.find({ email });
        if (findUser.length !== 0) {
            if (((_a = findUser[0]) === null || _a === void 0 ? void 0 : _a.verified) === true) {
                const passwordVerify = yield bcrypt.compare(password, findUser[0].password);
                if (passwordVerify) {
                    const token = yield (0, jws_1.generateToken)({
                        id: (_b = findUser[0]) === null || _b === void 0 ? void 0 : _b._id.toString(),
                    });
                    if (!((_c = findUser[0]) === null || _c === void 0 ? void 0 : _c.status)) {
                        res.status(200).send({
                            message: "",
                            user: findUser[0],
                            Status: true,
                            token: token,
                        });
                    }
                    else {
                        res.send({
                            message: "Admin blocked please sent email from admin",
                            Status: true,
                        });
                    }
                }
                else {
                    res.send({ message: " Password is wrong", Status: false });
                }
            }
            else {
                res.send({ message: "your signup not complete", Status: false });
            }
        }
        else {
            res.send({ message: "wrong Email", Status: false });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.userLogin = userLogin;
const addPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imageLinks, description, userId } = req.body;
        const post = yield new postSchema_1.default({
            userId,
            img: imageLinks,
            description,
        }).save();
        res.status(201).json({ status: true });
    }
    catch (error) {
        console.log(error);
    }
});
exports.addPost = addPost;
const getMyPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const allPost = yield postSchema_1.default.find({ userId });
        res.status(201).json({ status: true, allPost });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getMyPost = getMyPost;
const getMyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const useData = yield postSchema_1.default
            .find({ userId: userId })
            .populate("userId");
        res.status(201).json({ useData });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getMyProfile = getMyProfile;
const getAllPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const AllPosts = yield postSchema_1.default.find().populate("userId");
        res.status(201).json({ AllPosts });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllPosts = getAllPosts;
const getOnePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, PostId } = req.params;
    const Post = yield postSchema_1.default.find({ _id: PostId }).populate("userId");
    res.status(201).json({ Post });
});
exports.getOnePost = getOnePost;
const getFriendsAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const FriendsAccount = yield userSchema_1.default.find({ _id: userId });
        res.status(201).json({ FriendsAccount });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getFriendsAccount = getFriendsAccount;
const googleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name } = req.body;
        const user = yield userSchema_1.default.find({ email });
        if (user.length === 0) {
            const user = yield new userSchema_1.default({
                name: name,
                email: email,
                username: name,
            }).save();
            const token = yield (0, jws_1.generateToken)({ id: user._id.toString() });
            res.status(200).send({ token: token, user: user, Status: true });
        }
        else {
            const token = yield (0, jws_1.generateToken)({ id: user[0]._id.toString() });
            res.status(200).send({ token: token, user: user[0], Status: true });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.googleLogin = googleLogin;
const likePostReq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
    }
    catch (error) {
        console.log(error);
    }
});
exports.likePostReq = likePostReq;
const postComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        res.json({
            message: "commented posted successfully",
            success: true,
            comment: postComment,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.postComment = postComment;
const getComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
                    "author.ProfileImg": 1,
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
        return res.json({
            message: "comments fetched successfully",
            comments: comments,
            success: true,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getComment = getComment;
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const user = yield userSchema_1.default.find({ _id: userId });
        return res.json({
            message: "comments fetched successfully",
            user: user,
            success: true,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getUserData = getUserData;
const getUserAllPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const AllPosts = yield postSchema_1.default
            .find({ userId: userId })
            .populate("userId");
        res.json({
            message: "AllPosts fetched successfully",
            AllPosts: AllPosts,
            success: true,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getUserAllPost = getUserAllPost;
const updateUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const userId = req.body.userId;
        const user = yield userSchema_1.default.find({ username: req.body.userName });
        if (user.length === 0 || ((_d = user[0]) === null || _d === void 0 ? void 0 : _d._id) === userId) {
            userSchema_1.default.updateOne({ _id: userId }, {
                $set: {
                    username: req.body.username,
                    name: req.body.name,
                    phoneNo: req.body.phoneNo,
                    dob: req.body.dob,
                    country: req.body.country,
                    description: req.body.description,
                    city: req.body.city,
                    PostalCode: req.body.PostalCode,
                    ProfileImg: req.body.ProfileImg,
                    coverImg: req.body.coverImg,
                },
            }).then((data) => {
                if (data) {
                    if (data.modifiedCount > 0) {
                        return res.json({
                            message: "user data updated successfully",
                            success: true,
                        });
                    }
                    else {
                        return res.json({
                            message: "",
                            success: "noUpdates",
                        });
                    }
                }
                else {
                    return res.json({
                        message: "something is wrong",
                        success: false,
                    });
                }
            });
        }
        else {
            return res.json({
                message: "userName Exist",
                success: false,
            });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateUserData = updateUserData;
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g;
    try {
        const userId = req.body.userId;
        const followUserId = req.body.followId;
        const user = yield userSchema_1.default.findById(followUserId);
        const mainUser = yield userSchema_1.default.findById(userId);
        if (!user)
            res.json({ message: "no user", success: false });
        if (!mainUser)
            res.json({ message: "no user", success: false });
        if (user === null || user === void 0 ? void 0 : user.public) {
            if (!((_e = user === null || user === void 0 ? void 0 : user.Followers) === null || _e === void 0 ? void 0 : _e.includes(userId))) {
                yield user.updateOne({ $push: { Followers: userId } });
                yield (mainUser === null || mainUser === void 0 ? void 0 : mainUser.updateOne({ $push: { Following: userId } }));
                res.json({ message: "successfully followed user", success: true });
            }
            else {
                yield user.updateOne({ $pull: { Followers: userId } });
                yield (mainUser === null || mainUser === void 0 ? void 0 : mainUser.updateOne({ $pull: { Following: userId } }));
                res.json({ message: "successfully unFollowed user", success: true });
            }
        }
        else {
            if ((_f = user === null || user === void 0 ? void 0 : user.Followers) === null || _f === void 0 ? void 0 : _f.includes(userId)) {
                yield user.updateOne({ $pull: { Followers: userId } });
                yield (mainUser === null || mainUser === void 0 ? void 0 : mainUser.updateOne({ $pull: { Following: userId } }));
                res.json({ message: "successfully unFollowed user", success: true });
            }
            else {
                if (!((_g = user === null || user === void 0 ? void 0 : user.Requests) === null || _g === void 0 ? void 0 : _g.includes(userId))) {
                    yield (user === null || user === void 0 ? void 0 : user.updateOne({ $push: { Requests: userId } }));
                    res.json({ message: "successfully Requested user", success: true });
                }
                else {
                    yield user.updateOne({ $pull: { Requests: userId } });
                    res.json({
                        message: "successfully unRequested user",
                        success: true,
                    });
                }
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.followUser = followUser;
const getAllRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const Request = yield userSchema_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(userId),
                },
            },
            {
                $project: {
                    Requests: 1,
                },
            },
            {
                $unwind: {
                    path: "$Requests",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "Requests",
                    foreignField: "_id",
                    as: "Requests",
                },
            },
        ]);
        res.json({
            message: "get All Request",
            Request: Request,
            success: false,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllRequest = getAllRequest;
const acceptRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    try {
        const userId = req.body.userId;
        const acceptId = req.body.acceptId;
        const user = yield userSchema_1.default.findById(userId);
        const acceptUserId = yield userSchema_1.default.findById(acceptId);
        if (!acceptUserId)
            res.json({ message: "no user", success: false });
        if (!user)
            res.json({ message: "no user", success: false });
        if ((_h = user === null || user === void 0 ? void 0 : user.Requests) === null || _h === void 0 ? void 0 : _h.includes(acceptId)) {
            yield user.updateOne({ $pull: { Requests: acceptId } });
            yield user.updateOne({ $push: { Followers: acceptId } });
            yield (acceptUserId === null || acceptUserId === void 0 ? void 0 : acceptUserId.updateOne({ $push: { Following: acceptId } }));
        }
        res.json({ message: "success accepted user ", success: true });
    }
    catch (error) {
        console.log(error);
    }
});
exports.acceptRequest = acceptRequest;
const deleteRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _j;
    try {
        const userId = req.body.userId;
        const deleteId = req.params.deleteId;
        const user = yield userSchema_1.default.findById(userId);
        if (!user)
            res.json({ message: "no user", success: false });
        if ((_j = user === null || user === void 0 ? void 0 : user.Requests) === null || _j === void 0 ? void 0 : _j.includes(deleteId)) {
            yield user.updateOne({ $pull: { Requests: deleteId } });
            res.json({ message: "success delete request ", success: true });
        }
        else {
            res.json({ message: "something is wrong ", success: false });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteRequests = deleteRequests;
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield chatSchema_1.default.find({
            members: { $in: [req.body.senderId, req.body.receiverId] },
        });
        if (!chat) {
            const newChat = new chatSchema_1.default({
                members: [req.body.senderId, req.body.receiverId],
            });
            const result = yield newChat.save();
            res.status(200).json(result);
        }
        res.status(200).json("ok");
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.createChat = createChat;
const getChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield chatSchema_1.default.find({
            members: { $in: [req.params.userId] },
        });
        res.status(200).json(chat);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.getChat = getChat;
const chatFind = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield chatSchema_1.default.findOne({
            members: { $all: [req.params.firstId, req.params.secondId] },
        });
        res.status(200).json(chat);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.chatFind = chatFind;
const addMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId, senderId, text } = req.body;
    console.log(chatId);
    console.log(senderId);
    console.log(text);
    const message = new messageSchema_1.default({
        chatId,
        senderId,
        text,
    });
    try {
        const result = yield message.save();
        res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.addMessage = addMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chatId } = req.params;
    try {
        const result = yield messageSchema_1.default.find({ chatId });
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.getMessages = getMessages;
const likeMainComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    const { userId, commentId } = req.body;
    try {
        const comment = yield CommentSchema_1.default.findById(commentId);
        if (!comment)
            res.json({ message: "no comment", success: false });
        if (comment) {
            if ((_k = comment === null || comment === void 0 ? void 0 : comment.likes) === null || _k === void 0 ? void 0 : _k.includes(userId)) {
                yield comment.updateOne({ $pull: { likes: userId } });
                res.json({ message: "unLiked comment", success: true });
            }
            else {
                yield comment.updateOne({ $push: { likes: userId } });
                res.json({ message: "liked comment", success: true });
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.likeMainComment = likeMainComment;
const postReplayComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, commentId, newComment } = req.body;
    try {
        const postComment = new ReplayComment_1.default({
            userId,
            commentId,
            comment: newComment,
        });
        postComment.save();
        res.json({ message: "liked comment", comments: postComment, success: true });
    }
    catch (error) {
        console.log(error);
    }
});
exports.postReplayComment = postReplayComment;
const getReplayComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.commentId;
    try {
        const comments = yield ReplayComment_1.default.aggregate([
            {
                $match: {
                    commentId: new mongoose_1.default.Types.ObjectId(commentId),
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
                    "author.ProfileImg": 1,
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
        res.json({ message: "liked comment", comments: comments, success: true });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getReplayComment = getReplayComment;
const likeReplayComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _l;
    const { userId, commentId } = req.body;
    try {
        const comment = yield ReplayComment_1.default.findById(commentId);
        if (!comment)
            res.json({ message: "no comment", success: false });
        if (comment) {
            if ((_l = comment === null || comment === void 0 ? void 0 : comment.likes) === null || _l === void 0 ? void 0 : _l.includes(userId)) {
                yield comment.updateOne({ $pull: { likes: userId } });
                res.json({ message: "unLiked comment", success: true });
            }
            else {
                yield comment.updateOne({ $push: { likes: userId } });
                res.json({ message: "liked comment", success: true });
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.likeReplayComment = likeReplayComment;
