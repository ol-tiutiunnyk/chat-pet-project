import { Router } from "express";
import {
  getConversationsController,
  getConversationController,
  createConversationController,
  updateConversationController,
  deleteConversationController,
} from "./conversations.controller";
import { requireAuth } from "../core";

const router = Router();

router.use(requireAuth);
router.get("/", getConversationsController);
router.get("/:id", getConversationController);
router.post("/", createConversationController);
router.put("/:id", updateConversationController);
router.delete("/:id", deleteConversationController);

export default router;
