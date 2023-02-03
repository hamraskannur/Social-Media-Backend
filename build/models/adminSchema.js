"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    read: {
        type: Boolean
    },
    notification: [{
            userId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "user"
            },
            text: {
                type: String
            }
        }]
});
exports.default = (0, mongoose_1.model)('admin', adminSchema);
