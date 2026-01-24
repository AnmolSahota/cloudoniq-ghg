/**
 * useDynamicForm Hook - Fixed version
 */

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { runValidations } from "../utils/runValidations";
import { getFormConfig, getFormFields, getValidationsConfig } from "../utils/configLoader";
import type {
  FormData,
  FormErrors,
  TouchedFields,
  FormConfig,
} from "../types/form.types";

interface UseDynamicFormOptions {
  formId: string;
  onSubmit: (data: FormData) => Promise<void> | void;
  initialData?: Partial<FormData>;
}

interface UseDynamicFormReturn {
  formConfig: FormConfig | null;
  formData: FormData;
  errors: FormErrors;
  touched: TouchedFields;
  isSubmitting: boolean;
  isValid: boolean;
  passwordVisibility: Record<string, boolean>;
  togglePasswordVisibility: (fieldName: string) => void;
  handleChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleBlur: (field: string) => () => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  setFieldValue: (field: string, value: string) => void;
}

// ✅ Stable empty object reference
const EMPTY_OBJECT: Partial<FormData> = {};

export function useDynamicForm({
  formId,
  onSubmit,
  initialData,
}: UseDynamicFormOptions): UseDynamicFormReturn {

  // ✅ Use ref to track if this is the first render
  const isFirstRender = useRef(true);
  const previousFormId = useRef(formId);

  // ✅ Stabilize initialData - use empty object if not provided
  const stableInitialData = useMemo(() => {
    return initialData || EMPTY_OBJECT;
  }, [initialData]);

  // ============ Get Configurations ============
  const currentFormConfig = useMemo(() => {
    return getFormConfig(formId);
  }, [formId]);

  const allFields = useMemo(() => {
    return getFormFields(formId);
  }, [formId]);

  const validationsConfig = useMemo(() => {
    return getValidationsConfig();
  }, []);

  const fieldNames = useMemo(() => Object.keys(allFields), [allFields]);

  // ============ Initialize Form Data ============
  // ✅ Compute initial data directly without useCallback to avoid dependency issues
  const computeInitialFormData = (): FormData => {
    const data: FormData = {};
    fieldNames.forEach((fieldName) => {
      const config = allFields[fieldName];
      data[fieldName] = stableInitialData[fieldName] || config?.defaultValue || "";
    });
    return data;
  };

  // ============ State ============
  const [formData, setFormData] = useState<FormData>(() => computeInitialFormData());
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState<Record<string, boolean>>({});

  // ✅ Only reset when formId ACTUALLY changes (not on every render)
  useEffect(() => {
    // Skip first render - state is already initialized
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Only reset if formId changed
    if (previousFormId.current !== formId) {
      previousFormId.current = formId;
      setFormData(computeInitialFormData());
      setErrors({});
      setTouched({});
      setPasswordVisibility({});
    }
  }, [formId]); // ✅ Only depend on formId

  // ============ Validation ============
  const validateField = useCallback(
    (fieldName: string, value: string): string | undefined => {
      const config = allFields[fieldName];
      if (!config) return undefined;

      if (config.required && (!value || value.trim() === "")) {
        return `${config.label} is required`;
      }

      if (!value || value.trim() === "") {
        return undefined;
      }

      const error = runValidations(
        value,
        config.validations || [],
        validationsConfig,
        config.constraints || {}
      );

      return error || undefined;
    },
    [allFields, validationsConfig]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    fieldNames.forEach((fieldName) => {
      const error = validateField(fieldName, formData[fieldName] || "");
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [fieldNames, formData, validateField]);

  const isValid = useMemo(() => {
    return fieldNames.every((fieldName) => {
      const error = validateField(fieldName, formData[fieldName] || "");
      return !error;
    });
  }, [fieldNames, formData, validateField]);

  // ============ Handlers ============
  const handleChange = useCallback(
    (field: string) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setFormData((prev) => ({ ...prev, [field]: value }));

        if (touched[field] && errors[field]) {
          const error = validateField(field, value);
          setErrors((prev) => ({ ...prev, [field]: error }));
        }
      },
    [touched, errors, validateField]
  );

  const handleBlur = useCallback(
    (field: string) => () => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const error = validateField(field, formData[field] || "");
      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [formData, validateField]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const allTouched: TouchedFields = {};
      fieldNames.forEach((field) => {
        allTouched[field] = true;
      });
      setTouched(allTouched);

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        await onSubmit(formData);
      } finally {
        setIsSubmitting(false);
      }
    },
    [fieldNames, validateForm, formData, onSubmit]
  );

  const resetForm = useCallback(() => {
    const data: FormData = {};
    fieldNames.forEach((fieldName) => {
      const config = allFields[fieldName];
      data[fieldName] = stableInitialData[fieldName] || config?.defaultValue || "";
    });
    setFormData(data);
    setErrors({});
    setTouched({});
  }, [fieldNames, allFields, stableInitialData]);

  const setFieldValue = useCallback((field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const togglePasswordVisibility = useCallback((fieldName: string) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  }, []);

  return {
    formConfig: currentFormConfig,
    formData,
    errors,
    touched,
    isSubmitting,
    isValid,
    passwordVisibility,
    togglePasswordVisibility,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
  };
}