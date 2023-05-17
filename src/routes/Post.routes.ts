import { Router } from "express";

import * as PostController from "../controllers/PostController";
import { auth } from "../middlewares/auth";

const router = Router();

router.get("/", PostController.getPosts);
router.post("/", auth, PostController.createPost);
router.get("/my-posts", PostController.getMyPosts);
router.put("/like", auth, PostController.likePost);
router.put("/unlike", auth, PostController.unlikePost);
router.put("/comment", auth, PostController.commentPost);
router.delete(
  "/comment/:postId/:commentId",
  auth,
  PostController.deleteComment
);
router.delete("/delete-post/:postId", auth, PostController.deletePost);

export default router;
