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
  SERVER_BASE_URL: string | undefined;
  PORT: number | undefined;
  CLIENT_BASE_URL: string | undefined;
  GMAIL_USER: string | undefined;
  GMAIL_PASSWORD: string | undefined;
  ACCESS_TOKEN_SECRET: string | undefined;
  ACCESS_TOKEN_LIFE: string | undefined;
  CLOUD_NAME: string | undefined;
  API_KEY: string | undefined;
  API_SECRET: string | undefined;
  STRIPE_SECRET_KEY: string | undefined;
  STRIPE_WEBHOOK_SECRET: string | undefined;
}

interface Config {
  DB_TYPE: any;
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  SERVER_BASE_URL: string;
  PORT: number;
  CLIENT_BASE_URL: string;
  GMAIL_USER: string;
  GMAIL_PASSWORD: string;
  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_LIFE: string;
  CLOUD_NAME: string;
  API_KEY: string;
  API_SECRET: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
}

const getEnvConfig = (): ENV => {
  return {
    DB_TYPE: process.env.DB_TYPE as any,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE:
      process.env.NODE_ENV?.localeCompare("test") === 0
        ? process.env.DB_TEST_DATABASE
        : process.env.DB_DATABASE,
    SERVER_BASE_URL: process.env.SERVER_BASE_URL,
    PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
    CLIENT_BASE_URL: process.env.CLIENT_BASE_URL,
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASSWORD: process.env.GMAIL_PASSWORD,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_LIFE: process.env.ACCESS_TOKEN_LIFE,
    CLOUD_NAME: process.env.CLOUD_NAME,
    API_KEY: process.env.API_KEY,
    API_SECRET: process.env.API_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  };
};

const verifyEnvConfig = (config: ENV): Config => {
  Object.entries(config).forEach((key, value) => {
    if (value === undefined) {
      throw new Error(`${key} does not exist in .env`);
    }
  });
  return config as Config;
};

const config = getEnvConfig();
const verifiedConfig = verifyEnvConfig(config);

export default verifiedConfig;
