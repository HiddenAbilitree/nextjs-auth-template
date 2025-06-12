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
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

import { ResetPasswordFormSchema } from '@/lib/schemas/auth';
import { authClient } from '@/lib/auth-client';
import { arktypeResolver } from '@hookform/resolvers/arktype';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';

export const ResetPasswordForm = () => {
  const token = useSearchParams().get('token') ?? undefined;
  const router = useRouter();

  const onSubmit = async (values: typeof ResetPasswordFormSchema.infer) => {
    const toastId = toast.loading('Resetting password...');
    await authClient.resetPassword(
      {
        newPassword: values.password,
        token,
      },
      {
        onSuccess: () => {
          toast.success('Password Reset Successful', {
            id: toastId,
            description: 'You can now sign in with your new password!',
          });
          router.push('/auth/signin');
        },
        onError: (context) => {
          toast.error('Error', {
            id: toastId,
            description: context.error.message,
          });
        },
      },
    );
  };

  const form = useForm<typeof ResetPasswordFormSchema.infer>({
    resolver: arktypeResolver(ResetPasswordFormSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-100 flex-col gap-5 rounded-md border bg-card p-4 shadow-sm'
      >
        <div className='flex w-full flex-col gap-3.5'>
          <h1 className='w-full text-xl font-semibold'>Reset Password</h1>
          <Separator />
        </div>
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
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
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder='••••••••' type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Reset Password</Button>
      </form>
    </Form>
  );
};
