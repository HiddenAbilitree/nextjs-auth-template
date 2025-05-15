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
import { useEffect } from 'react';

import { authClient } from '@/lib/auth-client';

import { arktypeResolver } from '@hookform/resolvers/arktype';
import { useForm } from 'react-hook-form';
import { SignInFormSchema } from '@/lib/schemas/auth';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { DiscordOAuth, GoogleOAuth } from '@/components/auth/oauth';

export const SignInForm = () => {
  const router = useRouter();

  const form = useForm<typeof SignInFormSchema.infer>({
    resolver: arktypeResolver(SignInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: typeof SignInFormSchema.infer) => {
    const toastId = toast.loading('Signing in...');

    // cant use toast.promise because authClient returns
    // something different to what is expected by sonner
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
      },
      {
        onSuccess: async (context) => {
          if (context.data.twoFactorRedirect) {
            toast.dismiss(toastId);
            router.push('/auth/2fa');
          } else {
            toast.success('Sign In Successful', {
              id: toastId,
            });
            router.push('/');
          }
        },
        onError: (context) =>
          void toast.error('Sign In Failed', {
            id: toastId,
            description: context.error.message,
          }),
      },
    );
  };

  // https://www.better-auth.com/docs/plugins/passkey#preload-the-passkeys
  useEffect(() => {
    if (
      !PublicKeyCredential.isConditionalMediationAvailable ||
      !PublicKeyCredential.isConditionalMediationAvailable()
    ) {
      return;
    }

    void authClient.signIn.passkey(
      { autoFill: true },
      {
        onSuccess: () => {
          toast.success('Sign In Successful!');
          router.push('/');
        },
      },
    );
  }, [router]);

  return (
    <Form {...form}>
      <form
        tabIndex={0}
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-100 flex-col gap-4 rounded-md border bg-card p-4 shadow-sm'
      >
        <div className='flex w-full flex-col gap-3.5'>
          <h1 className='w-full text-xl font-semibold'>Welcome Back</h1>
          <Separator />
        </div>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  tabIndex={10}
                  placeholder='example@acme.com'
                  autoComplete='username webauthn'
                  {...field}
                />
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
              <FormLabel className='flex w-full justify-between'>
                <p>Password</p>
                <Link
                  href='/auth/forgot-password'
                  className='underline hover:font-semibold hover:-tracking-[0.056em]'
                >
                  Forgot password?
                </Link>
              </FormLabel>
              <FormControl>
                <Input
                  tabIndex={10}
                  placeholder='••••••••'
                  type='password'
                  autoComplete='current-password webauthn'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' tabIndex={10}>
          Sign In
        </Button>
        <GoogleOAuth />
        <DiscordOAuth />
        <Link
          href='/auth/magic-link'
          className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border bg-white px-4 py-2 text-sm font-medium whitespace-nowrap text-black shadow-xs transition-all outline-none hover:cursor-pointer hover:bg-secondary/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-[>svg]:px-3 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:hover:bg-primary/90 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
        >
          Sign in with Magic Link
          <svg
            className='size-5'
            xmlns='http://www.w3.org/2000/svg'
            width='32'
            height='32'
            viewBox='0 0 24 24'
          >
            <path
              fill='currentColor'
              d='M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zM20 8l-7.475 4.675q-.125.075-.262.113t-.263.037t-.262-.037t-.263-.113L4 8v10h16zm-8 3l8-5H4zM4 8v.25v-1.475v.025V6v.8v-.012V8.25zv10z'
            />
          </svg>
        </Link>
        <span>
          Don{"'"}t have an account? Make one{' '}
          <Link
            href='/auth/signup'
            className='underline hover:font-medium hover:-tracking-[0.0565em]'
          >
            here
          </Link>
          .
        </span>
      </form>
    </Form>
  );
};
