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
import { Separator } from '@/components/ui/separator';
import { MagicLinkFormSchema } from '@/lib/schemas/auth';
import { authClient } from '@/lib/auth-client';
import { arktypeResolver } from '@hookform/resolvers/arktype';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export const MagicLinkForm = () => {
  const onSubmit = async (values: typeof MagicLinkFormSchema.infer) => {
    const toastId = toast.loading('Sending email...');

    await authClient.signIn.magicLink(
      {
        email: values.email,
      },
      {
        onSuccess: () => {
          toast.success('Email sent!', {
            id: toastId,
            description: 'Please check your email to sign in.',
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

  const form = useForm<typeof MagicLinkFormSchema.infer>({
    resolver: arktypeResolver(MagicLinkFormSchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex w-100 flex-col gap-5 rounded-md border bg-card p-4 shadow-sm'
      >
        <div className='flex w-full flex-col gap-3.5'>
          <h1 className='w-full text-xl font-semibold'>
            Sign In with Magic Link
          </h1>
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
        <Button type='submit'>Send Email</Button>
      </form>
    </Form>
  );
};
