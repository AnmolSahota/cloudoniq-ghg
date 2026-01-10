// src/utils/formHelpers.ts

import type { UserPermissions } from "../pages/context/PermissionsContext";

export interface FieldConfig {
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  order?: number;
  icon?: string;
  validations?: string[];
  constraints?: {
    minLength?: number;
    maxLength?: number;
  };
  permissionKey?: keyof UserPermissions;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  defaultValue?: string;
  showToggle?: boolean;
  rows?: number;
  colSpan?: number;
  showPermissionWarning?: boolean;
  dynamicOptions?: {
    source: string;
    filterByPermission: boolean;
  };
}

export interface SectionConfig {
  id: string;
  title: string;
  icon: string;
  order: number;
  columns: number;
  fields: string[];
  permissionRequired?: keyof UserPermissions;
}

export interface FormConfig {
  formId: string;
  formTitle: string;
  sections?: SectionConfig[];
  fields: Record<string, FieldConfig>;
  submitButton?: {
    text: string;
    loadingText?: string;
    icon?: string;
    permissionKey?: keyof UserPermissions;
  };
  resetButton?: {
    text: string;
    icon?: string;
  };
}

/**
 * Get initial form values from config
 */
export function getInitialValues<T extends Record<string, any>>(
  fieldsConfig: Record<string, FieldConfig>
): T {
  const values: Record<string, any> = {};
  
  for (const [fieldName, config] of Object.entries(fieldsConfig)) {
    values[fieldName] = config.defaultValue ?? "";
  }
  
  return values as T;
}

/**
 * Check if field is disabled based on permissions
 */
export function isFieldDisabled(
  fieldConfig: FieldConfig,
  permissions: UserPermissions
): boolean {
  if (!fieldConfig.permissionKey) return false;
  return !permissions[fieldConfig.permissionKey];
}

/**
 * Get filtered options based on permissions
 */
export function getFilteredOptions(
  fieldConfig: FieldConfig,
  permissions: UserPermissions
): Array<{ value: string; label: string; disabled?: boolean }> {
  if (!fieldConfig.options) return [];
  
  if (!fieldConfig.dynamicOptions?.filterByPermission) {
    return fieldConfig.options;
  }

  const source = fieldConfig.dynamicOptions.source as keyof UserPermissions;
  const allowedValues = permissions[source] as string[] | undefined;

  if (!allowedValues || allowedValues.length === 0) {
    return fieldConfig.options;
  }

  return fieldConfig.options.filter(
    (opt) => opt.disabled || allowedValues.includes(opt.value)
  );
}

/**
 * Get icon component based on icon name
 */
export function getIconName(iconName: string | undefined): string {
  const iconMap: Record<string, string> = {
    user: "User",
    mail: "Mail",
    lock: "Lock",
    phone: "Phone",
    building: "Building2",
    mapPin: "MapPin",
    shield: "Shield",
    save: "Save",
    x: "X",
    eye: "Eye",
    eyeOff: "EyeOff",
  };
  
  return iconMap[iconName || ""] || "";
}

/**
 * Sort fields by order
 */
export function getSortedFields(
  fieldsConfig: Record<string, FieldConfig>
): Array<[string, FieldConfig]> {
  return Object.entries(fieldsConfig).sort(
    (a, b) => (a[1].order || 0) - (b[1].order || 0)
  );
}

/**
 * Get fields for a section
 */
export function getSectionFields(
  section: SectionConfig,
  fieldsConfig: Record<string, FieldConfig>
): Array<[string, FieldConfig]> {
  return section.fields
    .map((fieldName) => [fieldName, fieldsConfig[fieldName]] as [string, FieldConfig])
    .filter(([_, config]) => config !== undefined);
}