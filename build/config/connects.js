"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongooseConnect = process.env.MONGO_URL;
if (mongooseConnect) {
    mongoose_1.default.connect(mongooseConnect);
}
mongoose_1.default.Promise = global.Promise;
const connection = mongoose_1.default.connection;
connection.on('connected', () => {
    console.log('Mongodb is connected');
});
connection.on('error', (err) => {
    console.log('error in  mongodb connection', err);
});
module.exports = mongoose_1.default;
