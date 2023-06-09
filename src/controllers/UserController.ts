import { Request, Response } from "express";

import UserModel from "../models/User";
import PostModel from "../models/Post";

// @desc    Get a user's profile
// @route   GET /api/v1/users/:id
// @access  Public
const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findOne({ _id: req.params.id })
      .select("-password")
      .populate("followers", "_id name")
      .populate("following", "_id name");

    // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get user's posts
    const posts = await PostModel.find({ postedBy: req.params.id })
      .populate("postedBy", "_id name")
      .exec();

    // Return user profile and posts
    res.status(200).json({ user, posts });
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ message: err.message });
  }
};

// @desc    Follow a user
// @route   PUT /api/v1/users/follow
// @access  Private
const followUser = async (req: Request, res: Response) => {
  try {
    // We are following this user now - so we add this user to our following list
    const user = await UserModel.findByIdAndUpdate(
      req.body.followId, // followId is the id of the user we want to follow
      {
        // we are adding the user id to the following array
        $push: { followers: req.user?._id },
      },
      { new: true }
    ).select("-password");

    // This user is following us now - so we add this user to our followers list
    const me = await UserModel.findByIdAndUpdate(
      req.user?._id,
      {
        $push: { following: req.body.followId },
      },
      { new: true }
    ).select("-password");

    res.status(200).json({ user, me });
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ message: err.message });
  }
};

// @desc    Unfollow a user
// @route   PUT /api/v1/users/unfollow
// @access  Private
const unfollowUser = async (req: Request, res: Response) => {
  try {
    // We are unfollowing this user now - so we remove this user from our following list
    const user = await UserModel.findByIdAndUpdate(
      req.body.unfollowId,
      {
        $pull: { followers: req.user?._id },
      },
      {
        new: true,
      }
    );
    // This user is unfollowing us now - so we remove this user from our followers list
    const me = await UserModel.findByIdAndUpdate(
      req.user?._id,
      {
        $pull: { following: req.body.unfollowId },
      },
      {
        new: true,
      }
    );
    res.status(200).json({ user, me });
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/users/update
// @access  Private
const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.user?._id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    ).select("-password");

    res.status(200).json({ user });
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ message: err.message });
  }
};

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Public
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find().select("-password");
    res.status(200).json({ users });
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ message: err.message });
  }
};

// @desc    Update profile picture
// @route   PUT /api/v1/users/updatepic
// @access  Private
const updateProfilePic = async (req: Request, res: Response) => {
  try {
    const user = await UserModel.findByIdAndUpdate(
      req.user?._id,
      {
        $set: { avatar: req.body.avatar },
      },
      {
        new: true,
      }
    ).select("-password");

    res.status(200).json({ user });
  } catch (err) {
    if (err instanceof Error) res.status(500).json({ message: err.message });
  }
};

export {
  getUserProfile,
  followUser,
  unfollowUser,
  updateUserProfile,
  getAllUsers,
  updateProfilePic,
};
