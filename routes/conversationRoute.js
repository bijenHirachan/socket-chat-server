import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  createGroupChat,
  getConversations,
  getSingleConversation,
  leaveConversation,
  createChat,
} from "../controllers/conversationController.js";

const router = express.Router();

router.route("/groupchat").post(isAuthenticated, createGroupChat);
router.route("/chat").post(isAuthenticated, createChat);
router.route("/conversations").get(isAuthenticated, getConversations);
router
  .route("/conversations/:id")
  .get(isAuthenticated, getSingleConversation)
  .put(isAuthenticated, leaveConversation);

export default router;
