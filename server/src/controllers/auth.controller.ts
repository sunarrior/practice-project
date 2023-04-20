import { Request, Response } from "express";

import { authConstant, common } from "../constant/controller.constant";
import userDB from "../db/user.db";
import cartDB from "../db/cart.db";
import User from "../entity/User";
import Cart from "../entity/Cart";
import { crypto, mail, redis, jwt } from "../utils";

const createUser = async (req: Request, res: Response) => {
  try {
    const { fullName, username, email, password } = req.body;

    // check if username or email is already exists
    const userUsername: User | null = await userDB.getUserByUsername(username);
    const userEmail: User | null = await userDB.getUserByEmail(email);
    if (userUsername || userEmail) {
      return res
        .status(400)
        .json({ msg: authConstant.REGISTER.USER_OR_EMAIL_ALREADY_EXIST });
    }

    // create confirm token
    const token: string = await crypto.randomToken(128);

    // hash password and save user to database
    const hashPassword: string = await crypto.encryptPassword(password);
    const user: User = new User();
    user.fullName = fullName;
    user.username = username;
    user.email = email;
    user.password = hashPassword;
    user.role = "user";
    user.tokenStore = token;
    const newUser: User = await userDB.createUser(user);

    // create cart for user after create user
    const cart: Cart = new Cart();
    cart.user = newUser;
    await cartDB.createCart(cart);

    // save token to redis and send to user's email
    await redis.setCache(token, username, 300);
    mail.sendVerifyMail(email, token);
    res.status(201).json({
      msg: authConstant.REGISTER.CHECK_MAIL,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

const verifyUser = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    // check if token is exists on cache
    const username: string | null = await redis.getCache(token);
    if (!username) {
      return res.status(400).json({ msg: authConstant.VERIFY.TOKEN_INVALID });
    }

    // check if username is exists
    const user: User | null = await userDB.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ msg: common.USER_NOT_EXIST });
    }

    // update user's verify status
    redis.clearCache(token);
    await userDB.updateUserData(user.id, {
      ...user,
      isVerified: true,
      tokenStore: null,
    });
    res.status(200).json({ msg: authConstant.VERIFY.SUCCESSFULLY });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { account, password } = req.body;

    // check if user is exists
    const user: User | null = /@/.test(account)
      ? await userDB.getUserByEmail(account)
      : await userDB.getUserByUsername(account);
    if (!user) {
      return res
        .status(400)
        .json({ msg: authConstant.LOGIN.ACCOUNT_OR_PASSWORD_INCORRECT });
    }

    // check if user has verify account yet
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ msg: authConstant.LOGIN.USER_NOT_VERIFIED });
    }

    // check passsword attempts
    // await rateLimit.loginAttemps.consume(req.ip);

    // validate password
    const compareResult: boolean = await crypto.validatePassword(
      password,
      user.password
    );
    if (!compareResult) {
      return res
        .status(400)
        .json({ msg: authConstant.LOGIN.ACCOUNT_OR_PASSWORD_INCORRECT });
    }

    // remove login attemps
    // await rateLimit.loginAttemps.delete(req.ip);

    // process jwt
    const accessToken: string = jwt.generateAccessToken({
      id: user.id,
      username: user.username,
      userip: req.ip,
      useragent: req.get("User-Agent"),
      role: user.role,
    });

    // process login
    return res.status(200).json({
      msg: authConstant.LOGIN.SUCCESSFULLY,
      user_obj: {
        access_token: accessToken,
      },
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

const sessionAuthentication = async (req: Request, res: Response) => {
  try {
    const id: number | undefined = req.id;

    // check if user exists
    const user: User | null = await userDB.getUserById(id as unknown as number);
    if (!user) {
      return res
        .status(404)
        .json({ msg: common.USER_NOT_EXIST, isLoggedIn: false });
    }

    // get cart state
    const cart: Cart | null = await cartDB.getCartState(user.id);
    if (!cart) {
      return res.status(404).json({ msg: authConstant.SESSION.CART_NOT_FOUND });
    }

    // return authentication successfully
    res.status(200).json({
      msg: authConstant.SESSION.SUCCESSFULLY,
      isLoggedIn: true,
      cartState: cart.cartItems.length,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR, isLoggedIn: false });
  }
};

const changePassword = async (req: Request, res: Response) => {
  try {
    if (req.query.findaccount) {
      const { account } = req.body;

      // check if user exists
      const user: User | null = /@/.test(account)
        ? await userDB.getUserByEmail(account)
        : await userDB.getUserByUsername(account);
      if (!user) {
        return res.status(404).json({ msg: common.USER_NOT_EXIST });
      }

      // check if user has already verify
      if (!user.isVerified) {
        return res
          .status(400)
          .json({ msg: authConstant.LOGIN.USER_NOT_VERIFIED });
      }

      // check if user already have recovery token in db
      // take that token and remove it in redis cache
      if (user.tokenStore) {
        redis.clearCache(user.tokenStore);
      }

      // create token, save db and redis, send mail
      const token: string = await crypto.randomToken(128);
      await userDB.updateUserData(user.id, { ...user, tokenStore: token });
      await redis.setCache(token, user.username, 180);
      mail.sendRecoveryMail(user.username, user.email, token);
      res.status(200).json({
        msg: authConstant.CHANGE_PASSWORD.CHECK_EMAIL,
      });
    }

    if (req.query.checktoken) {
      // check if token exists in redis
      const { token } = req.body;
      const result: string | null = await redis.getCache(token);
      if (!result) {
        return res.status(400).json({
          msg: authConstant.CHANGE_PASSWORD.LINK_INVALID,
        });
      }
      res.status(200).end();
    }

    if (req.query.changepass) {
      // check if token exists in redis
      const { token, password } = req.body;
      const result: string | null = await redis.getCache(token);
      if (!result) {
        return res.status(400).json({
          msg: authConstant.CHANGE_PASSWORD.LINK_INVALID,
        });
      }

      // check if user store in token exsist
      const user: User | null = await userDB.getUserByUsername(result);
      if (!user) {
        return res.status(400).json({ msg: common.USER_NOT_EXIST });
      }

      // hash and change passowrd
      const hashPassword: string = await crypto.encryptPassword(password);
      await userDB.updateUserData(user.id, {
        ...user,
        password: hashPassword,
        tokenStore: null,
      });
      redis.clearCache(token);
      res.status(200).json({
        msg: authConstant.CHANGE_PASSWORD.SUCCESSFULLY,
      });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

const logoutUser = async (req: Request, res: Response) => {
  try {
    const id: number | undefined = req.id;

    // check if user exists
    const user: User | null = await userDB.getUserById(id as unknown as number);
    if (!user) {
      return res
        .status(400)
        .json({ msg: authConstant.LOGIN.ACCOUNT_OR_PASSWORD_INCORRECT });
    }

    res.status(200).json({ msg: authConstant.LOGOUT.SUCCESSFULLY });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ msg: common.SERVER_ERROR });
  }
};

export default {
  createUser,
  verifyUser,
  loginUser,
  sessionAuthentication,
  changePassword,
  logoutUser,
};
