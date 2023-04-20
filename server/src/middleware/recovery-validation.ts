import { Request, Response, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";

import { validation } from "../constant/middleware.constant";
import { RecoveryData } from "../interface/UserData";

export const recoveryValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const recoveryData: RecoveryData = {
      account: req.body?.account,
      token: req.body?.token,
      password: req.body?.password,
    };

    const validateSchema: ObjectSchema<RecoveryData> = Joi.object({
      account: [
        Joi.string().pattern(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/),
        Joi.string().email(),
      ],
      token: Joi.string().pattern(/^(?=.*[0-9])(?=.*[a-fA-F])([a-fA-F0-9]+)$/),
      password: Joi.string().pattern(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&]).{8,}$/m
      ),
    });
    await validateSchema.validateAsync(recoveryData);
    next();
  } catch (error: any) {
    let msg: string = "";
    switch (error.details[0].context.key) {
      case "account":
        msg = validation.ACCOUNT_INVALID;
        break;
      case "token":
        msg = validation.TOKEN_INVALID;
        break;
      case "password":
        msg = validation.PASSWORD_INVALID;
        break;
      default:
        msg = validation.DEFAULT;
        break;
    }
    res.status(400).json({ msg });
  }
};
