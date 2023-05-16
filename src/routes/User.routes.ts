import { Router } from "express";

import * as UserController from "../controllers/UserController";

const router = Router();

router.get("/:id", UserController.getUserProfile);
router.put("/follow", UserController.followUser);
router.put("/unfollow", UserController.unfollowUser);
router.put("/update", UserController.updateUserProfile);

export default router;