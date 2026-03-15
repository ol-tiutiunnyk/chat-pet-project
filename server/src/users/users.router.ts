import { Router } from "express";
import { registerController, getUsersController } from "./users.controller";
import { loginController, logoutController, getUserController } from "./auth.controller";
import { requireAuth } from "@/core";

const router = Router();

router.post("/register", registerController);
router.post("/login", loginController);
router.get("/is-auth", getUserController);

router.use(requireAuth);
router.post("/logout", logoutController);
router.get("/", getUsersController);

export default router;
