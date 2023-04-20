/* eslint-disable import/no-extraneous-dependencies */
import request, { Response } from "supertest";

import { validation } from "../../constant/middleware.constant";
import { common, authConstant } from "../../constant/controller.constant";
import app from "../../app";

const baseUrl: string = "/api/v1";

describe("POST /auth/verify", () => {
  describe("token validation", () => {
    // case 1.1: token invalid with only text
    const containOnlyText: string = "abcdefabcdefabcdefabcdef";
    it("should return 400 if token contain only text", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/verify`)
        .send({ token: containOnlyText });
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.TOKEN_INVALID);
    });

    // case 1.2: token invalid with only number
    const containOnlyNumber: string = "123456789123456789";
    it("should return 400 if token contain only number", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/verify`)
        .send({ token: containOnlyNumber });
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.TOKEN_INVALID);
    });

    // case 1.3: token invalid with xss payload
    const containXssPayload: string = "<image/src/onerror=prompt(8)>";
    it("should return 400 if token contain xss payload", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/verify`)
        .send({ token: containXssPayload });
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.TOKEN_INVALID);
    });

    // case 1.4: account - username invalid with sqli payload
    const containSqliPayload: string = "' GROUP BY columnnames having 1=1 --";
    it("should return 400 if token contain sqli payload", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/auth/verify`)
        .send({ token: containSqliPayload });
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toMatch(validation.TOKEN_INVALID);
    });
  });

  // case 2: token not exist
  const tokenNotExist: string = "123456789abcdef123";
  it("should return 400 if token not exist", async () => {
    const response: Response = await request(app)
      .post(`${baseUrl}/auth/verify`)
      .send({ token: tokenNotExist });
    expect(response.statusCode).toBe(400);
    expect(response.body.msg).toMatch(authConstant.VERIFY.TOKEN_INVALID);
  });

  // case 4: user not exist
  const userNotExist: string = "123456789abcdefabb";
  it("should return 400 if user not exist", async () => {
    const response: Response = await request(app)
      .post(`${baseUrl}/auth/verify`)
      .send({ token: userNotExist });
    expect(response.statusCode).toBe(404);
    expect(response.body.msg).toMatch(common.USER_NOT_EXIST);
  });

  // case 5: verify successfully
  const trueToken: string = "123456789abcdefabc";
  it("should return 200 if user verified successfully", async () => {
    const response: Response = await request(app)
      .post(`${baseUrl}/auth/verify`)
      .send({ token: trueToken });
    expect(response.statusCode).toBe(200);
    expect(response.body.msg).toMatch(authConstant.VERIFY.SUCCESSFULLY);
  });
});
