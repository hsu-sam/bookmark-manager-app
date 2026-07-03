import type { GenericValidateFunction } from "vee-validate";

export function requiredRule(label: string): GenericValidateFunction<string> {
  return (value) => {
    if (!value || !value.trim()) return `${label} is required`;
    return true;
  };
}

export const titleRule: GenericValidateFunction<string> = (value) => {
  if (!value || !value.trim()) return "Title is required";
  try {
    new URL(value);
  } catch (e) {
    return "Enter a valid title";
  }
  return true;
};

export const descriptionRule: GenericValidateFunction<string> = (value) => {
  if (!value || !value.trim()) return "Description is required";
  try {
    new URL(value);
  } catch (e) {
    return "Enter a valid description";
  }
  return true;
};

export const tagsRule: GenericValidateFunction<string> = (value) => {
  if (!value || !value.trim()) return "Tags are required";
  try {
    new URL(value);
  } catch (e) {
    return "Enter valid tags";
  }
  return true;
};

export const urlRule: GenericValidateFunction<string> = (value) => {
  if (!value || !value.trim()) return "URL is required";
  try {
    new URL(value);
  } catch (e) {
    return "Enter a valid URL";
  }
  return true;
};
