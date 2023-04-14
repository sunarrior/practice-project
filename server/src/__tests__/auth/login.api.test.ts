/* eslint-disable import/no-extraneous-dependencies */
import request, { Response } from "supertest";

import { LoginData } from "../../interface/UserData";
import { validation } from "../../constant/middleware.constant";
import { authConstant } from "../../constant/controller.constant";
import app from "../../app";

const baseUrl: string = "/api/v1";

describe("POST /auth/login", () => {
  describe("account test", () => {
    // case 1.1: account - username invalid with only text
    const containOnlyText: LoginData = {
      account: "testtest",
      password: "123qwe!@#QWE",
    };
    it("should return 400 if username contain only text", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/login`)
        .send(containOnlyText);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.ACCOUNT_INVALID);
    });

    // case 1.2: account - username invalid with only number
    const containOnlyNumber: LoginData = {
      account: "00010001",
      password: "123qwe!@#QWE",
    };
    it("should return 400 if username contain only number", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/login`)
        .send(containOnlyNumber);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.ACCOUNT_INVALID);
    });

    // case 1.3: account - username invalid with not enough length
    const NotEnoughLength: LoginData = {
      account: "test1",
      password: "123qwe!@#QWE",
    };
    it("should return 400 if username not enough length", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/login`)
        .send(NotEnoughLength);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.ACCOUNT_INVALID);
    });

    // case 1.4: account - username invalid with xss payload
    const containXssPayload: LoginData = {
      account: "<image/src/onerror=prompt(8)>",
      password: "123qwe!@#QWE",
    };
    it("should return 400 if username contain xss payload", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/login`)
        .send(containXssPayload);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.ACCOUNT_INVALID);
    });

    // case 1.5: account - username invalid with sqli payload
    const containSqliPayload: LoginData = {
      account: "' GROUP BY columnnames having 1=1 --",
      password: "123qwe!@#QWE",
    };
    it("should return 400 if username contain sqli payload", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/login`)
        .send(containSqliPayload);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.ACCOUNT_INVALID);
    });

    // case 1.6: account - email invalid with missing @
    const missingEmailSymbol: LoginData = {
      account: "mityfarimailo.icu",
      password: "123qwe!@#QWE",
    };
    it("should return 400 if email missing @", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/login`)
        .send(missingEmailSymbol);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.ACCOUNT_INVALID);
    });
  });

  describe("password test", () => {
    // case 2.1: password invalid with only number
    const containOnlyNumber: LoginData = {
      account: "test002",
      password: "12345678",
    };
    it("should return 400 if password contain only numbers", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/login`)
        .send(containOnlyNumber);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.PASSWORD_INVALID);
    });

    // case 2.2: password invalid with only text
    const containOnlyText: LoginData = {
      account: "test002",
      password: "abcdefgh",
    };
    it("should return 400 if password contain only letters", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/login`)
        .send(containOnlyText);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.PASSWORD_INVALID);
    });

    // case 2.3: password invalid becasue without uppercase character
    const notContainUppercase: LoginData = {
      account: "test002",
      password: "123456a!",
    };
    it("should return 400 if password not contain uppercase", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/login`)
        .send(notContainUppercase);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.PASSWORD_INVALID);
    });

    // case 2.4: password invalid becasue without special character
    const notContainSpecialChar: LoginData = {
      account: "test002",
      password: "123456aA",
    };
    it("should return 400 if password not contain special characters", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/login`)
        .send(notContainSpecialChar);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.PASSWORD_INVALID);
    });

    // case 2.5: password invalid becasue without special character
    const NotEnoughLength: LoginData = {
      account: "test002",
      password: "123aA!",
    };
    it("should return 400 if password not enough length", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/login`)
        .send(NotEnoughLength);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.PASSWORD_INVALID);
    });
  });

  // case 3: username not exist
  const usernameExist: LoginData = {
    account: "test000",
    password: "123qwe!@#QWE",
  };
  it("should return 400 if user not exist", async () => {
    const response: Response = await request(app)
      .post(`${baseUrl}/auth/login`)
      .send(usernameExist);
    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toMatch(
      authConstant.LOGIN.ACCOUNT_OR_PASSWORD_INCORRECT
    );
  });

  // case 4: user not verified
  const emailExist: LoginData = {
    account: "test002",
    password: "123qwe!@#QWE",
  };
  it("should return 400 if email exist", async () => {
    const response: Response = await request(app)
      .post(`${baseUrl}/auth/login`)
      .send(emailExist);
    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toMatch(authConstant.LOGIN.USER_NOT_VERIFIED);
  });

  // case 5: login with username successfully
  const loginUsername: LoginData = {
    account: "test001",
    password: "123qwe!@#QWE",
  };
  it("should return 200 if login with username successful", async () => {
    const response: Response = await request(app)
      .post(`${baseUrl}/auth/login`)
      .send(loginUsername);
    expect(response.statusCode).toBe(200);
    expect(response.body.msg).toMatch(authConstant.LOGIN.SUCCESSFULLY);
  });

  // case 5: login with email successfully
  const loginEmail: LoginData = {
    account: "palodu@tutuapp.bid",
    password: "123qwe!@#QWE",
  };
  it("should return 200 if login with email successful", async () => {
    const response: Response = await request(app)
      .post(`${baseUrl}/auth/login`)
      .send(loginEmail);
    expect(response.statusCode).toBe(200);
    expect(response.body.msg).toMatch(authConstant.LOGIN.SUCCESSFULLY);
  });
});
