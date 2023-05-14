import { Router } from "express";

import * as AuthController from "../controllers/AuthController";
import { auth } from "../middlewares/auth";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/profile", auth, AuthController.profile);

export default router;