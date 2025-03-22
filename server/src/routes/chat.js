import express from "express";
import {
  handleChatMessage,
  getUserChats,
  getChat,
  chatWithAi,
  deleteChat,
  updateChatTitle,
} from "../controller/chatController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/", verifyToken, handleChatMessage);
router.get("/userchats", verifyToken, getUserChats);
router.get("/:id", verifyToken, getChat);
router.put("/:id", verifyToken, chatWithAi);
router.delete("/:id", verifyToken, deleteChat);
router.patch("/:id/title", verifyToken, updateChatTitle);

export default router;
