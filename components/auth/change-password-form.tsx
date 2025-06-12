'use client';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { ChangePasswordFormSchema } from '@/lib/schemas/auth';
import { authClient } from '@/lib/auth-client';
import { arktypeResolver } from '@hookform/resolvers/arktype';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

export const ChangePasswordForm = () => {
  const router = useRouter();

  const onSubmit = async ({
    currentPassword,
    newPassword,
  }: typeof ChangePasswordFormSchema.infer) => {
    const toastId = toast.loading('Resetting password...');
    const { error } = await authClient.changePassword({
      newPassword,
      currentPassword,
    });

    if (error) {
      toast.error('Error', {
        id: toastId,
        description: error.message,
      });
    } else {
      toast.success('Password Reset Successful', {
        id: toastId,
        description: 'You can now sign in with your new password!',
      });
      router.push('/auth/signin');
    }
  };

  const form = useForm<typeof ChangePasswordFormSchema.infer>({
    resolver: arktypeResolver(ChangePasswordFormSchema),

    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-100 flex-col gap-5 rounded-md p-4'
      >
        <FormField
          control={form.control}
          name='currentPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Password</FormLabel>
              <FormControl>
                <Input placeholder='••••••••' type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='newPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input placeholder='••••••••' type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input placeholder='••••••••' type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Change Password</Button>
      </form>
    </Form>
  );
};
