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
exports.shortsReplayComment = exports.likeShortsMainComment = exports.postShortsComment = exports.getShortComment = exports.deleteShort = exports.likeShortReq = exports.getAllVideo = exports.uploadVideo = void 0;
const videoSchema_1 = __importDefault(require("../models/videoSchema"));
const videoCommentSchema_1 = __importDefault(require("../models/videoCommentSchema"));
const mongoose_1 = __importDefault(require("mongoose"));
const uploadVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imageLinks, description, userId } = req.body;
        const post = yield new videoSchema_1.default({
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
exports.uploadVideo = uploadVideo;
const getAllVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const AllPosts = yield videoSchema_1.default.find().populate("userId");
        res.status(201).json({ AllPosts });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllVideo = getAllVideo;
const likeShortReq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const postId = req.params.postId;
        const short = yield videoSchema_1.default.findById(postId);
        if (!short) {
            return res.json({ Message: "post not fount", success: false });
        }
        if (!short.likes.includes(userId)) {
            yield short.updateOne({ $push: { likes: userId } });
            return res.json({ Message: "post liked successfully", success: true });
        }
        else {
            yield short.updateOne({ $pull: { likes: userId } });
            return res.json({ Message: "post liked successfully", success: true });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.likeShortReq = likeShortReq;
const deleteShort = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.postId;
    try {
        const response = yield videoSchema_1.default.findByIdAndDelete({ _id: postId });
        res.status(200).json({ success: true, message: "deleted post" });
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteShort = deleteShort;
const getShortComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.postId;
        console.log(postId);
        const comments = yield videoCommentSchema_1.default.find({ postId: new mongoose_1.default.Types.ObjectId(postId) }).populate('userId').populate('replayComment.userId');
        console.log(comments);
        // const comments = await videoCommentSchema.aggregate([
        //   {
        //     $match: {
        //       postId: new mongoose.Types.ObjectId(postId),
        //     },
        //   },
        //   {
        //     $lookup: {
        //       from: "users",
        //       localField: "userId",
        //       foreignField: "_id",
        //       as: "author",
        //     },
        //   },
        //   {
        //     $unwind: {
        //       path: "$author",
        //     },
        //   },
        //   {
        //     $project: {
        //       _id: 1,
        //       userId: 1,
        //       postId: 1,
        //       comment: 1,
        //       likes: 1,
        //       replayComment:1,
        //       createdAt: 1,
        //       "author.username": 1,
        //       "author.ProfileImg": 1,
        //     },
        //   },
        //   {
        //     $replaceRoot: {
        //       newRoot: {
        //         $mergeObjects: ["$$ROOT", "$author"],
        //       },
        //     },
        //   },
        //   {
        //     $project: {
        //       author: 0,
        //     },
        //   },
        //   {
        //     $sort: {
        //       createdAt: -1,
        //     },
        //   },
        // ]);
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
exports.getShortComment = getShortComment;
const postShortsComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = req.body.comment;
    const userId = req.body.userId;
    const postId = req.params.postId;
    try {
        const post = yield videoSchema_1.default.findById(postId);
        if (!post) {
            return res.json({ message: "post not found", success: false });
        }
        const postComment = new videoCommentSchema_1.default({
            userId,
            postId,
            comment,
        });
        yield postComment.save();
        yield videoCommentSchema_1.default.populate(postComment, {
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
exports.postShortsComment = postShortsComment;
const likeShortsMainComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId, commentId } = req.body;
    try {
        const comment = yield videoCommentSchema_1.default.findById(commentId);
        if (!comment)
            res.json({ message: "no comment", success: false });
        if (comment) {
            if ((_a = comment === null || comment === void 0 ? void 0 : comment.likes) === null || _a === void 0 ? void 0 : _a.includes(userId)) {
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
exports.likeShortsMainComment = likeShortsMainComment;
const shortsReplayComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { userId, commentId, newComment } = req.body;
    try {
        const comment = yield videoCommentSchema_1.default.findOne({
            _id: new mongoose_1.default.Types.ObjectId(commentId),
        });
        if (comment) {
            (_b = comment === null || comment === void 0 ? void 0 : comment.replayComment) === null || _b === void 0 ? void 0 : _b.push({
                userId,
                comment: newComment,
                likes: []
            });
            comment.save();
        }
        res.json({
            message: "liked comment",
            comments: newComment,
            success: true,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.shortsReplayComment = shortsReplayComment;
