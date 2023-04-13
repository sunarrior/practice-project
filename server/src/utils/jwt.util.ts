import jwt from "jsonwebtoken";
// import { promisify } from "util";

import { UserToken } from "../interface/UserData";
import EnvConfig from "../config/env.config";

// const signPromise = promisify<object, jwt.Secret, jwt.SignOptions>(jwt.sign);
// const verifyPromise = promisify(jwt.verify);

const generateAccessToken = (payload: UserToken): string => {
  const result: string = jwt.sign(
    {
      data: payload,
    },
    EnvConfig.ACCESS_TOKEN_SECRET,
    {
      expiresIn: EnvConfig.ACCESS_TOKEN_LIFE,
    }
  );
  return result;
};

const verifyAccessToken = (token: string): string | jwt.JwtPayload => {
  const result: string | jwt.JwtPayload = jwt.verify(
    token,
    EnvConfig.ACCESS_TOKEN_SECRET
  );
  return result;
};

export { generateAccessToken, verifyAccessToken };
