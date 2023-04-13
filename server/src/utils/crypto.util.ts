import { promisify } from "util";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";

const randomBytesPromise: (args: number) => Promise<Buffer> =
  promisify(randomBytes);

const encryptPassword = async (password: string): Promise<string> => {
  const salt: string = await bcrypt.genSalt(10);
  const hashPassword: string = await bcrypt.hash(password, salt);
  return hashPassword;
};

const randomToken = async (length: number): Promise<string> => {
  const token: Buffer = await randomBytesPromise(length);
  return token.toString("hex");
};

const validatePassword = async (
  password: string,
  hashPassword: string
): Promise<boolean> => {
  const result: boolean = await bcrypt.compare(password, hashPassword);
  return result;
};

export { encryptPassword, randomToken, validatePassword };
