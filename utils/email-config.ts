import nodemailer from "nodemailer";
import { AttachmentLike } from "nodemailer/lib/mailer";
import { Readable } from "stream";

type toEmail = string;
type template = string | Buffer | Readable | AttachmentLike | undefined;

export const sendEmailService = async (
  toEmail: toEmail,
  template: template,
  subject: string = "Thank You for Contacting Luxafar - Where Journeys are Unique!"
) => {
  if (process.env.NEXT_PUBLIC_API_URL === "https://luxafar.com") {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "no-reply@luxafar.com",
        pass: process.env.NEXT_PUBLIC_MAIL_SERVER_PASS,
      },
    });
    let mailOptionsToSender = {
      from: "no-reply@luxafar.com",
      to: toEmail,
      subject,
      html: template,
    };
    await transporter.sendMail(mailOptionsToSender);
  } else {
    const transporter = nodemailer.createTransport({
      host: "mail.ideabox.pk",
      tls: {
        rejectUnauthorized: false,
      },
      port: 465,
      secure: true,
      auth: {
        user: "demo.luxafar@ideabox.pk",
        pass: process.env.NEXT_PUBLIC_SECONDARY_MAIL_SERVER_PASS,
      },
    });
    let mailOptionsToSender = {
      from: "demo.luxafar@ideabox.pk",
      to: toEmail,
      subject,
      html: template,
    };
    await transporter.sendMail(mailOptionsToSender);
  }
};

export const sendEmailServicePopUp = async (
  toEmail: toEmail,
  template: template,
  subject: string = "Thank You for Contacting Luxafar - Where Journeys are Unique!"
) => {
  if (process.env.NEXT_PUBLIC_API_URL === "https://luxafar.com") {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "marketing@luxafar.com",
        pass: process.env.NEXT_PUBLIC_TERTIARY_MAIL_SERVER_PASS,
      },
    });
    let mailOptionsToSender = {
      from: "marketing@luxafar.com",
      to: toEmail,
      subject,
      html: template,
    };
    await transporter.sendMail(mailOptionsToSender);
  } else {
    const transporter = nodemailer.createTransport({
      host: "mail.ideabox.pk",
      tls: {
        rejectUnauthorized: false,
      },
      port: 465,
      secure: true,
      auth: {
        user: "demo.luxafar@ideabox.pk",
        pass: process.env.NEXT_PUBLIC_SECONDARY_MAIL_SERVER_PASS,
      },
    });
    let mailOptionsToSender = {
      from: "demo.luxafar@ideabox.pk",
      to: toEmail,
      subject,
      html: template,
    };
    await transporter.sendMail(mailOptionsToSender);
  }
};
