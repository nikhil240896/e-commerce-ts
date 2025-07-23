import dotenv from "dotenv";
import { Secret } from "jsonwebtoken";

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: string;
  MONGO_URI: string;
  JWT_SECRET: Secret;  // Secret
  JWT_EXPIRES_IN: string;
}

const getEnvConfig = (): EnvConfig => {
  const { NODE_ENV, PORT, MONGO_URI, JWT_SECRET, JWT_EXPIRES_IN } = process.env;

  if (!NODE_ENV) {
    throw new Error("NODE_ENV is not defined in environment variables");
  }
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  if (!JWT_EXPIRES_IN) {
    throw new Error("JWT_EXPIRES_IN is not defined in environment variables");
  }

  return {
    NODE_ENV,
    PORT: PORT || "4545",
    MONGO_URI,
    JWT_SECRET: JWT_SECRET as Secret,
    JWT_EXPIRES_IN,
  };
};

export const config = getEnvConfig();