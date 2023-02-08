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
exports.getMessages = exports.addMessage = exports.chatFind = exports.getChat = exports.createChat = void 0;
const chatSchema_1 = __importDefault(require("../models/chatSchema"));
const messageSchema_1 = __importDefault(require("../models/messageSchema"));
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chat = yield chatSchema_1.default.findOne({
            members: [req.body.senderId, req.body.receiverId],
        });
        if (!chat) {
            const newChat = new chatSchema_1.default({
                members: [req.body.senderId, req.body.receiverId],
            });
            const result = yield newChat.save();
            return res.status(200).json(result);
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
