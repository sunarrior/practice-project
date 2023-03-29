import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import EnvConfig from "../config/env.config";

const MAIL_CONFIG: any = {
  service: "gmail",
  auth: {
    user: EnvConfig.GMAIL_USER,
    pass: EnvConfig.GMAIL_PASSWORD,
  },
};
const transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> =
  nodemailer.createTransport(MAIL_CONFIG);

const sendMailFromGmail = (mailData: any) => {
  const message = {
    from: EnvConfig.GMAIL_USER,
    to: mailData.to,
    subject: mailData.subject,
    html: mailData.htmlContent,
  };
  return transporter.sendMail(message);
};

const sendVerifyMail = (email: string, token: string) => {
  const timeSended: Date = new Date();
  const mailData = {
    to: email,
    subject: `Verify account ${timeSended.toLocaleString()}`,
    htmlContent: `<b>
      Click <a href="http://localhost:3000/verify/${token}">here</a> 
      to verify your account
    </b>`,
  };
  sendMailFromGmail(mailData);
};

const sendRecoveryLink = (username: string, email: string, token: string) => {
  const timeSended: Date = new Date();
  const mailData = {
    to: email,
    subject: `Recovery link ${timeSended.toLocaleString()}`,
    htmlContent: `<b>
      Recovery link for account ${username}: 
      <a href="http://localhost:3000/recovery/${token}">Recovery Link</a>
    </b>`,
  };
  sendMailFromGmail(mailData);
};

const sendPlaceOrderMail = (
  email: string,
  orderItems: any[],
  paymentOption: any
) => {
  const timeSended: Date = new Date();
  const orderItemsContent = orderItems.map((item: any) => {
    return `
      <tr>
        <td style="border: 1px solid black;">${item.name}</td>
        <td style="border: 1px solid black;">${item.quantity}</td>
        <td style="border: 1px solid black;">${item.price}</td>
      </tr>
    `;
  });
  const totalCost = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const mailData = {
    to: email,
    subject: `Order Infomation ${timeSended.toLocaleString()}`,
    htmlContent: `
      <p>Payment Method: ${paymentOption.paymentMethod}</p>
      <p>Delivery Address: ${paymentOption.deliveryAddress}</p>
      <table style="width:700px; border:1px solid black; text-align:center; word-wrap: break-word; table-layout: fixed;">
          <tr>
            <th style="border: 1px solid black;">Item Name</th>
            <th style="border: 1px solid black;">Quantity</th>
            <th style="border: 1px solid black;">Price</th>
          </tr>
          ${orderItemsContent.join(" ")}
          <tr>
              <td colspan="2" style="border: 1px solid black; text-align:right; font-weight:bold;">Total:</td>
              <td style="border: 1px solid black; text-align:">${totalCost}$</td>
          </tr>
      </table>
    `,
  };
  sendMailFromGmail(mailData);
};

const sendCartReminderMail = (email: string, cartItems: any[]) => {
  const timeSended: Date = new Date();
  const orderItemsContent = cartItems.map((item: any) => {
    return `
      <tr>
        <td style="border: 1px solid black;">${item.name}</td>
        <td style="border: 1px solid black;">${item.quantity}</td>
        <td style="border: 1px solid black;">${item.price}</td>
      </tr>
    `;
  });
  const totalCost = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const mailData = {
    to: email,
    subject: `Reminder About Current Item In Cart ${timeSended.toLocaleString()}`,
    htmlContent: `
      <p>Your cart currently contains ${cartItems.length} ${
      cartItems.length > 1 ? "items" : "item"
    }</p>
      <b><a href="http://localhost:3000/cart">Checkout</a> now today so you won't miss any items!</b>
      <table style="width:700px; border:1px solid black; text-align:center; word-wrap: break-word; table-layout: fixed;">
          <tr>
            <th style="border: 1px solid black;">Item Name</th>
            <th style="border: 1px solid black;">Quantity</th>
            <th style="border: 1px solid black;">Price</th>
          </tr>
          ${orderItemsContent.join(" ")}
          <tr>
              <td colspan="2" style="border: 1px solid black; text-align:right; font-weight:bold;">Total:</td>
              <td style="border: 1px solid black; text-align:">${totalCost}$</td>
          </tr>
      </table>
    `,
  };
  return sendMailFromGmail(mailData);
};

export {
  sendVerifyMail,
  sendRecoveryLink,
  sendPlaceOrderMail,
  sendCartReminderMail,
};
