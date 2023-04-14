import { Request, Response, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";

import { validation } from "../constant/middleware.constant";

export const tokenValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.body;

    const validateSchema: ObjectSchema<string> = Joi.object({
      token: Joi.string().pattern(/^(?=.*[0-9])(?=.*[a-fA-F])([a-fA-F0-9]+)$/),
    });
    await validateSchema.validateAsync({ token });
    next();
  } catch (error: any) {
    let msg: string = "";
    switch (error.details[0].context.key) {
      case "token":
        msg = validation.TOKEN_INVALID;
        break;
      default:
        msg = validation.DEFAULT;
        break;
    }
    res.status(400).json({ msg });
  }
};
