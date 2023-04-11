export interface MailConfig {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
}

export interface MailData {
  to: string;
  subject: string;
  htmlContent: string;
}

export interface MailMessage {
  from: string;
  to: string;
  subject: string;
  html: string;
}
