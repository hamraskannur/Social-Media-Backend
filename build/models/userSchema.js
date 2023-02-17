"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
    },
    Address: {
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
        type: Boolean,
        default: true
    }, PostalCode: {
        type: Number
    },
    Requests: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "post"
        }],
    Followers: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "post"
        }],
    Following: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "post"
        }],
    saved: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "post"
        }],
    description: {
        type: String
    },
    read: {
        type: Boolean
    },
    notification: [{
            postId: {
                type: mongoose_1.default.Types.ObjectId,
                ref: "post"
            },
            userId: {
                type: mongoose_1.default.Types.ObjectId,
                ref: "user"
            },
            text: {
                type: String
            }
        }]
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('user', userSchema);
