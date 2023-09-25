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
exports.suggestionUsers = exports.getAllNotifications = exports.searchUser = exports.changeToPrivate = exports.getFollowersUser = exports.getFollowingUser = exports.deleteRequests = exports.acceptRequest = exports.getAllRequest = exports.followUser = exports.updateUserData = exports.getUserData = exports.googleLogin = exports.getFriendsAccount = exports.getMyProfile = exports.getMyPost = exports.userLogin = exports.verify = exports.postSignup = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt = require("bcrypt");
const jws_1 = require("../utils/jws");
const userSchema_1 = __importDefault(require("../models/userSchema"));
const photoSchema_1 = __importDefault(require("../models/photoSchema"));
const token_1 = __importDefault(require("../models/token"));
const nodemailer_1 = require("../utils/nodemailer");
const saltRounds = 10;
const postSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let status = false;
    let message = '';
    try {
        const { name, email, password, username } = req.body;
        const user = yield userSchema_1.default.findOne({ email });
        if (user) {
            if (user.verified === false) {
                (0, nodemailer_1.nodemailer)(user.id, email);
                message = "An Email resent to your account please verify";
                status = true;
                return res.status(201).json({ message, status });
            }
            message = "Email Exist";
            res.json({ message, status });
        }
        else {
            const userName = yield userSchema_1.default.find({ username });
            if (userName.length > 0) {
                message = "userName Exist";
                return res.json({ message, status });
            }
            const user = yield new userSchema_1.default({
                username,
                name,
                email,
                password: yield bcrypt.hash(password, saltRounds),
            }).save();
            yield (0, nodemailer_1.nodemailer)(user.id, user.email);
            message = "An Email sent to your account please verify";
            status = true;
            res.status(201).json({ message, status });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.postSignup = postSignup;
const verify = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const Verify = {
        Status: false,
        message: "",
    };
    try {
        const user = yield userSchema_1.default.findOne({ _id: req.params.id });
        Verify.message = "Invalid link";
        if (user == null)
            return res.status(200).send({ Verify });
        const Token = yield token_1.default.findOne({
            userId: user._id,
            token: req.params.token,
        });
        Verify.message = "Invalid link";
        if (token_1.default == null)
            return res.status(200).send({ Verify });
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
        next(error);
    }
});
exports.verify = verify;
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const findUser = yield userSchema_1.default.findOne({ email });
        if (findUser) {
            if (findUser.verified === true) {
                const passwordVerify = yield bcrypt.compare(password, findUser.password);
                if (passwordVerify) {
                    const token = yield (0, jws_1.generateToken)({
                        id: findUser._id.toString(),
                    });
                    if (!findUser.status) {
                        res.status(200).send({
                            message: "",
                            user: findUser,
                            Status: true,
                            token: token,
                        });
                    }
                    else {
                        res.send({
                            message: "Admin blocked please sent email from admin",
                            Status: false,
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
        next(error);
    }
});
exports.userLogin = userLogin;
const getMyPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const allPost = yield photoSchema_1.default.find({ userId });
        res.status(201).json({ status: true, allPost });
    }
    catch (error) {
        next(error);
    }
});
exports.getMyPost = getMyPost;
const getMyProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const useData = yield photoSchema_1.default
            .find({ userId: userId })
            .populate("userId", { username: 1, name: 1, _id: 1, ProfileImg: 1 });
        res.status(201).json({ useData });
    }
    catch (error) {
        next(error);
    }
});
exports.getMyProfile = getMyProfile;
const getFriendsAccount = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const FriendsAccount = yield userSchema_1.default.find({ _id: userId }).select('-password');
        res.status(201).json({ FriendsAccount });
    }
    catch (error) {
        next(error);
    }
});
exports.getFriendsAccount = getFriendsAccount;
const googleLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        next(error);
    }
});
exports.googleLogin = googleLogin;
const getUserData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const user = yield userSchema_1.default.findById(userId).select('-password');
        return res.json({
            message: "comments fetched successfully",
            user: user,
            success: true,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserData = getUserData;
const updateUserData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = req.body.userId;
        const user = yield userSchema_1.default.find({ username: req.body.userName });
        if (user.length === 0 || ((_a = user[0]) === null || _a === void 0 ? void 0 : _a._id) === userId) {
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
        next(error);
    }
});
exports.updateUserData = updateUserData;
const followUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
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
            if (!((_b = user === null || user === void 0 ? void 0 : user.Followers) === null || _b === void 0 ? void 0 : _b.includes(userId))) {
                yield userSchema_1.default.findOneAndUpdate({ _id: user._id }, {
                    $push: {
                        notification: {
                            postId: userId,
                            userId: userId,
                            text: "start Followed you",
                            read: false,
                        },
                    },
                });
                yield user.updateOne({ $push: { Followers: mainUser === null || mainUser === void 0 ? void 0 : mainUser._id } });
                yield (mainUser === null || mainUser === void 0 ? void 0 : mainUser.updateOne({ $push: { Following: user._id } }));
                res.json({ message: "successfully followed user", success: true });
            }
            else {
                yield user.updateOne({ $pull: { Followers: mainUser === null || mainUser === void 0 ? void 0 : mainUser._id } });
                yield (mainUser === null || mainUser === void 0 ? void 0 : mainUser.updateOne({ $pull: { Following: user._id } }));
                res.json({ message: "successfully unFollowed user", success: true });
            }
        }
        else {
            if ((_c = user === null || user === void 0 ? void 0 : user.Followers) === null || _c === void 0 ? void 0 : _c.includes(userId)) {
                yield user.updateOne({ $pull: { Followers: userId } });
                yield (mainUser === null || mainUser === void 0 ? void 0 : mainUser.updateOne({ $pull: { Following: userId } }));
                res.json({ message: "successfully unFollowed user", success: true });
            }
            else {
                if (!((_d = user === null || user === void 0 ? void 0 : user.Requests) === null || _d === void 0 ? void 0 : _d.includes(userId))) {
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
        next(error);
    }
});
exports.followUser = followUser;
const getAllRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        next(error);
    }
});
exports.getAllRequest = getAllRequest;
const acceptRequest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const userId = req.body.userId;
        const acceptId = req.body.acceptId;
        const user = yield userSchema_1.default.findById(userId);
        const acceptUserId = yield userSchema_1.default.findById(acceptId);
        if (!acceptUserId)
            res.json({ message: "no user", success: false });
        if (!user)
            res.json({ message: "no user", success: false });
        if ((_e = user === null || user === void 0 ? void 0 : user.Requests) === null || _e === void 0 ? void 0 : _e.includes(acceptId)) {
            yield userSchema_1.default.findOneAndUpdate({ _id: acceptId }, {
                $push: {
                    notification: {
                        userId: userId,
                        text: " accepted you request",
                        read: false,
                    },
                },
            });
            yield user.updateOne({ $pull: { Requests: acceptId } });
            yield user.updateOne({ $push: { Followers: acceptId } });
            yield (acceptUserId === null || acceptUserId === void 0 ? void 0 : acceptUserId.updateOne({ $push: { Following: userId } }));
        }
        res.json({ message: "success accepted user ", success: true });
    }
    catch (error) {
        next(error);
    }
});
exports.acceptRequest = acceptRequest;
const deleteRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    try {
        const userId = req.body.userId;
        const deleteId = req.params.deleteId;
        const user = yield userSchema_1.default.findById(userId);
        if (!user)
            res.json({ message: "no user", success: false });
        if ((_f = user === null || user === void 0 ? void 0 : user.Requests) === null || _f === void 0 ? void 0 : _f.includes(deleteId)) {
            yield user.updateOne({ $pull: { Requests: deleteId } });
            res.json({ message: "success delete request ", success: true });
        }
        else {
            res.json({ message: "something is wrong ", success: false });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.deleteRequests = deleteRequests;
const getFollowingUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userSchema_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(req.params.userId),
                },
            },
            {
                $project: {
                    Following: 1,
                },
            },
            {
                $unwind: {
                    path: "$Following",
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "Following",
                    foreignField: "_id",
                    as: "result",
                },
            },
            {
                $project: {
                    result: { $arrayElemAt: ["$result", 0] },
                },
            },
            {
                $project: {
                    "result.name": 1,
                    "result.ProfileImg": 1,
                    "result.username": 1,
                    "result._id": 1,
                },
            },
        ]);
        res.json({ message: "successfully", user: user });
    }
    catch (error) {
        next(error);
    }
});
exports.getFollowingUser = getFollowingUser;
const getFollowersUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.userId;
        const user = yield userSchema_1.default.aggregate([
            {
                $match: {
                    _id: new mongoose_1.default.Types.ObjectId(req.params.userId),
                },
            },
            {
                $project: {
                    Followers: 1,
                },
            },
            {
                $unwind: {
                    path: "$Followers",
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "Followers",
                    foreignField: "_id",
                    as: "result",
                },
            },
            {
                $project: {
                    result: { $arrayElemAt: ["$result", 0] },
                },
            },
            {
                $project: {
                    "result.name": 1,
                    "result.ProfileImg": 1,
                    "result.username": 1,
                    "result._id": 1,
                },
            },
        ]);
        res.json({ message: "successfully", user: user });
    }
    catch (error) {
        next(error);
    }
});
exports.getFollowersUser = getFollowersUser;
const changeToPrivate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.userId;
    userSchema_1.default.updateOne({ _id: userId }, {
        $set: {
            public: req.body.checked,
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
});
exports.changeToPrivate = changeToPrivate;
const searchUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchData: searchExpression } = req.body;
        const searchData = yield userSchema_1.default.find({
            username: { $regex: searchExpression, $options: "i" },
        });
        if (searchData) {
            res.status(200).json(searchData);
        }
        else {
            res.status(404).json({ noUsers: true });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.searchUser = searchUser;
const getAllNotifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    try {
        const user = yield userSchema_1.default.find({ _id: req.body.userId }).populate("notification.userId", { username: 1, name: 1, _id: 1, ProfileImg: 1 });
        if (user) {
            yield userSchema_1.default.updateOne({ _id: req.body.userId }, {
                $set: {
                    read: false,
                },
            });
            res.status(200).send({ Status: true, user: (_g = user[0]) === null || _g === void 0 ? void 0 : _g.notification });
        }
        else {
            res.status(200).send({ Status: false });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.getAllNotifications = getAllNotifications;
const suggestionUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body.userId;
        const user = yield userSchema_1.default.findOne({ _id: userId });
        if (!user)
            return;
        const notFollowedUsers = yield userSchema_1.default.aggregate([
            {
                $match: {
                    $and: [
                        { _id: { $nin: user.Following } },
                        { _id: { $ne: userId } },
                        { verified: true }
                    ]
                },
            },
            { $sample: { size: 5 } },
        ]);
        res.status(200).send({ Status: true, notFollowedUsers: notFollowedUsers });
    }
    catch (error) {
        next(error);
    }
});
exports.suggestionUsers = suggestionUsers;
