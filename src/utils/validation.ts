export interface IValidationText {
  value: string;
  required?: boolean;
  minLength: number;
  maxLength: number;
}

export function isValidInput(validationInput: IValidationText) {
  const inputLength = validationInput.value.trim().length;
  const { required, minLength, maxLength } = validationInput;

  if (!required) return true;
  if (!inputLength) return false;
  if (inputLength < minLength || inputLength > maxLength) return false;
  return true;
}
