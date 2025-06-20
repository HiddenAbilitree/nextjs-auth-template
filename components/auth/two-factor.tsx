'use client';

import { TwoFactorForm } from '@/components/auth/two-factor-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { PasswordFormSchema } from '@/lib/schemas/auth';
import { arktypeResolver } from '@hookform/resolvers/arktype';
import { Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export const TwoFactor = ({
  twoFactorEnabled,
}: {
  twoFactorEnabled: boolean | null | undefined;
}) => (
  <span className='inline-flex items-center gap-2'>
    <Smartphone />
    Authenticator
    {twoFactorEnabled && (
      <Badge
        className='border-green-[#3FB950] text-green-[#3FB950]'
        variant='outline'
      >
        Enabled
      </Badge>
    )}
  </span>
);

export const EnableTwoFactor = () => {
  const [openPasswordForm, setOpenPasswordForm] = useState(false);
  const [openTOTP, setOpenTOTP] = useState(false);
  const [totpURI, setTOTPURI] = useState<string | undefined>();
  return (
    <>
      <Dialog open={openPasswordForm} onOpenChange={setOpenPasswordForm}>
        <Button variant='outline' onClick={() => setOpenPasswordForm(true)}>
          Enable 2FA
        </Button>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Enable 2FA</DialogTitle>
            <DialogDescription>
              Enter your password to enable 2FA
            </DialogDescription>
          </DialogHeader>
          <PasswordForm
            setOpenPasswordForm={setOpenPasswordForm}
            setOpenTOTP={setOpenTOTP}
            setTOTPURI={setTOTPURI}
          />
        </DialogContent>
      </Dialog>
      {openTOTP && (
        <>
          <VerifyTOTP totpURI={totpURI ?? ''} /> <TwoFactorForm />
        </>
      )}
    </>
  );
};

export const PasswordForm = ({
  setOpenPasswordForm,
  setOpenTOTP,
  setTOTPURI,
}: {
  setOpenPasswordForm(val: boolean): void; //react is so trash holy
  setOpenTOTP(val: boolean): void;
  setTOTPURI(val: string): void;
}) => {
  const onSubmit = async (values: typeof PasswordFormSchema.infer) => {
    await authClient.twoFactor.enable(
      {
        password: values.password,
      },
      {
        onSuccess: (context) => {
          setTOTPURI(context.data.totpURI);
          setOpenPasswordForm(false);
          setOpenTOTP(true);
        },
        onError: () => void toast.error('Incorrect Password'),
      },
    );
  };

  const form = useForm<typeof PasswordFormSchema.infer>({
    resolver: arktypeResolver(PasswordFormSchema),
    defaultValues: {
      password: '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex flex-col gap-5 rounded-md'
      >
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
        <Button type='submit'>Enable TOTP 2fa</Button>
      </form>
    </Form>
  );
};

export const VerifyTOTP = ({ totpURI }: { totpURI: string }) => (
  <div className='bg-white p-2'>
    <QRCodeSVG value={totpURI} size={256} />
  </div>
);
