import { Router } from "express";
import { uploadVideo } from "../controllers/video";
const router: Router = Router();

const authMiddleware = require("../middleware/authMiddleware");

router.post("/uploadVideo", authMiddleware,uploadVideo );



module.exports = router;