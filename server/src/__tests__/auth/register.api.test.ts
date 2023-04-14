/* eslint-disable import/no-extraneous-dependencies */
import request, { Response } from "supertest";

import { RegisterData } from "../../interface/UserData";
import { validation } from "../../constant/middleware.constant";
import { authConstant } from "../../constant/controller.constant";
import app from "../../app";

const baseUrl: string = "/api/v1";

describe("POST /auth/register", () => {
  describe("fullname test", () => {
    // case 1.1: fullname invalid with number
    const containNumber: RegisterData = {
      fullName: "001",
      username: "test003",
      email: "mityfari@mailo.icu",
      password: "123qwe!@#QWE",
    };
    it("should return 400 if fullname contain number", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/register`)
        .send(containNumber);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.FULLNAME_REQUIREMENT);
    });

    // case 1.2: fullname invalid with xss payload
    const containXssPayload: RegisterData = {
      fullName: "<image/src/onerror=prompt(8)>",
      username: "test003",
      email: "mityfari@mailo.icu",
      password: "123qwe!@#QWE",
    };
    it("should return 400 if fullname contain xss payload", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/register`)
        .send(containXssPayload);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.FULLNAME_REQUIREMENT);
    });

    // case 1.3: fullname invalid with sql injection payload
    const containSqliPayload: RegisterData = {
      fullName: "' UNION SELECT sum(columnname) from tablename --",
      username: "test003",
      email: "mityfari@mailo.icu",
      password: "123qwe!@#QWE",
    };
    it("should return 400 if fullname contain sqli payload", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/register`)
        .send(containSqliPayload);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.FULLNAME_REQUIREMENT);
    });
  });

  describe("username test", () => {
    // case 2.1: username invalid with only text
    const containOnlyText: RegisterData = {
      fullName: "test",
      username: "testtest",
      email: "mityfari@mailo.icu",
      password: "123qwe!@#QWE",
    };
    it("should return 400 if username contain only text", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/register`)
        .send(containOnlyText);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.USERNAME_REQUIREMENT);
    });

    // case 2.2: username invalid with only number
    const containOnlyNumber: RegisterData = {
      fullName: "test",
      username: "00010001",
      email: "mityfari@mailo.icu",
      password: "123qwe!@#QWE",
    };
    it("should return 400 if username contain only number", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/register`)
        .send(containOnlyNumber);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.USERNAME_REQUIREMENT);
    });

    // case 2.3: username invalid with not enough length
    const NotEnoughLength: RegisterData = {
      fullName: "test",
      username: "test1",
      email: "mityfari@mailo.icu",
      password: "123qwe!@#QWE",
    };
    it("should return 400 if username not enough length", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/register`)
        .send(NotEnoughLength);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.USERNAME_REQUIREMENT);
    });

    // case 2.4: username invalid with xss payload
    const containXssPayload: RegisterData = {
      fullName: "test",
      username: "<image/src/onerror=prompt(8)>",
      email: "mityfari@mailo.icu",
      password: "123qwe!@#QWE",
    };
    it("should return 400 if username contain xss payload", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/register`)
        .send(containXssPayload);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.USERNAME_REQUIREMENT);
    });

    // case 2.5: username invalid with sqli payload
    const containSqliPayload: RegisterData = {
      fullName: "test",
      username: "' GROUP BY columnnames having 1=1 --",
      email: "mityfari@mailo.icu",
      password: "123qwe!@#QWE",
    };
    it("should return 400 if username contain sqli payload", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/register`)
        .send(containSqliPayload);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.USERNAME_REQUIREMENT);
    });
  });

  // case 3: email invalid with missing @
  const missingEmailSymbol: RegisterData = {
    fullName: "test",
    username: "test003",
    email: "mityfarimailo.icu",
    password: "123qwe!@#QWE",
  };
  it("should return 400 if email missing @", async () => {
    const response: Response = await request(app)
      .post(`${baseUrl}/auth/register`)
      .send(missingEmailSymbol);
    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toMatch(validation.EMAIL_INVALID);
  });

  describe("password test", () => {
    // case 4.1: password invalid with only number
    const containOnlyNumber: RegisterData = {
      fullName: "test",
      username: "test003",
      email: "mityfari@mailo.icu",
      password: "12345678",
    };
    it("should return 400 if password contain only numbers", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/register`)
        .send(containOnlyNumber);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.PASSWORD_REQUIREMENT);
    });

    // case 4.2: password invalid with only text
    const containOnlyText: RegisterData = {
      fullName: "test",
      username: "test003",
      email: "mityfari@mailo.icu",
      password: "abcdefgh",
    };
    it("should return 400 if password contain only letters", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/register`)
        .send(containOnlyText);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.PASSWORD_REQUIREMENT);
    });

    // case 4.3: password invalid becasue without uppercase character
    const notContainUppercase: RegisterData = {
      fullName: "test",
      username: "test003",
      email: "mityfari@mailo.icu",
      password: "123456a!",
    };
    it("should return 400 if password not contain uppercase", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/register`)
        .send(notContainUppercase);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.PASSWORD_REQUIREMENT);
    });

    // case 4.4: password invalid becasue without special character
    const notContainSpecialChar: RegisterData = {
      fullName: "test",
      username: "test003",
      email: "mityfari@mailo.icu",
      password: "123456aA",
    };
    it("should return 400 if password not contain special characters", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/register`)
        .send(notContainSpecialChar);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.PASSWORD_REQUIREMENT);
    });

    // case 4.5: password invalid becasue without special character
    const NotEnoughLength: RegisterData = {
      fullName: "test",
      username: "test003",
      email: "mityfari@mailo.icu",
      password: "123aA!",
    };
    it("should return 400 if password not enough length", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/register`)
        .send(NotEnoughLength);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.PASSWORD_REQUIREMENT);
    });
  });

  // case 5: username exist
  const usernameExist: RegisterData = {
    fullName: "haha",
    username: "test002",
    email: "mityfari@mailo.icu",
    password: "123qwe!@#QWE",
  };
  it("should return 400 if user exist", async () => {
    const response: Response = await request(app)
      .post(`${baseUrl}/auth/register`)
      .send(usernameExist);
    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toMatch(
      authConstant.REGISTER.USER_OR_EMAIL_ALREADY_EXIST
    );
  });

  // case 6: email exist
  const emailExist: RegisterData = {
    fullName: "haha",
    username: "test003",
    email: "palodu@tutuapp.bid",
    password: "123qwe!@#QWE",
  };
  it("should return 400 if email exist", async () => {
    const response: Response = await request(app)
      .post(`${baseUrl}/auth/register`)
      .send(emailExist);
    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toMatch(
      authConstant.REGISTER.USER_OR_EMAIL_ALREADY_EXIST
    );
  });

  // case 7: register successfully
  const newUserData: RegisterData = {
    fullName: "haha",
    username: "test003",
    email: "mityfari@mailo.icu",
    password: "123qwe!@#QWE",
  };
  it("should return 201 if registration successful", async () => {
    const response: Response = await request(app)
      .post(`${baseUrl}/auth/register`)
      .send(newUserData);
    expect(response.statusCode).toBe(201);
    expect(response.body.msg).toMatch(authConstant.REGISTER.CHECK_MAIL);
  });
});
