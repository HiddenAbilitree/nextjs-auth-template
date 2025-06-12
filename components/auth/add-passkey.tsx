'use client';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

export const AddPasskey = () => (
  <Button
    size='sm'
    onClick={async () => {
      await authClient.passkey.addPasskey();
    }}
  >
    Add Passkey
  </Button>
);
