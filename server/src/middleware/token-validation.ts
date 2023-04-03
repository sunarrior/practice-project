import { Request, Response, NextFunction } from "express";

import { jwt } from "../utils";

export const tokenValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bearerToken: string | undefined = req.header("Authorization");
    // check if jwt token exists
    if (!bearerToken) {
      return res.status(403).json({
        status: "failed",
        msg: "Token not found-to",
        isLoggedIn: false,
      });
    }

    // get and decode jwt token
    const token: string = bearerToken.split(" ")[1];
    const result = jwt.verifyAccessToken(token);

    // get user info and check if exists in session
    const { username, userip, useragent, role } = (result as any).data;

    // check if user-agent and ip is valid with sesison
    if (userip !== req.ip || useragent !== req.get("User-Agent")) {
      return res.status(403).json({
        status: "failed",
        msg: "User session invalid-a",
        isLoggedIn: false,
      });
    }

    req.username = username;
    req.role = role;
    next();
  } catch (error) {
    // log(error.message)
    res.status(403).json({ status: "failed", msg: "Token is invalid" });
  }
};
