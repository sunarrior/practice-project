/* eslint-disable @typescript-eslint/no-explicit-any */
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

interface ENV {
  DB_TYPE: any | undefined;
  DB_HOST: string | undefined;
  DB_PORT: number | undefined;
  DB_USERNAME: string | undefined;
  DB_PASSWORD: string | undefined;
  DB_DATABASE: string | undefined;
  PORT: number | undefined;
  GMAIL_USER: string | undefined;
  GMAIL_PASSWORD: string | undefined;
  SESSION_SECRET: string | undefined;
}

interface Config {
  DB_TYPE: any;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  PORT: number;
  GMAIL_USER: string;
  GMAIL_PASSWORD: string;
  SESSION_SECRET: string;
}

const getEnvConfig = (): ENV => {
  return {
    DB_TYPE: process.env.DB_TYPE as any,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    SESSION_SECRET: process.env.SESSION_SECRET,
  };
};

const verifyEnvConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`${key} does not exist in .env`);
    }
  }
  return config as Config;
};

const config = getEnvConfig();
const verifiedConfig = verifyEnvConfig(config);

export default verifiedConfig;
