import { Request, Response, NextFunction } from "express";
import { joi } from "../utils";

export const validation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const data: { [index: string]: string } = req.body;
    const result = await joi.authValidate(data);
    if (result.status === "failed") {
      return res.status(200).json({ status: "failed", msg: result.msg });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: "failed", msg: "Server error" });
  }
};
