export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldConstraints {
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

export interface FieldConfig {
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  icon?: string;
  showToggle?: boolean;
  rows?: number;
  colSpan?: number;
  constraints?: FieldConstraints;
  validations?: string[];
  options?: FieldOption[];
  helperText?: string;
  disabled?: boolean;
  readOnly?: boolean;
  defaultValue?: string;  // ✅ Added this
}

export interface FormSection {
  id: string;
  title?: string;
  icon?: string;
  columns?: number;
  fields: Record<string, FieldConfig>;
}

export interface FormConfig {
  id: string;
  title: string;
  subtitle?: string;
  submitText: string;
  loadingText: string;
  icon?: string;
  sections: FormSection[];
}

// ✅ Add this type for the full config
export type FormsConfigType = Record<string, FormConfig>;

export type FormData = Record<string, string>;
export type FormErrors = Record<string, string | undefined>;
export type TouchedFields = Record<string, boolean>;

export interface ValidationRule {
  message: string;
  pattern?: string;
}

export type ValidationsConfig = Record<string, ValidationRule>;