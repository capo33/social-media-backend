import { Router } from "express";

import * as UserController from "../controllers/UserController";
import { auth } from "../middlewares/auth";

const router = Router();

router.get("/allusers", UserController.getAllUsers);
router.get("/:id", UserController.getUserProfile);
router.put("/follow", auth, UserController.followUser);
router.put("/unfollow", auth, UserController.unfollowUser);
router.put("/update", UserController.updateUserProfile);

export default router;
