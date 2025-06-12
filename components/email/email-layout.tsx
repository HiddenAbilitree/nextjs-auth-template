import {
  Html,
  Head,
  Container,
  Section,
  Tailwind,
  Preview,
} from '@react-email/components';
import { Header } from '@/components/email/ui/Header';

export const EmailLayout = ({
  children,
  preview,
  title,
}: Readonly<{ children: React.ReactNode; preview: string; title: string }>) => {
  return (
    <Html>
      <Head>
        <title>{title}</title>
        {/* Something something font is broken see here https://github.com/resend/react-email/issues/501
         * This is scuffed workaround
         * */}
        <style>
          {`
            @import url('https://cdn.staticdelivr.com/gfonts/css2?family=Geist');
            * {
              font-family: 'Geist', sans;
            }`}
        </style>
      </Head>
      <Tailwind>
        <Preview>{preview}</Preview>
        <Container className='my-6 w-96 rounded-md bg-zinc-100/35 p-4 outline outline-zinc-300/35'>
          <Header />
          <Section className='mt-4 text-center'>{children}</Section>
        </Container>
      </Tailwind>
    </Html>
  );
};
