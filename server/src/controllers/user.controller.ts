import { Request, Response } from "express";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";

import { common, userConstant } from "../constant/controller.constant";
import userDB from "../db/user.db";
import User from "../entity/User";
import cloudinary from "../config/cloudinary.config";
import { UserData } from "../interface/UserData";

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users: User[] = await userDB.getAllUsers();
    const userList: UserData[] = users.map((user: User) => {
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        role: user.role,
        status: user.isVerified,
        isBlocked: user.isBlocked,
      };
    });
    res.status(200).json({ userList });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

const getUserProfileAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user: User | null = await userDB.getUserById(id as unknown as number);

    // check if user exists
    if (!user) {
      return res.status(404).json({ msg: common.USER_NOT_EXIST });
    }
    // return user info as admin
    return res.status(200).json({ userData: user });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

const updateUserProfileAdmin = async (req: Request, res: Response) => {
  try {
    // get user info and check if exists
    const { email, fullName, phone, dob, gender, deliveryAddress, filePath } =
      req.body;
    const { id } = req.params;
    const user: User | null = await userDB.getUserById(id as unknown as number);
    const userEmail: User | null = await userDB.getUserByEmail(email as string);

    if (!user) {
      return res.status(404).json({ msg: common.USER_NOT_EXIST });
    }

    if (!userEmail) {
      return res.status(400).json({ msg: userConstant.EMAIL_EXIST });
    }

    const updateUser: User = {
      ...user,
      email,
      fullName,
      phone,
      dob,
      gender,
      deliveryAddress,
    };

    // remove old avatar and upload the new one to cloudinary
    if (filePath) {
      if (user.avatarUrl) {
        const imagePID = user.avatarUrl.split("/")[8].split(".")[0];
        await cloudinary.uploader.destroy(`user_avatar/${imagePID}`);
      }
      await cloudinary.uploader.upload(
        filePath,
        { folder: "user_avatar" },
        async (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          updateUser.avatarUrl = result?.secure_url as string;
        }
      );
    }

    // update user profile
    await userDB.updateUserData(user.id, updateUser);
    res.status(201).json({ msg: userConstant.UPDATE_PROFILE_SUCCESSFULLY });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

const changeBlockStatus = async (req: Request, res: Response) => {
  try {
    // get user info and check if exists
    const { isBlocked } = req.body;
    const { id } = req.params;
    const user: User | null = await userDB.getUserById(id as unknown as number);

    if (!user) {
      return res.status(404).json({ msg: common.USER_NOT_EXIST });
    }

    const updateUser: User = { ...user, isBlocked };

    // update user block status
    await userDB.updateUserData(user.id, updateUser);
    res.status(201).json({ msg: userConstant.UPDATE_BLOCK_STATUS });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id: userid } = req.params;

    // check if user exists
    const user: User | null = await userDB.getUserById(
      userid as unknown as number
    );
    if (!user) {
      return res.status(404).json({ msg: common.USER_NOT_EXIST });
    }

    if (user.isVerified) {
      return res.status(400).json({ msg: userConstant.DELETE.ACTIVE_USER });
    }

    await userDB.deleteUser(user);
    res.status(200).json({ msg: userConstant.DELETE.SUCCESSFULLY });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { option } = req.query;

    // get user info and check if exists
    const id: number | undefined = req.id;
    const user: User | null = await userDB.getUserById(id as unknown as number);
    if (!user) {
      return res.status(404).json({ msg: common.USER_NOT_EXIST });
    }

    // option get only delivery address
    if ((option as string)?.localeCompare("delivery-address") === 0) {
      return res.status(200).json({ deliveryAddress: user.deliveryAddress });
    }

    // return user info
    const userData: UserData = {
      fullName: user.fullName,
      phone: user.phone,
      dob: user.dob,
      gender: user.gender,
      email: user.email,
      deliveryAddress: user.deliveryAddress,
      avatarUrl: user.avatarUrl,
    };

    res.status(200).json({ userData });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

const updateUserProfile = async (req: Request, res: Response) => {
  try {
    // get user info and check if exists
    const { email, fullName, phone, dob, gender, deliveryAddress, filePath } =
      req.body;
    const id: number | undefined = req.id;
    const user: User | null = await userDB.getUserById(id as unknown as number);
    const userEmail: User | null = await userDB.getUserByEmail(email as string);

    if (!user) {
      return res.status(404).json({ msg: common.USER_NOT_EXIST });
    }

    if (!userEmail) {
      return res.status(400).json({ msg: userConstant.EMAIL_EXIST });
    }

    const updateUser: User = {
      ...user,
      email,
      fullName,
      phone,
      dob,
      gender,
      deliveryAddress,
    };

    // remove old avatar and upload the new one to cloudinary
    if (filePath) {
      if (user.avatarUrl) {
        const imagePID = user.avatarUrl.split("/")[8].split(".")[0];
        await cloudinary.uploader.destroy(`user_avatar/${imagePID}`);
      }
      await cloudinary.uploader.upload(
        filePath,
        { folder: "user_avatar" },
        async (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          updateUser.avatarUrl = result?.secure_url as string;
        }
      );
    }

    // update user profile
    await userDB.updateUserData(user.id, updateUser);
    res.status(201).json({ msg: userConstant.UPDATE_PROFILE_SUCCESSFULLY });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

export default {
  getAllUsers,
  getUserProfileAdmin,
  updateUserProfileAdmin,
  changeBlockStatus,
  deleteUser,
  getUserProfile,
  updateUserProfile,
};
