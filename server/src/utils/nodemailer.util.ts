import nodemailer, { Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import ejs from "ejs";
import path from "path";

import { MailConfig, MailData, MailMessage } from "../interface/MailData";
import { mailSubject } from "../constant/mail.constant";
import { CartItemData, CartItemMail } from "../interface/CartData";
import { PaymentOption } from "../interface/OrderData";

import EnvConfig from "../config/env.config";

// Config mail server for sending mail
const MAIL_CONFIG: MailConfig = {
  service: "gmail",
  auth: {
    user: EnvConfig.GMAIL_USER,
    pass: EnvConfig.GMAIL_PASSWORD,
  },
};

// initialization transporter
const transporter: Transporter<SMTPTransport.SentMessageInfo> =
  nodemailer.createTransport(MAIL_CONFIG);

// Start send mail with given data
const sendMailFromGmail = (
  mailData: MailData
): Promise<SMTPTransport.SentMessageInfo> => {
  const message: MailMessage = {
    from: EnvConfig.GMAIL_USER,
    to: mailData.to,
    subject: mailData.subject,
    html: mailData.htmlContent,
  };
  return transporter.sendMail(message);
};

const sendVerifyMail = async (email: string, token: string): Promise<void> => {
  try {
    const timeSended: Date = new Date();
    const mailContent: string = await ejs.renderFile(
      path.join(__dirname, "..", "content/ejs/VerifyMail.ejs"),
      { token, CLIENT_BASE_URL: EnvConfig.CLIENT_BASE_URL }
    );
    const mailData: MailData = {
      to: email,
      subject: `${mailSubject.VERIFY_ACCOUNT} ${timeSended.toLocaleString()}`,
      htmlContent: mailContent,
    };
    sendMailFromGmail(mailData);
  } catch (error: any) {
    console.log(error);
  }
};

const sendRecoveryMail = async (
  username: string,
  email: string,
  token: string
): Promise<void> => {
  try {
    const timeSended: Date = new Date();
    const mailContent: string = await ejs.renderFile(
      path.join(__dirname, "..", "content/ejs/RecoveryMail.ejs"),
      { username, token, CLIENT_BASE_URL: EnvConfig.CLIENT_BASE_URL }
    );
    const mailData: MailData = {
      to: email,
      subject: `${mailSubject.RECOVERY_MAIL} ${timeSended.toLocaleString()}`,
      htmlContent: mailContent,
    };
    sendMailFromGmail(mailData);
  } catch (error: any) {
    console.log(error);
  }
};

const sendPlaceOrderMail = async (
  email: string,
  orderItems: CartItemData[],
  paymentOption: PaymentOption
) => {
  try {
    const timeSended: Date = new Date();
    const totalCost: number = orderItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    const mailContent: string = await ejs.renderFile(
      path.join(__dirname, "..", "content/ejs/PlaceOrderMail.ejs"),
      {
        paymentMethod: paymentOption.paymentMethod,
        deliveryAddress: paymentOption.deliveryAddress,
        orderItems,
        totalCost,
        CLIENT_BASE_URL: EnvConfig.CLIENT_BASE_URL,
      }
    );
    const mailData: MailData = {
      to: email,
      subject: `${mailSubject.PLACE_ORDER} ${timeSended.toLocaleString()}`,
      htmlContent: mailContent,
    };
    sendMailFromGmail(mailData);
  } catch (error: any) {
    console.log(error);
  }
};

const sendCartReminderMail = async (
  email: string,
  cartItems: CartItemMail[]
): Promise<SMTPTransport.SentMessageInfo | undefined> => {
  try {
    const timeSended: Date = new Date();
    const totalCost: number = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const mailContent: string = await ejs.renderFile(
      path.join(__dirname, "..", "content/ejs/CartReminderMail.ejs"),
      {
        cartItems,
        totalCost,
      }
    );
    const mailData: MailData = {
      to: email,
      subject: `${mailSubject.CART_REMINDER} ${timeSended.toLocaleString()}`,
      htmlContent: mailContent,
    };
    const sender = await sendMailFromGmail(mailData);
    return sender;
  } catch (error: any) {
    console.log(error);
  }
};

export {
  sendVerifyMail,
  sendRecoveryMail,
  sendPlaceOrderMail,
  sendCartReminderMail,
};
