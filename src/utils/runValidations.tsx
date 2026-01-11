type Constraints = {
  minLength?: number;
  maxLength?: number;
};

type ValidationConfig = {
  message: string;
};

type ValidationsMap = Record<string, ValidationConfig>;

export function runValidations(
  value: string,
  validationKeys: string[] = [],
  validations: ValidationsMap,
  constraints: Constraints = {}
): string | null {
  if (!value) return null;

  if (
    typeof constraints.minLength === "number" &&
    value.length < constraints.minLength
  ) {
    return `Minimum length is ${constraints.minLength}`;
  }

  if (
    typeof constraints.maxLength === "number" &&
    value.length > constraints.maxLength
  ) {
    return `Maximum length is ${constraints.maxLength}`;
  }

  for (const key of validationKeys) {
    switch (key) {
      case "alphaOnly":
        if (!/^[a-zA-Z]+$/.test(value)) {
          return validations[key]?.message ?? "Invalid characters";
        }
        break;

      case "emailFormat":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return validations[key]?.message ?? "Invalid email format";
        }
        break;

      case "noSpaces":
        if (/\s/.test(value)) {
          return validations[key]?.message ?? "Spaces are not allowed";
        }
        break;

      case "strongPassword":
        if (
          !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])/.test(value)
        ) {
          return (
            validations[key]?.message ??
            "Password does not meet complexity requirements"
          );
        }
        break;

      case "phoneFormat":
        if (!/^[+]?[\d\s-]{10,15}$/.test(value)) {
          return validations[key]?.message ?? "Invalid phone number";
        }
        break;
      case "numericOnly":
        if (!/^\d+$/.test(value)) {
          return validations[key]?.message ?? "Only numbers are allowed";
        }
        break;

      default:
        break;
    }
  }

  return null;
}
