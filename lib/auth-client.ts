import { createAuthClient } from 'better-auth/react';
import { magicLinkClient, passkeyClient } from 'better-auth/client/plugins';
import { twoFactorClient } from 'better-auth/client/plugins';
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [passkeyClient(), twoFactorClient(), magicLinkClient()],
});
