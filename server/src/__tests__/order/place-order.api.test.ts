import request, { Response } from "supertest";

import { LoginData } from "../../interface/UserData";
import { PaymentOption } from "../../interface/OrderData";
import { authentication } from "../../constant/middleware.constant";
import { common, orderConstant } from "../../constant/controller.constant";
import { product001 } from "../../data-test/product.data";
import app from "../../app";

const baseUrl: string = "/api/v1";

const loginInfo: LoginData = {
  account: "test001",
  password: "123qwe!@#QWE",
};

let accessToken: string = "";
beforeAll(async () => {
  const response: Response = await request(app)
    .post(`${baseUrl}/auth/login`)
    .send(loginInfo);
  accessToken = response.body.user_obj.access_token;
  // console.log(accessToken);
});

describe("POST /orders", () => {
  describe("jwt validation", () => {
    // case 1.1: request without jwt
    it("should return 403 if jwt is not found", async () => {
      const response: Response = await request(app).post(`${baseUrl}/orders`);
      expect(response.statusCode).toEqual(403);
      expect(response.body.msg).toBe(authentication.TOKEN.NOT_FOUND);
    });

    // case 1.2: random jwt invalid
    it("should return 403 if jwt is invalid", async () => {
      const response: Response = await request(app)
        .post(`${baseUrl}/orders`)
        .set({ Authorization: `Bearer ${accessToken}invalid` });
      expect(response.statusCode).toEqual(403);
      expect(response.body.msg).toBe(authentication.TOKEN.INVALID);
    });

    // case 1.3: different ip address
    it("should return 403 if ip in jwt different with current ip", async () => {
      const differIpJwt: string =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxLCJ1c2VybmFtZSI6InRlc3QwMDEiLCJ1c2VyaXAiOiIxMTMuMTYwLjIyNi4xNSIsInJvbGUiOiJhZG1pbiJ9LCJpYXQiOjE2ODE3MDIyMTUsImV4cCI6MTcxMzIzODIxNX0.ecWiscANKhM2KMAm1qWJscTF0ZA4YhBt8Kx7YpUeFKY";
      const response: Response = await request(app)
        .post(`${baseUrl}/orders`)
        .set({ Authorization: `Bearer ${differIpJwt}` });
      expect(response.statusCode).toEqual(403);
      expect(response.body.msg).toBe(authentication.TOKEN.SESSION_INVALID);
    });
  });

  // case 2: userid in jwt not exist
  it("should return 404 if user id in jwt not exist", async () => {
    const userIdNotExist: string =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJuYW1lIjoidGVzdDEwMCIsInVzZXJpcCI6Ijo6ZmZmZjoxMjcuMC4wLjEiLCJyb2xlIjoiYWRtaW4ifSwiaWF0IjoxNjgxNzAyMjE1LCJleHAiOjE3MTMyMzgyMTV9.Naj4dJxTgASZOCbC4ZWruRtAm_5GxlZsWWtTXTOO6dg";
    const response: Response = await request(app)
      .post(`${baseUrl}/orders`)
      .set({ Authorization: `Bearer ${userIdNotExist}` });
    expect(response.statusCode).toEqual(404);
    expect(response.body.msg).toBe(common.USER_NOT_EXIST);
  });

  // case 3: userid in jwt not exist in database
  it("should return 404 if user id in jwt not exist in database", async () => {
    const userIdNotExistInDb: string =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoxMDAsInVzZXJuYW1lIjoidGVzdDEwMCIsInVzZXJpcCI6Ijo6ZmZmZjoxMjcuMC4wLjEiLCJyb2xlIjoiYWRtaW4ifSwiaWF0IjoxNjgxNzAyMjE1LCJleHAiOjE3MTMyMzgyMTV9.lzp_Mkp-8AunM1rJz2FFBvgH0V_YwNFOw5oW2lzyRa0";
    const response: Response = await request(app)
      .post(`${baseUrl}/orders`)
      .set({ Authorization: `Bearer ${userIdNotExistInDb}` });
    expect(response.statusCode).toEqual(404);
    expect(response.body.msg).toBe(common.USER_NOT_EXIST);
  });

  // case 3: user is blocked
  it("should return 400 if user is blocked", async () => {
    const userIsBlocked: string =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjo0LCJ1c2VybmFtZSI6InRlc3QwMDQiLCJ1c2VyaXAiOiI6OmZmZmY6MTI3LjAuMC4xIiwicm9sZSI6ImFkbWluIn0sImlhdCI6MTY4MTcwMjIxNSwiZXhwIjoxNzEzMjM4MjE1fQ.0SbL4rOuyWfnbhZluO9pgYsi76vwCcLO_h79jEmhkYs";
    const response: Response = await request(app)
      .post(`${baseUrl}/orders`)
      .set({ Authorization: `Bearer ${userIsBlocked}` });
    expect(response.statusCode).toEqual(400);
    expect(response.body.msg).toBe(common.USER_BLOCKED);
  });

  describe("missing payment option", () => {
    // case 4.1: missing payment option
    it("should return 404 if missing payment option", async () => {
      const paymentOption: any = {
        paymentMethod: undefined,
        deliveryAddress: undefined,
      };
      const response: Response = await request(app)
        .post(`${baseUrl}/orders`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({ paymentOption });
      expect(response.statusCode).toEqual(400);
      expect(response.body.msg).toBe(orderConstant.MISSING_INFOMATIONS);
    });

    // case 4.2: missing payment method
    it("should return 404 if missing payment method", async () => {
      const paymentOption: any = {
        paymentMethod: undefined,
        deliveryAddress: "100 address",
      };
      const response: Response = await request(app)
        .post(`${baseUrl}/orders`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({ paymentOption });
      expect(response.statusCode).toEqual(400);
      expect(response.body.msg).toBe(orderConstant.MISSING_INFOMATIONS);
    });

    // case 4.3: missing delivery address
    it("should return 404 if missing delivery address", async () => {
      const paymentOption: any = {
        paymentMethod: "cash",
        deliveryAddress: undefined,
      };
      const response: Response = await request(app)
        .post(`${baseUrl}/orders`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({ paymentOption });
      expect(response.statusCode).toEqual(400);
      expect(response.body.msg).toBe(orderConstant.MISSING_INFOMATIONS);
    });
  });

  describe("missing cart item data", () => {
    // case 5.1: missing cart item id
    it("should return 404 if missing cart item id", async () => {
      const paymentOption: PaymentOption = {
        paymentMethod: "cash",
        deliveryAddress: "100 delivery address",
      };

      const items: any[] = [
        {
          product: {
            id: 1,
            name: product001.name,
            price: product001.price,
          },
          quantity: 1,
        },
      ];

      const response: Response = await request(app)
        .post(`${baseUrl}/orders`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({ items, paymentOption });
      expect(response.statusCode).toEqual(400);
      expect(response.body.msg).toBe(orderConstant.MISSING_INFOMATIONS);
    });

    // case 5.2: missing product id
    it("should return 404 if missing product id", async () => {
      const paymentOption: PaymentOption = {
        paymentMethod: "cash",
        deliveryAddress: "100 delivery address",
      };

      const items: any[] = [
        {
          id: 1,
          product: {
            name: product001.name,
            price: product001.price,
          },
          quantity: 1,
        },
      ];

      const response: Response = await request(app)
        .post(`${baseUrl}/orders`)
        .set({ Authorization: `Bearer ${accessToken}` })
        .send({ items, paymentOption });
      expect(response.statusCode).toEqual(400);
      expect(response.body.msg).toBe(orderConstant.MISSING_INFOMATIONS);
    });
  });

  // case 6: place order successfully
  it("should return 200 if place order successfully", async () => {
    const paymentOption: PaymentOption = {
      paymentMethod: "cash",
      deliveryAddress: "100 delivery address",
    };

    const items: any[] = [
      {
        id: 1,
        product: {
          id: 1,
          name: product001.name,
          price: product001.price,
        },
        quantity: 1,
      },
    ];

    const response: Response = await request(app)
      .post(`${baseUrl}/orders`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ items, paymentOption });
    expect(response.statusCode).toEqual(200);
    expect(response.body.msg).toBe(orderConstant.PLACE_ORDER_SUCCESSFULLY);
  });
});
