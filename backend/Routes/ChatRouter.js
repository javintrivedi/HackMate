import express from "express";
import isAuthenticated from "../Middlewares/Auth.js";
import { getChatByUser } from "../Controllers/ChatController.js";

const router = express.Router();

// GET chat with a matched user
router.get("/:otherUserId", isAuthenticated, getChatByUser);

export default router;