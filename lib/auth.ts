import { betterAuth } from 'better-auth';
import { passkey } from 'better-auth/plugins/passkey';
import { captcha, magicLink, openAPI, twoFactor } from 'better-auth/plugins';
import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { sendEmail } from '@/lib/email';
import { Database } from '@/lib/schemas/database';
import {
  VerifyEmail,
  VerifyDeletion,
  VerifyEmailChange,
  VerifyPasswordChange,
  MagicLinkEmail,
} from '@/components/email';

const pool = new Pool({
  host: process.env.PG_HOST as string,
  database: process.env.PG_DATABASE as string,
  user: process.env.PG_USER as string,
  password: process.env.PG_PASSWORD as string,
  ssl: true,
});

const dialect = new PostgresDialect({ pool });

export const db = new Kysely<Database>({
  dialect,
});

// const addIndexes = async () => {
//   await db.schema.createIndex('emails').on('user').column('email').execute();
//   await db.schema
//     .createIndex('accountIds')
//     .on('account')
//     .column('userId')
//     .execute();
//   await db.schema
//     .createIndex('sessions')
//     .on('session')
//     .columns(['userId', 'token'])
//     .execute();
//   await db.schema
//     .createIndex('identifiers')
//     .on('verification')
//     .column('identifier')
//     .execute();
//   await db.schema
//     .createIndex('passkeyUserIds')
//     .on('passkey')
//     .column('userId')
//     .execute();
//   await db.schema
//     .createIndex('secrets')
//     .on('twoFactor')
//     .column('secret')
//     .execute();
// };

// refer to https://www.better-auth.com/docs/basic-usage           //
// and https://kysely.dev/docs/getting-started?package-manager=bun //
export const auth = betterAuth({
  plugins: [
    passkey(),
    twoFactor(),
    captcha({
      provider: process.env.CAPTCHA_PROVIDER as
        | 'cloudflare-turnstile'
        | 'google-recaptcha'
        | 'hcaptcha',
      secretKey: process.env.CAPTCHA_SECRET_KEY as string,
    }),
    openAPI(),
    magicLink({
      sendMagicLink: async ({ email, url }) =>
        sendEmail({
          mailHtml: MagicLinkEmail({ url }),
          from: process.env.EMAIL_SENDER as string,
          to: email,
          subject: 'Sign In',
        }),
    }),
  ],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    maxPasswordLength: 1024,
    sendResetPassword: async ({ user, url }) =>
      sendEmail({
        mailHtml: VerifyPasswordChange({ url }),
        from: process.env.EMAIL_SENDER as string,
        to: user.email,
        subject: 'Change Your Password',
      }),
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url }) =>
      sendEmail({
        mailHtml: VerifyEmail({ url }),
        from: process.env.EMAIL_SENDER as string,
        to: user.email,
        subject: 'Verify Your Email',
      }),
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600,
  },

  user: {
    deleteUser: {
      enabled: true,
      beforeDelete: async (user) => {
        await db
          .deleteFrom('passkey')
          .where('passkey.userId', '=', user.id)
          .execute();
        await db
          .deleteFrom('twoFactor')
          .where('twoFactor.userId', '=', user.id)
          .execute();
      },
      sendDeleteAccountVerification: async ({ user, url }) =>
        sendEmail({
          mailHtml: VerifyDeletion({ url }),
          from: process.env.EMAIL_SENDER as string,
          to: user.email,
          subject: 'Verify Account Deletion',
        }),
    },

    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url }) =>
        sendEmail({
          mailHtml: VerifyEmailChange({ url, newEmail }),
          from: process.env.EMAIL_SENDER as string,
          to: user.email,
          subject: 'Verify Email Change',
        }),
    },
  },

  socialProviders: {
    // https://www.better-auth.com/docs/authentication/google
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    discord: {
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    },
  },

  database: pool,

  appName: 'Nextjs Auth Template',

  rateLimit: { enabled: true, max: 15, window: 100 },
});
