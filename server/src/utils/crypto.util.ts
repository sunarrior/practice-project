import { promisify } from "util";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";

const randomBytesPromise = promisify(randomBytes);

const encryptPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

const randomToken = async (length: number): Promise<string> => {
  const token = await randomBytesPromise(length);
  return token.toString("hex");
};

const validatePassword = async (
  password: string,
  hashPassword: string
): Promise<boolean> => {
  const result = await bcrypt.compare(password, hashPassword);
  return result;
};

export { encryptPassword, randomToken, validatePassword };
