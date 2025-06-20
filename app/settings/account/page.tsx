import { AddPasskey } from '@/components/auth/add-passkey';
import { ChangePasswordForm } from '@/components/auth/change-password-form';
import { DeleteAccount } from '@/components/auth/delete-account';
import { EnableTwoFactor, TwoFactor } from '@/components/auth/two-factor';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { db } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const getPasskeys = async () => {
  'use server';

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/auth/signin');

  return await db
    .selectFrom('passkey')
    .select(['createdAt', 'name'])
    .where('passkey.userId', '=', session.user.id)
    .execute();
};

const get2faEnabled = async () => {
  'use server';

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect('/auth/signin');

  return session.user.twoFactorEnabled;
};

export default async function AuthSettings() {
  const passkeys = await getPasskeys();
  return (
    <div className='container flex flex-col items-center justify-center gap-4'>
      <Accordion type='multiple' className='w-full'>
        <AccordionItem value='password' asChild>
          <div className='flex flex-col gap-1'>
            <span className='inline-flex w-full items-center justify-between border-b p-1'>
              <h1 className='text-2xl font-medium'>Password</h1>
              <AccordionTrigger asChild>
                <Button size='sm'>Change Password</Button>
              </AccordionTrigger>
            </span>
            <AccordionContent className='border-none p-1'>
              <ChangePasswordForm />
            </AccordionContent>
            <span className='p-1'>Always Showing</span>
          </div>
        </AccordionItem>
      </Accordion>
      <div className='flex w-full flex-col gap-1'>
        <h1 className='inline-flex w-full items-center justify-between border-b p-1 text-2xl font-medium'>
          Passkeys
          <AddPasskey />
        </h1>
        {passkeys.map((passkey, i) => (
          <PasskeyItem key={i} passkey={passkey} />
        ))}
      </div>
      <div className='flex w-full flex-col gap-1'>
        <h1 className='inline-flex w-full items-center justify-between border-b p-1 text-2xl font-medium'>
          Two Factor Methods
        </h1>
        <div className='flex justify-between p-1'>
          <TwoFactor twoFactorEnabled={await get2faEnabled()} />
          <EnableTwoFactor />
        </div>
      </div>
      <div className='flex w-full flex-col gap-2'>
        <h1 className='inline-flex w-full items-center justify-between border-b p-1 text-2xl font-medium'>
          Danger Zone
        </h1>
        <DeleteAccount />
      </div>
    </div>
  );
}

const PasskeyItem = ({
  passkey,
}: {
  passkey: { name: string | null; createdAt: Date | null };
}) => (
  <div className='w-full p-1'>
    {passkey.name}
    Created At: {passkey.createdAt!.toLocaleString()}
  </div>
);
