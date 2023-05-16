import { Request, Response } from "express";

import PostModel from "../models/Post";

// @desc    Get all posts
// @route   GET /api/v1/posts
// @access  Public
const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find({})
      .populate("postedBy", "_id name")
      .populate("comments.postedBy", "_id name")
      .sort({ date: -1 });

    res.status(200).json(posts);
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ message: err.message });
  }
};

// @desc    Create a post
// @route   POST /api/v1/posts
// @access  Private
const createPost = async (req: Request, res: Response) => {
  const { title, description, image } = req.body;
  try {
    // Check if all fields are provided
    if (!title || !description || !image) {
      return res.status(422).json({ message: "Please add all the fields" });
    }

    const post = await PostModel.create({
      title,
      description,
      image,
      postedBy: req.user,
    });
    res.status(201).json({
      message: "Post created successfully",
      result: post,
    });
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ message: err.message });
  }
};

// @desc    Get all posts by a user
// @route   GET /api/v1/posts/my-posts
// @access  Private
const getMyPosts = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find({ postedBy: req.user?._id })
      .populate("postedBy", "_id name")
      .sort({ date: -1 });
    if (!posts) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json(posts);
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ message: err.message });
  }
};

// @desc    Like a post
// @route   PUT /api/v1/posts/like
// @access  Private
const likePost = async (req: Request, res: Response) => {
  try {
    const post = await PostModel.findByIdAndUpdate(
      req.body.postId,
      {
        // we use $addToSet to avoid duplicates
        // $addToSet: { likes: req.user._id },
        // we are pushing in the likes array the ID of the user who currently is logged in that only the logged in user can like a post
        $push: { likes: req.user?._id },
      },
      {
        new: true,
      }
    );
    res.status(200).json(post);
  } catch (error) {
    if (error instanceof Error)
      res.status(400).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
  }
};

// @desc    Unlike a post
// @route   PUT /api/v1/posts/unlike
// @access  Private
const unlikePost = async (req: Request, res: Response) => {
  try {
    const post = await PostModel.findByIdAndUpdate(
      req.body.postId,
      {
        // we use $pull to remove the user ID from the likes array
        $pull: { likes: req.user?._id },
      },
      {
        new: true,
      }
    );
    res.status(200).json(post);
  } catch (error) {
    if (error instanceof Error)
      res.status(400).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
  }
};

// @desc    Comment on a post
// @route   PUT /api/v1/posts/comment
// @access  Private
const commentPost = async (req: Request, res: Response) => {
  const comment = {
    comment: req.body.comment,
    postedBy: req.user?._id,
  };

  try {
    const post = await PostModel.findByIdAndUpdate(
      req.body.postId,
      {
        $push: {
          comments: comment,
        },
      },
      {
        new: true,
      }
    )
      .populate("comments.postedBy", "_id name")
      .populate("postedBy", "_id name Photo");

    res.status(200).json(post);
  } catch (error) {
    if (error instanceof Error)
      res.status(400).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/v1/posts/comment/:postId/:commentId
// @access  Private

const deleteComment = async (req: Request, res: Response) => {
  try {
    const post = await PostModel.findByIdAndUpdate(
      req.params.postId,
      {
        $pull: {
          comments: {
            _id: req.params.commentId,
          },
        },
      },
      {
        new: true,
      }
    ).populate("postedBy", "_id, name");

    res.status(200).json(post);
  } catch (error) {
    if (error instanceof Error)
      res.status(400).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
  }
};

// @desc    Delete a post
// @route   DELETE /api/v1/posts/:postId
// @access  Private
const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await PostModel.findOne({ _id: req.params.postId }).populate(
      "postedBy",
      "_id"
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    // Check if the user who is deleting the post is the same user who created the post
    if (post.postedBy._id.toString() === req.user?._id.toString()) {
      await post.deleteOne();
      res.status(200).json({ message: "Post deleted successfully" });
    }
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ message: err.message });
  }
};

export {
  getPosts,
  createPost,
  getMyPosts,
  likePost,
  unlikePost,
  commentPost,
  deleteComment,
  deletePost,
};
