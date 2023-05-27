import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.route("/message").post(isAuthenticated, sendMessage);

export default router;
