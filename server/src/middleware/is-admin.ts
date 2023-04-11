import { Request, Response, NextFunction } from "express";

import { authentication } from "../constant/middleware.constant";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.role?.localeCompare("admin") !== 0) {
    return res.status(403).json({ msg: authentication.NOT_ADMIN });
  }
  next();
};
