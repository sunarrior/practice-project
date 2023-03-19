import { Request, Response } from "express";

import userDB from "../db/user.db";
import User from "../entity/User";
import { jwt } from "../utils";
import cloudinary from "../config/cloudinary.config";

const getUserProfile = async (req: Request, res: Response) => {
  try {
    const bearerToken: string | undefined = req.header("Authorization");
    // check if jwt token exists
    if (!bearerToken) {
      return res.status(200).json({ status: "failed", msg: "Token not found" });
    }

    // get and decode jwt token
    const token: string = bearerToken.split(" ")[1];
    const result = jwt.verifyAccessToken(token);

    // get user info and check if exists
    const { username } = (result as any).data;
    const user: User | null = await userDB.getUserByAttrb({
      username: username,
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
    const bearerToken: string | undefined = req.header("Authorization");
    const userProfile = req.body;
    // check if jwt token exists
    if (!bearerToken) {
      return res.status(200).json({ status: "failed", msg: "Token not found" });
    }

    // get token and decode
    const token = bearerToken.split(" ")[1];
    const result = jwt.verifyAccessToken(token);

    // get user info and check if exists
    const { username } = (result as any).data;
    const user: User | null = await userDB.getUserByAttrb({
      username: username,
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
    const bearerToken: string | undefined = req.header("Authorization");

    // check if jwt token exists
    if (!bearerToken) {
      return res.status(200).json({ status: "failed", msg: "Token not found" });
    }

    // get token and decode
    const token = bearerToken.split(" ")[1];
    const jwtResult = jwt.verifyAccessToken(token);

    // get user info and check if exists
    const { username } = (jwtResult as any).data;
    const user: User | null = await userDB.getUserByAttrb({
      username: username,
    });
    if (!user) {
      return res.status(200).json({ status: "failed", msg: "User not found" });
    }

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

// {
//   asset_id: '984becc55d608f4020ca4c2364a7b99e',
//   public_id: 'x359svsvnnhirkuhof3r',
//   version: 1679165800,
//   version_id: '3e85e37a4e13c26ae6fce926edf4c675',
//   signature: 'b2f317818ecfa9934aed27bc5ea19e7d61315fa6',
//   width: 1000,
//   height: 1000,
//   format: 'png',
//   resource_type: 'image',
//   created_at: '2023-03-18T18:56:40Z',
//   tags: [],
//   bytes: 1091595,
//   type: 'upload',
//   etag: 'abc9f891af817c597ffc52728b1bfcc2',
//   placeholder: false,
//   url: 'http://res.cloudinary.com/dwi2ud4gn/image/upload/v1679165800/x359svsvnnhirkuhof3r.png',
//   secure_url: 'https://res.cloudinary.com/dwi2ud4gn/image/upload/v1679165800/x359svsvnnhirkuhof3r.png',
//   folder: '',
//   api_key: '971495842433532'
// }
