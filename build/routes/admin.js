"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const admin_1 = require("../controllers/admin");
const router = express_1.default.Router();
const authMiddleware = require('../middleware/authMiddleware');
router.post('/login', admin_1.adminLogin);
router.get('/getAllUser', admin_1.getAllUser);
router.get('/changeStatus/:Status/:userId', admin_1.changeStatus);
router.get('/getAllBlockPost', admin_1.getAllBlockPost);
router.put('/blockPost/', admin_1.blockPost);
module.exports = router;
