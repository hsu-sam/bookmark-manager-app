import type { GenericValidateFunction } from "vee-validate";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function requiredRule(label: string): GenericValidateFunction<string> {
  return (value) => {
    if (!value || !value.trim()) return `${label} is required`;
    return true;
  };
}

export const emailRule: GenericValidateFunction<string> = (value) => {
  if (!value || !value.trim()) return "Email is required";
  if (!EMAIL_REGEX.test(value)) return "Enter a valid email address";
  return true;
};

export const passwordRule: GenericValidateFunction<string> = (value) => {
  if (!value) return "Password is required";
  if (value.length < 8) return "Password must be at least 8 characters";
  return true;
};

export const confirmPasswordRule: GenericValidateFunction<string> = (
  value,
  ctx,
) => {
  if (!value) return "Please confirm your password";
  const passwordField = ctx.form.password ?? ctx.form.newPassword;
  if (value !== passwordField) return "Passwords do not match";
  return true;
};
