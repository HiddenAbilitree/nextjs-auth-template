import { Button, Text } from '@react-email/components';
import { EmailLayout } from '@/components/email/EmailLayout';

export const MagicLinkEmail = ({ url }: { url: string }) => (
  <EmailLayout
    title='Sign In'
    preview='If you did not request this, you can safely ignore this message.'
  >
    <Button
      className='box-border rounded-md bg-black px-4 py-3 text-center font-semibold text-white'
      href={url}
    >
      Sign In
    </Button>
    <Text className='text-xs font-light text-black/40'>
      If you did not request this, you can safely ignore this message.
    </Text>
  </EmailLayout>
);
