'use server';

/* CHANGEME */

import { createTransport } from 'nodemailer';
import { render } from '@react-email/components';

// For SES
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

// SMTP
// const transporter = createTransport({
//   host: process.env.SMTP_HOST as string,
//   port: Number(process.env.SMTP_PORT),
//   secure: true,
//   auth: {
//     user: process.env.SMTP_USERNAME as string,
//     pass: process.env.SMTP_PASSWORD as string,
//   },
// });

// SES
const sesClient = new SESv2Client({
  apiVersion: '2010-12-01',
  region: process.env.AWS_REGION as string,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
  },
});

const transporter = createTransport({
  SES: { sesClient, SendEmailCommand },
});

export const sendEmail = async ({
  mailHtml,
  from,
  to,
  subject,
}: {
  mailHtml: React.JSX.Element;
  from: string;
  to: string;
  subject: string;
}) => {
  const emailHtml = await render(mailHtml);

  await transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    html: emailHtml,
  });
};
