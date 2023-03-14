/* eslint-disable consistent-return */
import { Request, Response } from "express";
import User from "../entity/User";
import userDB from "../db/user.db";
import { crypto, mail, redis } from "../utils";

const createUser = async (req: Request, res: Response) => {
  try {
    const userData: { [index: string]: string } = { ...req.body };

    // check if username or email is already exists
    const userUsername: User | null = await userDB.getUserByAttrb({
      username: userData.username,
    });
    const userEmail: User | null = await userDB.getUserByAttrb({
      email: userData.email,
    });
    if (userUsername && userEmail) {
      return res
        .status(200)
        .json({ status: "failed", msg: "Username or email is already in use" });
    }

    // hash password and save user to database
    const hashPassword = await crypto.encryptPassword(userData.password);
    await userDB.createUser({
      ...userData,
      role: "user",
      password: hashPassword,
    });

    // create confirm token, save to redis and send to user's email
    const token = await crypto.tokenValidation(128);
    await redis.setCache(token, userData.username, 300);
    mail.sendVerifyMail(userData.email, token);
    res.status(201).json({
      status: "success",
      msg: "Check your email and verify your account",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server error" });
  }
};

const verifyUser = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // check if token is exists on cache
    const username = await redis.getCache(token);
    if (!username) {
      return res
        .status(200)
        .json({ status: "failed", msg: "Token is invalid" });
    }

    // check if username is exists
    const user = await userDB.getUserByAttrb({ username: username });
    if (!user) {
      return res.status(200).json({ status: "failed", msg: "User dont exist" });
    }

    // update user's verify status
    redis.clearCache(token);
    await userDB.updateUserData(user.id, { isVerify: true });
    res
      .status(200)
      .json({ status: "success", msg: "User verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server error" });
  }
};

export default {
  createUser,
  verifyUser,
};
