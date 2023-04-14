import { Request, Response, NextFunction } from "express";
import Joi, { ObjectSchema } from "joi";

import { validation } from "../constant/middleware.constant";
import { RegisterData } from "../interface/UserData";

export const registerValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const registerData: RegisterData = {
      fullName: req.body?.fullName,
      username: req.body?.username,
      email: req.body?.email,
      password: req.body?.password,
    };

    const validateSchema: ObjectSchema<RegisterData> = Joi.object({
      fullName: Joi.string().pattern(/^(?=.*[a-zA-Z])([a-zA-Z ]+)$/),
      username: Joi.string().pattern(
        /^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+).{6,}$/
      ),
      email: Joi.string().email(),
      password: Joi.string().pattern(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&]).{8,}$/m
      ),
    });
    await validateSchema.validateAsync(registerData);
    next();
  } catch (error: any) {
    let msg: string = "";
    switch (error.details[0].context.key) {
      case "fullName":
        msg = validation.FULLNAME_REQUIREMENT;
        break;
      case "username":
        msg = validation.USERNAME_REQUIREMENT;
        break;
      case "email":
        msg = validation.EMAIL_INVALID;
        break;
      case "password":
        msg = validation.PASSWORD_REQUIREMENT;
        break;
      default:
        msg = validation.DEFAULT;
        break;
    }
    res.status(400).json({ msg });
  }
};
