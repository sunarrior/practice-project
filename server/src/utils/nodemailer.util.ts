import nodemailer from "nodemailer";
import EnvConfig from "../config/env.config";

const MAIL_CONFIG: any = {
  service: "gmail",
  auth: {
    user: EnvConfig.GMAIL_USER,
    pass: EnvConfig.GMAIL_PASSWORD,
  },
};
const transporter = nodemailer.createTransport(MAIL_CONFIG);

const sendMailFromGmail = (mailData: any) => {
  try {
    const message = {
      from: EnvConfig.GMAIL_USER,
      to: mailData.to,
      subject: mailData.subject,
      html: mailData.htmlContent,
    };
    return transporter.sendMail(message);
  } catch (err) {
    console.log(err);
  }
};

const sendVerifyMail = (email: string, token: string) => {
  try {
    const timeSended = new Date();
    const mailData = {
      to: email,
      subject: `Verify account ${timeSended.toLocaleTimeString()}`,
      htmlContent: `<b>
        Click <a href="http://localhost:3000/verify/${token}">here</a> 
        to verify your account
      </b>`,
    };
    sendMailFromGmail(mailData);
  } catch (err) {
    console.log(err);
  }
};

const sendRecoveryLink = (username: string, email: string, token: string) => {
  try {
    const timeSended = new Date();
    const mailData = {
      to: email,
      subject: `Recovery link ${timeSended.toLocaleTimeString()}`,
      htmlContent: `<b>
        Recovery link for account ${username}: 
        <a href="http://localhost:3000/recovery/${token}">Recovery Link</a>
      </b>`,
    };
    sendMailFromGmail(mailData);
  } catch (err) {
    console.log(err);
  }
};

export { sendVerifyMail, sendRecoveryLink };
