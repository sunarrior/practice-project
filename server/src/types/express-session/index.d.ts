import "express-session";

declare module "express-session" {
  interface SessionData {
    username: string;
    userip: string;
    useragent: string;
  }
}
