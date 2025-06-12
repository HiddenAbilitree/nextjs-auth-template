import { Button, Text } from '@react-email/components';
import { EmailLayout } from '@/components/email/EmailLayout';

export const VerifyPasswordChange = ({ url }: { url: string }) => (
  <EmailLayout
    title='Password Change Request'
    preview='If you did not request this, please change your password immediately.'
  >
    <Button
      className='box-border rounded-md bg-red-500 px-4 py-3 text-center font-semibold text-white'
      href={url}
    >
      Change my password
    </Button>
    <Text className='text-xs font-light text-black/40'>
      If you did not request this, your account may be compromised. Change your
      password immediately to secure your account.
    </Text>
  </EmailLayout>
);
