"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
    },
    phoneNo: {
        type: Number,
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
    },
    verified: {
        type: Boolean,
        default: false
    },
    status: {
        type: Boolean,
        default: false
    },
    place: {
        type: String
    },
    country: {
        type: String
    },
    img: {
        type: String
    },
    public: {
        type: Boolean
    }
});
exports.default = (0, mongoose_1.model)('user', userSchema);
