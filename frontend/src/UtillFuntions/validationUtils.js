import {
  lowerCasePattern,
  numberPattern,
  specialCharacterPattern,
  upperCasePattern,
} from '../regex/regexPatterns';

export const validatePassword = (password) => {
  if (!password) {
    return true;
  }

  if (password?.length <= 8) {
    return 'Password must be at least 8 characters long';
  }

  if (!lowerCasePattern()?.test(password)) {
    return 'Password must contain a lowercase character';
  }

  if (!upperCasePattern()?.test(password)) {
    return 'New password must contain at least one uppercase character';
  }

  if (!specialCharacterPattern()?.test(password)) {
    return 'New password must contain at least one special character[@,$,%]';
  }

  if (!numberPattern()?.test(password)) {
    return 'New password must contain at least one number';
  }

  return true;
};
