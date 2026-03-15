import { Router } from "express";

import {
  getMessagesController,
  getMessageController,
  createMessageController,
  updateMessageController,
  deleteMessageController,
} from "./messages.controller";
import { requireAuth } from "@/core";

const router = Router();

router.use(requireAuth);
router.get("/", getMessagesController);
router.get("/:id", getMessageController);
router.post("/", createMessageController);
router.put("/:id", updateMessageController);
router.delete("/:id", deleteMessageController);

export default router;
