// @ts-ignore
import {SentMessageInfo} from 'nodemailer';
import {email} from '../config';
// @ts-ignore
// import Mail = require('nodemailer/lib/mailer');
const nodemailer = require('nodemailer');

export const sendMail = function (mailOptions: {
  to: string;
  subject: string;
  body: string;
}): Promise<SentMessageInfo> {
  const {to, subject, body} = mailOptions;
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.MAIL,
      pass: process.env.APP_PASWD,
    },
  });
  return transporter.sendMail({
    from: `"PELLIFIX"<pellifixmatrimony@gmail.com>`, // sender address
    to, // list of receivers
    subject, // Subject line
    // text: 'Hello world?', // plain text body
    html: body, // html body
  });
};
