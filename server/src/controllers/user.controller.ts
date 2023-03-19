import { Request, Response } from "express";

import userDB from "../db/user.db";
import User from "../entity/User";
import cloudinary from "../config/cloudinary.config";

const getUserProfile = async (req: Request, res: Response) => {
  try {
    // get user info and check if exists
    const { username } = req.session;
    const user: User | null = await userDB.getUserByAttrb({
      username: username as string,
    });
    if (!user) {
      return res.status(200).json({ status: "failed", msg: "User not found" });
    }

    // return user info
    const userData = {
      fullName: user.fullName,
      phone: user.phone,
      dob: user.dob,
      gender: user.gender,
      email: user.email,
      deliveryAddress: user.deliveryAddress,
      avatarUrl: user.avatarUrl,
    };
    res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

const updateUserProfile = async (req: Request, res: Response) => {
  try {
    // get user info and check if exists
    const { username } = req.session;
    const userProfile = req.body;
    const user: User | null = await userDB.getUserByAttrb({
      username: username as string,
    });
    if (!user) {
      return res.status(200).json({ status: "failed", msg: "User not found" });
    }

    // update user profile
    await userDB.updateUserData(user.id, { ...userProfile });
    res
      .status(200)
      .json({ status: "success", msg: "Update profile successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

const uploadImageProfile = async (req: Request, res: Response) => {
  try {
    const { filePath } = req.body;
    // get user info and check if exists
    const { username } = req.session;
    const user: User | null = await userDB.getUserByAttrb({
      username: username as string,
    });
    if (!user) {
      return res.status(200).json({ status: "failed", msg: "User not found" });
    }

    // remove old avatar and upload the new one to cloudinary
    const imagePID = user.avatarUrl.split("/")[8].split(".")[0];
    await cloudinary.uploader.destroy(`user_avatar/${imagePID}`);
    await cloudinary.uploader.upload(
      filePath,
      { folder: "user_avatar" },
      async (error: any, result: any) => {
        await userDB.updateUserData(user.id, { avatarUrl: result.secure_url });
        res
          .status(200)
          .json({ status: "success", msg: "Upload avatar successfully" });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

export default {
  getUserProfile,
  updateUserProfile,
  uploadImageProfile,
};
