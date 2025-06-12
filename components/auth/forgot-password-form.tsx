'use client';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';
import { arktypeResolver } from '@hookform/resolvers/arktype';
import { useForm } from 'react-hook-form';
import { ForgotPasswordFormSchema } from '@/lib/schemas/auth';

export const ForgotPasswordForm = () => {
  const onSubmit = async (values: typeof ForgotPasswordFormSchema.infer) => {
    const toastId = toast.loading('Sending email...');

    await authClient.forgetPassword(
      {
        email: values.email,
        redirectTo: '/auth/reset-password',
      },
      {
        onSuccess: () => {
          toast.success('Email sent!', {
            id: toastId,
            description: 'Please check your email to reset your password.',
          });
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

  const form = useForm<typeof ForgotPasswordFormSchema.infer>({
    resolver: arktypeResolver(ForgotPasswordFormSchema),
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
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='example@acme.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Request Password Reset</Button>
      </form>
    </Form>
  );
};
