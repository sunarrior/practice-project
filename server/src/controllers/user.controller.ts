/* eslint-disable prefer-destructuring */
import { Request, Response } from "express";
// import { AuthRequest } from "../interface/AuthRequest";

import userDB from "../db/user.db";
import User from "../entity/User";
import cloudinary from "../config/cloudinary.config";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    if (req.role?.localeCompare("admin")) {
      return res.status(403).json({ status: "failed", msg: "Access denied" });
    }

    const users: User[] = await userDB.getAllUsers();
    const userList: any[] = users.map((user: User) => {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        role: user.role,
        status: user.status,
      };
    });
    res.status(200).json({ status: "success", userList: userList });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

const getUserProfile = async (req: Request, res: Response) => {
  try {
    // get user info and check if exists
    const role: string | undefined = req.role;
    const { option } = req.query;

    if ((role as string)?.localeCompare("admin") === 0) {
      const { username } = req.params;
      const user: User | null = await userDB.getUserByAttrb({
        username: username as string,
      });

      // check if user exists
      if (!user) {
        return res
          .status(200)
          .json({ status: "failed", msg: "User not found" });
      }
      // return user info as admin
      return res.status(200).json({ status: "success", userData: user });
    }

    const username: string | undefined = req.username;
    const user: User | null = await userDB.getUserByAttrb({
      username: username as string,
    });
    if (!user) {
      return res.status(200).json({ status: "failed", msg: "User not found" });
    }

    if ((option as string)?.localeCompare("delivery-address") === 0) {
      return res
        .status(200)
        .json({ status: "success", deliveryAddress: user.deliveryAddress });
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
    res.status(200).json({ status: "success", userData: userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

const updateUserProfile = async (req: Request, res: Response) => {
  try {
    // get user info and check if exists
    const role: string | undefined = req.role;
    const userProfile = req.body;
    let user: User | null;

    if ((role as string).localeCompare("admin") === 0) {
      const { username } = req.params;
      user = await userDB.getUserByAttrb({
        username: username as string,
      });
    } else {
      const username: string | undefined = req.username;
      user = await userDB.getUserByAttrb({
        username: username as string,
      });
    }

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
    const role: string | undefined = req.role;
    let user: User | null;
    if ((role as string).localeCompare("admin") === 0) {
      const { username } = req.params;
      user = await userDB.getUserByAttrb({
        username: username as string,
      });
    } else {
      const username: string | undefined = req.username;
      user = await userDB.getUserByAttrb({
        username: username as string,
      });
    }

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
        await userDB.updateUserData(user?.id as number, {
          avatarUrl: result.secure_url,
        });
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

const deleteUser = async (req: Request, res: Response) => {
  try {
    const role: string | undefined = req.role;
    if ((role as string).localeCompare("admin")) {
      return res.status(403).json({ status: "failed", msg: "Access denied" });
    }
    const { id: userid } = req.params;

    // check if user exists
    const user: User | null = await userDB.getUserByAttrb({
      id: userid as unknown as number,
    });
    if (!user) {
      return res.status(200).json({ status: "failed", msg: "User not found" });
    }

    if (user.status.localeCompare("active") === 0) {
      return res
        .status(200)
        .json({ status: "failed", msg: "Cannot delete active user" });
    }

    if (user.status.localeCompare("inactive") === 0) {
      await userDB.deleteUser(user);
    }
    res
      .status(200)
      .json({ status: "success", msg: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server Error" });
  }
};

export default {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  uploadImageProfile,
  deleteUser,
};
