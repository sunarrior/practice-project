import { Request, Response, NextFunction } from "express";

import { jwt } from "../utils";

export const tokenValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearerToken: string | undefined = req.header("Authorization");
  // check if jwt token exists
  if (!bearerToken) {
    return res.status(403).json({ status: "failed", msg: "Token not found" });
  }

  // get and decode jwt token
  const token: string = bearerToken.split(" ")[1];
  const result = jwt.verifyAccessToken(token);

  // get user info and check if exists in session
  const { username } = (result as any).data;
  if (username !== req.session.username) {
    return res
      .status(403)
      .json({ status: "failed", msg: "User session invalid" });
  }
  next();
};
