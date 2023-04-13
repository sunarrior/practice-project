import "express";

declare module "express" {
  interface Request {
    id?: number;
    role?: string;
  }
}
