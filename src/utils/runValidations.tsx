// src/utils/runValidations.ts

import validationsConfig from "../field_config/validations.config.json";

const { validations, messages } = validationsConfig;

interface Constraints {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

interface ValidationRule {
  type: string;
  pattern?: string;
  exact?: number;
  min?: number;
  max?: number;
  message: string;
  rules?: {
    minLength?: number;
    uppercase?: boolean;
    lowercase?: boolean;
    number?: boolean;
    specialChar?: boolean;
  };
}

export function runValidations(
  value: any,
  validationKeys: string[],
  constraints: Constraints,
  required: boolean
): string {
  const stringValue = value?.toString() ?? "";

  // Check required
  if (required && !stringValue.trim()) {
    return messages.required;
  }

  // Skip other validations if empty and not required
  if (!stringValue.trim() && !required) {
    return "";
  }

  // Check minLength constraint
  if (constraints.minLength && stringValue.length < constraints.minLength) {
    return messages.minLength.replace("{min}", String(constraints.minLength));
  }

  // Check maxLength constraint
  if (constraints.maxLength && stringValue.length > constraints.maxLength) {
    return messages.maxLength.replace("{max}", String(constraints.maxLength));
  }

  // Check min constraint (for numbers)
  if (constraints.min !== undefined) {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue < constraints.min) {
      return messages.min.replace("{min}", String(constraints.min));
    }
  }

  // Check max constraint (for numbers)
  if (constraints.max !== undefined) {
    const numValue = Number(value);
    if (isNaN(numValue) || numValue > constraints.max) {
      return messages.max.replace("{max}", String(constraints.max));
    }
  }

  // Run custom validations
  for (const key of validationKeys) {
    const rule = validations[key as keyof typeof validations] as ValidationRule;
    if (!rule) continue;

    switch (rule.type) {
      case "regex":
        if (rule.pattern) {
          const regex = new RegExp(rule.pattern);
          if (!regex.test(stringValue)) {
            return rule.message;
          }
        }
        break;

      case "length":
        if (rule.exact && stringValue.length !== rule.exact) {
          return rule.message;
        }
        break;

      case "range":
        const numVal = Number(value);
        if (isNaN(numVal)) {
          return messages.number;
        }
        if (rule.min !== undefined && numVal < rule.min) {
          return rule.message;
        }
        if (rule.max !== undefined && numVal > rule.max) {
          return rule.message;
        }
        break;

      case "composite":
        if (rule.rules) {
          const { minLength, uppercase, lowercase, number, specialChar } = rule.rules;
          
          if (minLength && stringValue.length < minLength) {
            return rule.message;
          }
          if (uppercase && !/[A-Z]/.test(stringValue)) {
            return rule.message;
          }
          if (lowercase && !/[a-z]/.test(stringValue)) {
            return rule.message;
          }
          if (number && !/[0-9]/.test(stringValue)) {
            return rule.message;
          }
          if (specialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(stringValue)) {
            return rule.message;
          }
        }
        break;
    }
  }

  return "";
}

export function validateForm(
  values: Record<string, any>,
  fieldsConfig: Record<string, any>,
  fieldNames: string[]
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const name of fieldNames) {
    const config = fieldsConfig[name];
    if (!config) continue;

    const error = runValidations(
      values[name],
      config.validations || [],
      config.constraints || {},
      config.required || false
    );

    if (error) {
      errors[name] = error;
    }
  }

  return errors;
}

export function hasErrors(errors: Record<string, string>): boolean {
  return Object.values(errors).some((error) => error !== "");
}