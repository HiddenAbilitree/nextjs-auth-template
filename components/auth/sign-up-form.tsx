'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from 'sonner';

import { authClient } from '@/lib/auth-client';

import { arktypeResolver } from '@hookform/resolvers/arktype';
import { useForm } from 'react-hook-form';
import { SignUpFormSchema } from '@/lib/schemas/auth';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';

export const SignUpForm = () => {
  const router = useRouter();
  const form = useForm<typeof SignUpFormSchema.infer>({
    resolver: arktypeResolver(SignUpFormSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: typeof SignUpFormSchema.infer) => {
    const toastId = toast.loading('Signing up...');

    await authClient.signUp.email(
      {
        email: values.email,
        password: values.password,
        name: '',
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          router.push('/auth/signup/complete');
        },
        onError: (context) =>
          void toast.error('Sign Up Failed', {
            id: toastId,
            description:
              context.error.message === 'User already exists'
                ? 'Email is already in use.'
                : context.error.message,
          }),
      },
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-100 flex-col gap-5 rounded-md border bg-card p-4 shadow-sm'
      >
        <div className='flex w-full flex-col gap-3.5'>
          <h1 className='w-full text-xl font-semibold'>Get Started</h1>
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
        <Button type='submit'>Sign Up</Button>
        <span>
          Already have an account? Sign in{' '}
          <Link href='/auth/signin' className='underline hover:font-medium'>
            here
          </Link>
          .
        </span>
      </form>
    </Form>
  );
};
