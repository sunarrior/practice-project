import { Request, Response, NextFunction } from "express";

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.role?.localeCompare("admin") !== 0) {
    return res.status(403).json({ status: "failed", msg: "Access denied" });
  }
  next();
};
