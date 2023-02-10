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
exports.getUserAllShorts = exports.reportPost = exports.editPost = exports.deletePost = exports.getSavedPost = exports.savePost = exports.likeReplayComment = exports.getReplayComment = exports.postReplayComment = exports.likeMainComment = exports.getUserAllPost = exports.getComment = exports.postComment = exports.likePostReq = exports.getOnePost = exports.getAllPosts = exports.addPost = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const photoSchema_1 = __importDefault(require("../models/photoSchema"));
const CommentSchema_1 = __importDefault(require("../models/CommentSchema"));
const ReplayComment_1 = __importDefault(require("../models/ReplayComment"));
const userSchema_1 = __importDefault(require("../models/userSchema"));
const ReportSchema_1 = __importDefault(require("../models/ReportSchema"));
const adminSchema_1 = __importDefault(require("../models/adminSchema"));
const addPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imageLinks, description, userId } = req.body;
        const post = yield new photoSchema_1.default({
            userId,
            img: imageLinks,
            description,
        }).save();
        res.status(201).json({ status: true });
    }
    catch (error) {
        next(error);
    }
});
exports.addPost = addPost;
const getAllPosts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const AllPosts = yield photoSchema_1.default
            .find({ shorts: null })
            .populate("userId", { username: 1, name: 1, _id: 1, ProfileImg: 1, public: 1, Followers: 1 });
        console.log(AllPosts);
        res.status(201).json({ AllPosts });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllPosts = getAllPosts;
const getOnePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { postId } = req.params;
        const Post = yield photoSchema_1.default.findOne({ _id: postId }).populate("userId");
        res.status(201).json({ Post });
    }
    catch (error) {
        next(error);
    }
});
exports.getOnePost = getOnePost;
const likePostReq = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const postId = req.params.postId;
        const post = yield photoSchema_1.default.findById(postId);
        if (!post) {
            return res.json({ Message: "post not fount", success: false });
        }
        if (!post.likes.includes(userId)) {
            yield post.updateOne({ $push: { likes: userId } });
            if (req.body.userId != post.userId) {
                yield userSchema_1.default.findOneAndUpdate({ _id: post.userId }, {
                    $push: {
                        notification: {
                            postId: post._id,
                            userId: userId,
                            text: "liked post",
                            read: false
                        }
                    },
                    $set: { read: true },
                });
            }
            return res.json({ Message: "post liked successfully", success: true });
        }
        else {
            yield post.updateOne({ $pull: { likes: userId } });
            return res.json({ Message: "post liked successfully", success: true });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.likePostReq = likePostReq;
const postComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = req.body.comment;
    const userId = req.body.userId;
    const postId = req.params.postId;
    try {
        const post = yield photoSchema_1.default.findById(postId);
        if (!post) {
            return res.json({ message: "post not found", success: false });
        }
        const postComment = new CommentSchema_1.default({
            userId,
            postId,
            comment,
        });
        yield postComment.save();
        if (req.body.userId != post.userId) {
            yield userSchema_1.default.findOneAndUpdate({ _id: post.userId }, {
                $push: {
                    notification: {
                        postId: postId,
                        userId: userId,
                        text: " commented you post",
                        read: false
                    }
                },
                $set: { read: true },
            });
        }
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
        next(error);
    }
});
exports.postComment = postComment;
const getComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        next(error);
    }
});
exports.getComment = getComment;
const getUserAllPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const AllPosts = yield photoSchema_1.default
            .find({ userId: userId, shorts: null })
            .populate("userId");
        res.json({
            message: "AllPosts fetched successfully",
            AllPosts: AllPosts,
            success: true,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserAllPost = getUserAllPost;
const likeMainComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId, commentId } = req.body;
    try {
        const comment = yield CommentSchema_1.default.findById(commentId);
        if (!comment)
            res.json({ message: "no comment", success: false });
        if (comment) {
            if ((_a = comment === null || comment === void 0 ? void 0 : comment.likes) === null || _a === void 0 ? void 0 : _a.includes(userId)) {
                yield comment.updateOne({ $pull: { likes: userId } });
                res.json({ message: "unLiked comment", success: true });
            }
            else {
                if (req.body.userId != comment.userId) {
                    yield userSchema_1.default.findOneAndUpdate({ _id: comment.userId }, {
                        $push: {
                            notification: {
                                postId: comment.postId,
                                userId: userId,
                                text: "liked your comment",
                                read: false
                            }
                        },
                        $set: { read: true },
                    });
                }
                yield comment.updateOne({ $push: { likes: userId } });
                res.json({ message: "liked comment", success: true });
            }
        }
    }
    catch (error) {
        next(error);
    }
});
exports.likeMainComment = likeMainComment;
const postReplayComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, commentId, newComment } = req.body;
    try {
        const postComment = new ReplayComment_1.default({
            userId,
            commentId,
            comment: newComment,
        });
        postComment.save();
        res.json({
            message: "liked comment",
            comments: postComment,
            success: true,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.postReplayComment = postReplayComment;
const getReplayComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        next(error);
    }
});
exports.getReplayComment = getReplayComment;
const likeReplayComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { userId, commentId } = req.body;
    try {
        const comment = yield ReplayComment_1.default.findById(commentId);
        if (!comment)
            res.json({ message: "no comment", success: false });
        if (comment) {
            if ((_b = comment === null || comment === void 0 ? void 0 : comment.likes) === null || _b === void 0 ? void 0 : _b.includes(userId)) {
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
        next(error);
    }
});
exports.likeReplayComment = likeReplayComment;
const savePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const { postId, userId } = req.body;
        const user = yield userSchema_1.default.findById(userId);
        if (user) {
            if (!user.saved.includes(postId)) {
                yield user.updateOne({
                    $push: { saved: new mongoose_1.default.Types.ObjectId(postId) },
                });
                res.json({ Message: "post saved successfully", success: true });
            }
            else {
                yield user.updateOne({
                    $pull: { saved: new mongoose_1.default.Types.ObjectId(postId) },
                });
                res.json({ Message: "post unsaved successfully", success: true });
            }
        }
        else {
            res.json({ noUser: true });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.savePost = savePost;
const getSavedPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const result = yield userSchema_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(userId),
                },
            },
            {
                $project: {
                    password: 0,
                },
            },
            {
                $unwind: {
                    path: "$saved",
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "saved",
                    foreignField: "_id",
                    as: "post",
                },
            },
            {
                $unwind: {
                    path: "$post",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "post.userId",
                    foreignField: "_id",
                    as: "userId",
                },
            },
            {
                $unwind: {
                    path: "$userId",
                },
            },
        ]);
        res.status(200).json(result);
    }
    catch (error) {
        next(error);
    }
});
exports.getSavedPost = getSavedPost;
const deletePost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    try {
        const response = yield photoSchema_1.default.findByIdAndDelete({ _id: postId });
        res.status(200).json({ success: true, message: "deleted post" });
    }
    catch (error) {
        next(error);
    }
});
exports.deletePost = deletePost;
const editPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postData = req.body;
        yield photoSchema_1.default.updateOne({ _id: req.body.postId }, {
            $set: {
                edit: true,
                description: req.body.newDescription,
            },
        });
        res.status(200).json({
            success: true,
            newDescription: req.body.newDescription,
            message: "Edited post",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.editPost = editPost;
const reportPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const report = yield ReportSchema_1.default.findOne({
        PostId: new mongoose_1.default.Types.ObjectId(req.body.postId),
    });
    if (report) {
        (_c = report === null || report === void 0 ? void 0 : report.userText) === null || _c === void 0 ? void 0 : _c.push({
            userId: new mongoose_1.default.Types.ObjectId(req.body.userId),
            text: req.body.newDescription,
        });
        yield adminSchema_1.default.findOneAndUpdate({ username: "admin" }, {
            $push: {
                notification: { userId: req.body.userId, text: "reported post" },
            },
            $set: { read: true },
        });
        report.save();
        res.status(200).json({
            success: true,
            message: "report post",
        });
    }
    else {
        yield new ReportSchema_1.default({
            PostId: req.body.postId,
            userText: [
                {
                    userId: new mongoose_1.default.Types.ObjectId(req.body.userId),
                    text: req.body.newDescription,
                },
            ],
        }).save();
        yield adminSchema_1.default.findOneAndUpdate({ username: "admin" }, {
            $push: {
                notification: { userId: req.body.userId, text: "reported post" },
            },
            $set: { read: true },
        });
        res.status(200).json({
            success: true,
            newDescription: req.body.newDescription,
            message: "report post",
        });
    }
});
exports.reportPost = reportPost;
const getUserAllShorts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const AllPosts = yield photoSchema_1.default
            .find({ userId: userId, shorts: { $exists: true } })
            .populate("userId");
        res.json({
            message: "AllPosts fetched successfully",
            AllPosts: AllPosts,
            success: true,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserAllShorts = getUserAllShorts;
