import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Save, RotateCcw, AlertCircle } from "lucide-react";
import { DynamicField } from "./DynamicField";
import { getIcon } from "../../utils/iconMapper";
import { runValidations } from "../../utils/runValidations";
import { getFormConfig, getFormFields, getValidationsConfig } from "../../utils/configLoader";
import type {
  FormConfig,
  FieldConfig,
  FormData,
  FormErrors,
  TouchedFields,
} from "../../types/form.types";

interface DynamicFormProps {
  formId: string;
  onSubmit: (data: FormData) => Promise<void> | void;
  onCancel?: () => void;
  initialData?: Partial<FormData>;
  showResetButton?: boolean;
  showHeader?: boolean;
  generalError?: string;
  className?: string;
  cancelButtonText?: string;
}

export function DynamicForm({
  formId,
  onSubmit,
  onCancel,
  initialData = {},
  showResetButton = true,
  showHeader = true,
  generalError,
  className = "",
  cancelButtonText = "Reset",
}: DynamicFormProps) {
  // Get configurations
  const formConfig = useMemo(() => getFormConfig(formId), [formId]);
  const allFields = useMemo(() => getFormFields(formId), [formId]);
  const validations = useMemo(() => getValidationsConfig(), []);
  const fieldNames = useMemo(() => Object.keys(allFields), [allFields]);

  // ✅ Create initial form data
  const createInitialData = useCallback((): FormData => {
    const data: FormData = {};
    Object.keys(allFields).forEach((name) => {
      data[name] = initialData[name] || allFields[name]?.defaultValue || "";
    });
    console.log("Initial form data:", data); // Debug log
    return data;
  }, [allFields, initialData]);

  // State
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<TouchedFields>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState<Record<string, boolean>>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // ✅ Initialize form data when fields are loaded
  useEffect(() => {
    if (Object.keys(allFields).length > 0 && !isInitialized) {
      const initialFormData = createInitialData();
      setFormData(initialFormData);
      setIsInitialized(true);
      console.log("Form initialized with fields:", Object.keys(allFields)); // Debug log
    }
  }, [allFields, createInitialData, isInitialized]);

  // ✅ Reset when formId changes
  useEffect(() => {
    setFormData(createInitialData());
    setErrors({});
    setTouched({});
    setPasswordVisibility({});
    setIsInitialized(true);
  }, [formId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Validate single field
  const validateField = useCallback(
    (fieldName: string, value: string): string | undefined => {
      const config = allFields[fieldName];
      if (!config) {
        console.warn(`Field config not found for: ${fieldName}`);
        return undefined;
      }

      // Required check
      if (config.required && (!value || value.trim() === "")) {
        return `${config.label} is required`;
      }

      // Skip validation if empty and not required
      if (!value || value.trim() === "") {
        return undefined;
      }

      // Run validations
      const error = runValidations(
        value,
        config.validations || [],
        validations,
        config.constraints || {}
      );

      return error || undefined;
    },
    [allFields, validations]
  );

  // Validate all fields
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    console.log("Validating form data:", formData); // Debug log

    Object.keys(allFields).forEach((name) => {
      const value = formData[name] ?? "";
      const error = validateField(name, value);
      
      console.log(`Field ${name}: value="${value}", error="${error}"`); // Debug log
      
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [allFields, formData, validateField]);

  // ✅ Handle input change
  const handleChange = useCallback(
    (fieldName: string) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        
        console.log(`Field "${fieldName}" changed to:`, value); // Debug log
        
        setFormData((prev) => {
          const newData = { ...prev, [fieldName]: value };
          console.log("New form data:", newData); // Debug log
          return newData;
        });

        // Clear error on change if field was touched
        if (touched[fieldName] && errors[fieldName]) {
          const error = validateField(fieldName, value);
          setErrors((prev) => ({ ...prev, [fieldName]: error }));
        }
      },
    [touched, errors, validateField]
  );

  // Handle blur
  const handleBlur = useCallback(
    (fieldName: string) => () => {
      setTouched((prev) => ({ ...prev, [fieldName]: true }));
      const value = formData[fieldName] ?? "";
      const error = validateField(fieldName, value);
      setErrors((prev) => ({ ...prev, [fieldName]: error }));
    },
    [formData, validateField]
  );

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Submit clicked, form data:", formData); // Debug log

    // Mark all as touched
    const allTouched: TouchedFields = {};
    Object.keys(allFields).forEach((name) => {
      allTouched[name] = true;
    });
    setTouched(allTouched);

    if (!validateForm()) {
      console.log("Validation failed"); // Debug log
      return;
    }

    console.log("Validation passed, submitting..."); // Debug log
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      // Reset form after successful submit
      setFormData(createInitialData());
      setTouched({});
      setErrors({});
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle reset
  const handleReset = () => {
    setFormData(createInitialData());
    setErrors({});
    setTouched({});
  };

  // Toggle password visibility
  const togglePasswordVisibility = (fieldName: string) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  // Loading/Error states
  if (!formConfig) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Form configuration not found: {formId}</p>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Grid column classes
  const getGridCols = (columns: number = 1) => {
    switch (columns) {
      case 2:
        return "grid-cols-1 md:grid-cols-2";
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
      default:
        return "grid-cols-1";
    }
  };

  return (
    <div className={className}>
      {/* Header */}
      {showHeader && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 rounded-t-xl">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            {formConfig.icon && getIcon(formConfig.icon, "w-6 h-6")}
            {formConfig.title}
          </h2>
          {formConfig.subtitle && (
            <p className="text-indigo-100 text-sm mt-1">{formConfig.subtitle}</p>
          )}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6" noValidate>
        {/* General Error */}
        {generalError && (
          <div className="mb-6 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{generalError}</span>
          </div>
        )}

        {/* Sections */}
        {formConfig.sections.map((section) => (
          <div key={section.id} className="mb-8 last:mb-0">
            {section.title && (
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                {section.icon && (
                  <span className="text-gray-400">{getIcon(section.icon)}</span>
                )}
                {section.title}
              </h3>
            )}

            <div className={`grid ${getGridCols(section.columns)} gap-6`}>
              {Object.entries(section.fields).map(([fieldName, fieldConfig]) => {
                const config = fieldConfig as FieldConfig;
                const fieldValue = formData[fieldName] ?? "";
                
                return (
                  <DynamicField
                    key={fieldName}
                    name={fieldName}
                    config={config}
                    value={fieldValue}
                    error={errors[fieldName]}
                    touched={touched[fieldName] || false}
                    onChange={handleChange(fieldName)}
                    onBlur={handleBlur(fieldName)}
                    passwordVisible={passwordVisibility[fieldName] || false}
                    onPasswordToggle={() => togglePasswordVisibility(fieldName)}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {formConfig.loadingText}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {formConfig.submitText}
              </>
            )}
          </button>

          {showResetButton && (
            <button
              type="button"
              onClick={onCancel || handleReset}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              {cancelButtonText}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}