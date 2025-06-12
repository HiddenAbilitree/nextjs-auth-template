import { Button, Text } from '@react-email/components';
import { EmailLayout } from '@/components/email/EmailLayout';

export const VerifyEmailChange = ({
  url,
  newEmail,
}: Readonly<{ url: string; newEmail: string }>) => (
  <EmailLayout
    title='Verify Email Change'
    preview='If you did not request this, please change your password immediately.'
  >
    <Text className='text-black'>
      Only click the following button if you have authorized the email change to{' '}
      <strong>{newEmail}</strong>. If you do not recognize this email,
      <strong>do not</strong> click the button and change your password
      immediately to prevent further unauthorized access.
    </Text>
    <Button
      className='box-border rounded-md bg-red-500 px-4 py-3 text-center font-semibold text-white'
      href={url}
    >
      Change My Email
    </Button>
    <Text className='text-xs font-light text-black/40'>
      If you did not request this, your account may be compromised. Change your
      password immediately to secure your account.
    </Text>
  </EmailLayout>
);
