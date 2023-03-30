import "express";

declare module "express" {
  interface Request {
    username?: string;
    role?: string;
  }
}
