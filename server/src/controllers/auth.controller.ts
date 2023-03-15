/* eslint-disable consistent-return */
import { Request, Response } from "express";
import User from "../entity/User";
import userDB from "../db/user.db";
import { crypto, mail, redis, jwt, rateLimit } from "../utils";

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
    if (userUsername || userEmail) {
      return res
        .status(200)
        .json({ status: "failed", msg: "Username or email is already in use" });
    }

    // create confirm token
    const token = await crypto.randomToken(128);

    // hash password and save user to database
    const hashPassword = await crypto.encryptPassword(userData.password);
    await userDB.createUser({
      ...userData,
      role: "user",
      password: hashPassword,
      tokenStore: token,
    });

    // save token to redis and send to user's email
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
    await userDB.updateUserData(user.id, { isVerify: true, tokenStore: null });
    res
      .status(200)
      .json({ status: "success", msg: "User verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server error" });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { account, password } = req.body;

    // check if user is exists
    const user: User | null = /@/.test(account)
      ? await userDB.getUserByAttrb({ email: account })
      : await userDB.getUserByAttrb({ username: account });
    if (!user) {
      return res
        .status(200)
        .json({ status: "failed", msg: "Account or password incorrect" });
    }

    // check if user has verify account yet
    if (!user.isVerify) {
      return res
        .status(200)
        .json({ status: "failed", msg: "User has not verify account yet" });
    }

    // check passsword attempts
    await rateLimit.loginAttemps.consume(req.ip);

    // validate password
    const compareResult = await crypto.validatePassword(
      password,
      user.password
    );
    if (!compareResult) {
      return res
        .status(200)
        .json({ status: "failed", msg: "Account or password incorrect" });
    }

    // remove login attemps
    await rateLimit.loginAttemps.delete(req.ip);

    // process jwt
    const accessToken = jwt.generateAccessToken({ username: user.username });

    // process session
    req.session.username = user.username;
    req.session.userip = req.ip;
    req.session.useragent = req.get("User-Agent");

    // process login
    return res
      .status(200)
      .json({ status: "success", msg: "Login ok", token: accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server error" });
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    if (req.query.findaccount) {
      const { account } = req.body;

      // check if user exists
      const user: User | null = /@/.test(account)
        ? await userDB.getUserByAttrb({ email: account })
        : await userDB.getUserByAttrb({ username: account });
      if (!user) {
        return res
          .status(200)
          .json({ status: "failed", msg: "Account or password incorrect" });
      }

      // check if user has already verify
      if (!user.isVerify) {
        return res
          .status(200)
          .json({ status: "failed", msg: "Account need to be verify first" });
      }

      // check if user already have recovery token in db
      // take that token and remove it in redis cache
      if (user.tokenStore) {
        redis.clearCache(user.tokenStore);
      }

      // create token, save db and redis, send mail
      const token: string = await crypto.randomToken(128);
      await userDB.updateUserData(user.id, {
        tokenStore: token,
      });
      await redis.setCache(token, user.username, 180);
      mail.sendRecoveryLink(user.username, user.email, token);
      res.status(200).json({
        status: "success",
        msg: "Check your email to get change passsword link",
      });
    }

    if (req.query.checktoken) {
      // check if token exists in redis
      const { token } = req.body;
      const result = await redis.getCache(token);
      if (!result) {
        return res.status(200).json({
          status: "failed",
          msg: "Recovery link invalid",
        });
      }
    }

    if (req.query.changepass) {
      // check if token exists in redis
      const { token, password } = req.body;
      const result = await redis.getCache(token);
      if (!result) {
        return res.status(200).json({
          status: "failed",
          msg: "Recovery link invalid",
        });
      }

      // check if user store in token exsist
      const user: User | null = await userDB.getUserByAttrb({
        username: result,
      });
      if (!user) {
        return res
          .status(200)
          .json({ status: "failed", msg: "Account or password incorrect" });
      }

      // change passowrd
      await userDB.updateUserData(user.id, {
        password: password,
        tokenStore: null,
      });
      redis.clearCache(token);
      res.status(200).json({
        status: "success",
        msg: "Change password successfully",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server error" });
  }
};

export default {
  createUser,
  verifyUser,
  loginUser,
  changePassword,
};
