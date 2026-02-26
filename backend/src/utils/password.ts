import bcrypt from "bcryptjs";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hashPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword);
};

export const validatePassword = (
  password: string,
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  const minLength = 8;

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (typeof password !== "string") {
    errors.push("Password must be a string");
  } else {
    if (password.length < minLength)
      errors.push(`Minimum Password-Length is ${minLength}`);
    if (!/[A-Z]/.test(password))
      errors.push("Must contain an uppercase letter");
    if (!/[a-z]/.test(password))
      errors.push("Must contain an lowercase letter");
    if (!/\d/.test(password)) errors.push("Must contain a number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errors.push("Must contain one special char");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
