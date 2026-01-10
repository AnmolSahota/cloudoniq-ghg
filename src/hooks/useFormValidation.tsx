// src/hooks/useFormValidation.ts

import { useState, useCallback, useMemo } from "react";
import { runValidations, validateForm, hasErrors } from "../utils/runValidations";
import fieldsConfig from "../field_config/fields.config.json";

const { fields, forms } = fieldsConfig;

type FormName = "login" | "userForm" | "organizationForm" | "branchForm";

interface UseFormValidationProps {
  formName: FormName;
  initialValues?: Record<string, any>;
}

export function useFormValidation({ formName, initialValues = {} }: UseFormValidationProps) {
  const formConfig = forms[formName];
  const fieldNames = getFormFieldNames(formName);

  // Get default values from config
  const defaultValues = useMemo(() => {
    const defaults: Record<string, any> = {};
    for (const name of fieldNames) {
      const config = fields[name as keyof typeof fields] as any;
      if (config) {
        if (config.defaultValue !== undefined) {
          defaults[name] = config.defaultValue;
        } else if (config.type === "date") {
          defaults[name] = new Date().toISOString().split("T")[0];
        } else if (config.type === "number") {
          defaults[name] = 0;
        } else {
          defaults[name] = "";
        }
      }
    }
    return { ...defaults, ...initialValues };
  }, [fieldNames, initialValues]);

  const [values, setValues] = useState<Record<string, any>>(defaultValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      let fieldValue: any = value;

      if (type === "checkbox") {
        fieldValue = (e.target as HTMLInputElement).checked;
      } else if (type === "number") {
        fieldValue = value === "" ? "" : Number(value);
      }

      setValues((prev) => ({ ...prev, [name]: fieldValue }));

      // Validate if touched
      if (touched[name]) {
        const config = fields[name as keyof typeof fields] as any;
        if (config) {
          const error = runValidations(
            fieldValue,
            config.validations || [],
            config.constraints || {},
            config.required || false
          );
          setErrors((prev) => ({ ...prev, [name]: error }));
        }
      }
    },
    [touched]
  );

  // For select components that pass value directly
  const handleSelectChange = useCallback(
    (name: string, value: string) => {
      setValues((prev) => ({ ...prev, [name]: value }));

      if (touched[name]) {
        const config = fields[name as keyof typeof fields] as any;
        if (config) {
          const error = runValidations(
            value,
            config.validations || [],
            config.constraints || {},
            config.required || false
          );
          setErrors((prev) => ({ ...prev, [name]: error }));
        }
      }
    },
    [touched]
  );

  // For number inputs
  const handleNumberChange = useCallback(
    (name: string, value: number | string) => {
      const numValue = value === "" ? "" : Number(value);
      setValues((prev) => ({ ...prev, [name]: numValue }));

      if (touched[name]) {
        const config = fields[name as keyof typeof fields] as any;
        if (config) {
          const error = runValidations(
            numValue,
            config.validations || [],
            config.constraints || {},
            config.required || false
          );
          setErrors((prev) => ({ ...prev, [name]: error }));
        }
      }
    },
    [touched]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      const config = fields[name as keyof typeof fields] as any;
      if (config) {
        const error = runValidations(
          values[name],
          config.validations || [],
          config.constraints || {},
          config.required || false
        );
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [values]
  );

  // For programmatic blur (e.g., select components)
  const setFieldTouched = useCallback(
    (name: string) => {
      setTouched((prev) => ({ ...prev, [name]: true }));

      const config = fields[name as keyof typeof fields] as any;
      if (config) {
        const error = runValidations(
          values[name],
          config.validations || [],
          config.constraints || {},
          config.required || false
        );
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [values]
  );

  const validateAllFields = useCallback(() => {
    const newErrors = validateForm(values, fields, fieldNames);
    setErrors(newErrors);

    const allTouched = fieldNames.reduce((acc, name) => {
      acc[name] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setTouched(allTouched);

    return newErrors;
  }, [values, fieldNames]);

  const resetForm = useCallback((newValues?: Record<string, any>) => {
    setValues(newValues ? { ...defaultValues, ...newValues } : defaultValues);
    setErrors({});
    setTouched({});
  }, [defaultValues]);

  const getFieldError = useCallback(
    (name: string) => (touched[name] ? errors[name] || "" : ""),
    [errors, touched]
  );

  const getFieldConfig = useCallback(
    (name: string) => fields[name as keyof typeof fields] as any,
    []
  );

  const isValid = useMemo(() => !hasErrors(errors), [errors]);

  // Check if form has any changes from initial values
  const isDirty = useMemo(() => {
    return Object.keys(values).some(key => values[key] !== defaultValues[key]);
  }, [values, defaultValues]);

  return {
    values,
    errors,
    touched,
    isValid,
    isDirty,
    handleChange,
    handleSelectChange,
    handleNumberChange,
    handleBlur,
    setFieldTouched,
    validateAllFields,
    resetForm,
    getFieldError,
    getFieldConfig,
    setValues,
    formConfig,
    fieldNames,
  };
}

// Helper to get field names for a form
function getFormFieldNames(formName: FormName): string[] {
  const form = forms[formName] as any;

  if (!form) {
    console.warn(`Form "${formName}" not found in config`);
    return [];
  }

  if ("fields" in form && Array.isArray(form.fields)) {
    return form.fields;
  }

  if ("sections" in form && Array.isArray(form.sections)) {
    return form.sections.flatMap((s: any) => s.fields || []);
  }

  return [];
}

// Export helper for getting form config
export function getFormConfig(formName: FormName) {
  return forms[formName] as any;
}

// Export helper for getting field config
export function getFieldConfig(fieldName: string) {
  return fields[fieldName as keyof typeof fields] as any;
}