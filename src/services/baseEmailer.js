import nodemailer from "nodemailer";
import config from "../config";

export default {
  async sendEmail(options, type = "send") {
   
    const smtpConfig = {
      host:  config.mail.smtp.host,
      port:  config.mail.smtp.port,
      secure: false,
      auth: {
        user:  config.mail.smtp.user,
        pass:  config.mail.smtp.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    };

    const transport = nodemailer.createTransport(smtpConfig);
    const mailOptions = {
      from: config.mail.from_email,
      to: options.to,
      subject: options.subject,
      html: options.message,
    };

    if (options.attachments && type === "send") {
      mailOptions.attachments = options.attachments;
    }
    return new Promise((resolve, reject) => {
      transport.sendMail(
        mailOptions,
        (error, info) => {
          if (error) {
            reject(error);
          } else {
            resolve(info);
          }
        }
      );
    });
  },
};
