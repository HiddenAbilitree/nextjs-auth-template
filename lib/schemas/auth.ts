import { type } from 'arktype';

const ConfirmPassword = (data, ctx) =>
  data.password === data.confirmPassword ||
  ctx.reject({
    message: 'Must be identical to password.',
    path: ['confirmPassword'],
  });

const Email = type('string.email').configure({
  message: 'Must be a valid email address.',
});

const NewPassword = type('8<=string<=1024').configure({
  message: (ctx) =>
    `Must be at least 8 characters long. (Currently ${ctx.actual || 0})`,
});

const OTP = type('string>=6').configure({
  message: 'Must be 6 characters long.',
});

// ripped straight from https://arktype.io/docs/expressions#narrow
// configure errors https://arktype.io/docs/configuration#errors
export const SignUpFormSchema = type({
  email: Email,
  password: NewPassword,
  confirmPassword: 'string',
}).narrow(ConfirmPassword);

export const SignInFormSchema = type({
  email: Email,
  password: 'string',
});

export const TwoFactorFormSchema = type({
  otp: OTP,
  trust: 'boolean',
});

export const ForgotPasswordFormSchema = type({ email: Email });
export const MagicLinkFormSchema = type({ email: Email });

export const ResetPasswordFormSchema = type({
  password: NewPassword,
  confirmPassword: 'string',
}).narrow(ConfirmPassword);

export const ChangePasswordFormSchema = type({
  currentPassword: 'string',
  newPassword: NewPassword,
  confirmPassword: 'string',
}).narrow((data, ctx) => {
  return (
    data.newPassword === data.confirmPassword ||
    ctx.reject({
      message: 'Must be identical to the new password.',
      path: ['confirmPassword'],
    })
  );
});

export const PasswordFormSchema = type({
  password: 'string',
});
