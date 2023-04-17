import User from "../entity/User";

import { crypto } from "../utils";

// user valid
const user001: User = new User();
user001.role = "admin";
user001.username = "test001";
user001.email = "palodu@tutuapp.bid";
crypto.encryptPassword("123qwe!@#QWE").then((password: string) => {
  user001.password = password;
});
user001.fullName = "tester one";
user001.isVerified = true;

// user not verified for cannot login
const user002: User = new User();
user002.role = "user";
user002.username = "test002";
user002.email = "pineve@finews.biz";
crypto.encryptPassword("123qwe!@#QWE").then((password: string) => {
  user002.password = password;
});
user002.fullName = "tester two";

// user not verify with verify token
const user003: User = new User();
user003.role = "user";
user003.username = "test010";
user003.email = "pineve@finews.biz3";
crypto.encryptPassword("123qwe!@#QWE").then((password: string) => {
  user003.password = password;
});
user003.fullName = "tester ten";

// user valid but be blocked
const user004: User = new User();
user004.role = "admin";
user004.username = "test004";
user004.email = "palodu@tutuapp.bidz";
crypto.encryptPassword("123qwe!@#QWE").then((password: string) => {
  user004.password = password;
});
user004.fullName = "tester four";
user004.isVerified = true;
user004.isBlocked = true;

export { user001, user002, user003, user004 };
