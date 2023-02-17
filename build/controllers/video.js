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
exports.getUserAllShorts = exports.getAllVideo = exports.uploadVideo = void 0;
const photoSchema_1 = __importDefault(require("../models/photoSchema"));
const uploadVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imageLinks, description, userId } = req.body;
        const post = yield new photoSchema_1.default({
            userId,
            shorts: imageLinks,
            description,
        }).save();
        res.status(201).json({ status: true });
    }
    catch (error) {
        next(error);
    }
});
exports.uploadVideo = uploadVideo;
const getAllVideo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const AllPosts = yield photoSchema_1.default
            .find({ shorts: { $ne: null } })
            .populate("userId", { username: 1, name: 1, _id: 1, ProfileImg: 1, public: 1, Followers: 1 });
        res.status(201).json({ AllPosts });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllVideo = getAllVideo;
const getUserAllShorts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const AllPosts = yield photoSchema_1.default
            .find({ userId: userId, shorts: { $ne: null } })
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
