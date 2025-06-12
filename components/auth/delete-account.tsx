'use client';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';

export const DeleteAccount = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant='destructive'>Delete Account</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </DialogDescription>
      </DialogHeader>
      <div className='flex flex-row-reverse items-center gap-2'>
        <DialogClose asChild>
          <Button variant='default'>Cancel</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button
            variant='destructive'
            onClick={() => {
              const toastId = toast.loading(
                'Sending Account Deletion Email...',
              );
              void authClient.deleteUser(
                {
                  callbackURL: '/auth/signup',
                },
                {
                  onSuccess: async () => {
                    toast.success('Email Sent', {
                      description:
                        'Please check your email to verify account deletion.',
                      id: toastId,
                    });
                  },
                  onError: (context) => {
                    toast.error(context.error.message, { id: toastId });
                  },
                },
              );
            }}
          >
            Delete Account
          </Button>
        </DialogClose>
      </div>
    </DialogContent>
  </Dialog>
);
