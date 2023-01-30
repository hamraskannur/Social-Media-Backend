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
exports.blockPost = exports.getAllBlockPost = exports.changeStatus = exports.getAllUser = exports.adminLogin = void 0;
const jws_1 = require("../utils/jws");
const userSchema_1 = __importDefault(require("../models/userSchema"));
const adminSchema_1 = __importDefault(require("../models/adminSchema"));
const postSchema_1 = __importDefault(require("../models/postSchema"));
const bcrypt = require("bcrypt");
const ReportSchema_1 = __importDefault(require("../models/ReportSchema"));
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userSignUpp = {
        Status: false,
        message: "",
        token: "",
    };
    try {
        const { email, password } = req.body;
        const Admin = yield adminSchema_1.default.find({ email });
        if (Admin.length > 0) {
            const passwordVerify = yield bcrypt.compare(password, (_a = Admin[0]) === null || _a === void 0 ? void 0 : _a.password);
            if (passwordVerify) {
                const token = yield (0, jws_1.generateToken)({ id: (_b = Admin[0]) === null || _b === void 0 ? void 0 : _b._id.toString() });
                userSignUpp.Status = true;
                userSignUpp.token = token;
                res.status(200).send({ userSignUpp });
            }
            else {
                userSignUpp.message = "your password wrong";
                userSignUpp.Status = false;
                res.send({ userSignUpp });
            }
        }
        else {
            userSignUpp.message = "your Email wrong";
            userSignUpp.Status = false;
            res.send({ userSignUpp });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.adminLogin = adminLogin;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Users = yield userSchema_1.default.find({ verified: true });
        res.send({ Users });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllUser = getAllUser;
const changeStatus = (req, res) => {
    const { Status, userId } = req.params;
    try {
        void userSchema_1.default
            .updateOne({ _id: userId }, {
            $set: {
                status: Status,
            },
        })
            .then((date) => {
            res.status(200).send({ Status: true });
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.changeStatus = changeStatus;
const getAllBlockPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allPost = yield ReportSchema_1.default.find()
            .populate("PostId")
            .populate("userText.userId");
        res.status(200).send({ Status: true, Posts: allPost });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getAllBlockPost = getAllBlockPost;
const blockPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { PostId, status } = req.body;
        yield postSchema_1.default.findByIdAndUpdate({
            PostId,
        }, {
            $set: {
                status: status,
            },
        });
        res.status(200).send({ Status: true });
    }
    catch (error) {
        console.log(error);
    }
});
exports.blockPost = blockPost;
