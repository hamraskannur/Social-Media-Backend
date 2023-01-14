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
exports.nodemailer = void 0;
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-var-requires */
const token_1 = __importDefault(require("../models/token"));
const crypto = require('crypto');
const sentEmail_1 = require("./sentEmail");
const nodemailer = (id, email) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("koko");
    console.log(email);
    console.log(id);
    const userToken = yield new token_1.default({
        userId: id,
        token: crypto.randomBytes(32).toString('hex')
    }).save();
    console.log(userToken.token);
    const url = `${process.env.BASE_URL}verify/${id}/${userToken.token}`;
    (0, sentEmail_1.sendEmail)(email, 'verify Email', url);
});
exports.nodemailer = nodemailer;
