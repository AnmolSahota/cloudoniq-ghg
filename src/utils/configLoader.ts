/**
 * Config Loader Utility
 * 
 * Safely loads and types the JSON configuration files.
 * This avoids TypeScript strict checking issues with JSON imports.
 */

import formConfigJson from "../field_config/forms.config.json";
import validationsConfigJson from "../field_config/validations.config.json";
import type { FormConfig, FieldConfig, ValidationsConfig, FormSection } from "../types/form.types";

// ============ Form Config ============

/**
 * Get form configuration by form ID
 */
export function getFormConfig(formId: string): FormConfig | null {
  const config = (formConfigJson as Record<string, unknown>)[formId];
  
  if (!config) {
    console.warn(`Form config not found for: ${formId}`);
    return null;
  }

  return config as FormConfig;
}

/**
 * Get all fields from a form (flattened from all sections)
 */
export function getFormFields(formId: string): Record<string, FieldConfig> {
  const formConfig = getFormConfig(formId);
  
  if (!formConfig) {
    return {};
  }

  const allFields: Record<string, FieldConfig> = {};
  
  formConfig.sections.forEach((section) => {
    const sectionFields = section.fields as Record<string, FieldConfig>;
    Object.entries(sectionFields).forEach(([fieldName, fieldConfig]) => {
      if (fieldConfig) {
        allFields[fieldName] = fieldConfig;
      }
    });
  });

  return allFields;
}

/**
 * Get field names from a form
 */
export function getFormFieldNames(formId: string): string[] {
  const fields = getFormFields(formId);
  return Object.keys(fields);
}

/**
 * Get a specific field config from a form
 */
export function getFieldConfig(formId: string, fieldName: string): FieldConfig | null {
  const fields = getFormFields(formId);
  return fields[fieldName] || null;
}

// ============ Validations Config ============

/**
 * Get all validation rules
 */
export function getValidationsConfig(): ValidationsConfig {
  return validationsConfigJson.validations as ValidationsConfig;
}

/**
 * Get a specific validation rule
 */
export function getValidationRule(key: string): { message: string } | null {
  const validations = getValidationsConfig();
  return validations[key] || null;
}

// ============ Export raw configs (typed) ============

export const formConfigs = formConfigJson as Record<string, unknown>;
export const validationConfigs = validationsConfigJson.validations as ValidationsConfig;