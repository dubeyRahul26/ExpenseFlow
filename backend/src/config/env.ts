import dotenv from "dotenv";

dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is missing`);
  }
  return value;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",

  PORT: Number(process.env.PORT || 5000),

  MONGO_URI: required("MONGO_URI"),

  JWT_SECRET: required("JWT_SECRET"),

  STRIPE_SECRET_KEY: required("STRIPE_SECRET_KEY"),

  CLIENT_URL: required("CLIENT_URL")
} as const;
