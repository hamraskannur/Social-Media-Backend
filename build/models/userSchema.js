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
    city: {
        type: String
    },
    country: {
        type: String
    },
    ProfileImg: {
        type: String
    },
    coverImg: {
        type: String
    },
    public: {
        type: Boolean
    }, PostalCode: {
        type: Number
    },
    Requests: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "user"
        }],
    Followers: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "user"
        }],
    Following: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "user"
        }]
});
exports.default = (0, mongoose_1.model)('user', userSchema);
