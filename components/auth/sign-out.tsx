'use client';

import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export const SignOut = () => {
  const router = useRouter();
  return (
    <Button
      variant='destructive'
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push('/auth/signin');
            },
          },
        });
      }}
    >
      Sign Out
    </Button>
  );
};
