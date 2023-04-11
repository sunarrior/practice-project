import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

import { jwt } from "../utils";
import { authentication } from "../constant/middleware.constant";

export const jwtValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearerToken: string | undefined = req.header("Authorization");
    // check if jwt token exists
    if (!bearerToken) {
      return res.status(403).json({
        msg: authentication.TOKEN.NOT_FOUND,
        isLoggedIn: false,
      });
    }

    // get and decode jwt token
    const token: string = bearerToken.split(" ")[1];
    const result: string | JwtPayload = jwt.verifyAccessToken(token);

    // get user info and check if exists in session
    const { id, userip, useragent, role } = (result as JwtPayload).data;

    // check if user-agent and ip is valid with sesison
    if (userip !== req.ip || useragent !== req.get("User-Agent")) {
      return res.status(403).json({
        msg: authentication.TOKEN.SESSION_INVALID,
        isLoggedIn: false,
      });
    }

    req.id = id;
    req.role = role;
    next();
  } catch (error: any) {
    // console.log(error.message)
    res.status(403).json({ msg: authentication.TOKEN.INVALID });
  }
};
