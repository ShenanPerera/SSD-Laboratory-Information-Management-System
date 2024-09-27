export function lowerCasePattern() {
  return new RegExp(/[a-z]/);
}

export function upperCasePattern() {
  return /[A-Z]/;
}

export function specialCharacterPattern() {
  return /[`~!@#$%^&*()-+{}[\]\\|=,.//?;<>':"_-]/;
}

export function numberPattern() {
  return /\d/;
}
