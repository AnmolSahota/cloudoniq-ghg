import type { FieldConstraints, ValidationsConfig } from "../types/form.types";

export function runValidations(
  value: string,
  validationKeys: string[] = [],
  validations: ValidationsConfig,
  constraints: FieldConstraints = {}
): string | null {
  if (!value || value.trim() === "") return null;

  const trimmedValue = value.trim();

  // Constraint checks
  if (
    typeof constraints.minLength === "number" &&
    trimmedValue.length < constraints.minLength
  ) {
    return `Minimum ${constraints.minLength} characters required`;
  }

  if (
    typeof constraints.maxLength === "number" &&
    trimmedValue.length > constraints.maxLength
  ) {
    return `Maximum ${constraints.maxLength} characters allowed`;
  }

  // Validation checks
  for (const key of validationKeys) {
    const rule = validations[key];

    switch (key) {
      case "alphaOnly":
        if (!/^[a-zA-Z\s]+$/.test(trimmedValue)) {
          return rule?.message || "Only alphabetic characters are allowed";
        }
        break;

      case "emailFormat":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
          return rule?.message || "Invalid email format";
        }
        break;

      case "noSpaces":
        if (/\s/.test(trimmedValue)) {
          return rule?.message || "Spaces are not allowed";
        }
        break;

      case "strongPassword":
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/.test(trimmedValue)) {
          return rule?.message || "Password does not meet requirements";
        }
        break;

      case "phoneFormat":
        if (!/^[+]?[\d\s-]{10,15}$/.test(trimmedValue)) {
          return rule?.message || "Invalid phone number";
        }
        break;

      case "numericOnly":
        if (!/^\d+$/.test(trimmedValue)) {
          return rule?.message || "Only numbers are allowed";
        }
        break;
    }
  }

  return null;
}