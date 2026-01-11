// src/components/organization/organization-form.tsx
import React, { useState } from "react";
import { Building2, Save, RotateCcw, MapPin } from "lucide-react";
import Input from "../ui/input/Input";
import { runValidations } from "../../utils/runValidations";
import { toast } from "react-toastify";

// Use existing config files (same as register)
import fieldsConfig from "../../field_config/fields.config.json";
import validationsConfig from "../../field_config/validations.config.json";

// Type definitions
type FieldConfig = {
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
  rows?: number;
  colSpan?: number;
  constraints?: {
    minLength?: number;
    maxLength?: number;
  };
  validations?: string[];
};

type OrganizationData = {
  organizationCode: string;
  organizationName: string;
  address: string;
};

type FormErrors = Partial<Record<keyof OrganizationData, string>>;

interface Organization extends OrganizationData {
  id: string;
  createdAt: string;
}

const initialFormData: OrganizationData = {
  organizationCode: "",
  organizationName: "",
  address: "",
};

export function OrganizationForm() {
  // Get fields and validations from existing config
  const { fields } = fieldsConfig;
  const { validations } = validationsConfig;

  const [formData, setFormData] = useState<OrganizationData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate field using runValidations and config
  const validateField = (fieldName: keyof OrganizationData, value: string): string | null => {
    const fieldConfig = fields[fieldName] as FieldConfig;

    if (!fieldConfig) return null;

    // Required check from config
    if (fieldConfig.required && !value.trim()) {
      return `${fieldConfig.label} is required`;
    }

    if (!value.trim()) return null;

    // Use runValidations function with config
    return runValidations(
      value,
      fieldConfig.validations || [],
      validations,
      fieldConfig.constraints || {}
    );
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    (Object.keys(formData) as Array<keyof OrganizationData>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle change (same pattern as register)
  const handleChange = (field: keyof OrganizationData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field] && errors[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error || undefined }));
    }
  };

  // Handle blur (same pattern as register)
  const handleBlur = (field: keyof OrganizationData) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    if (!validateForm()) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const newOrg: Organization = {
      ...formData,
      id: `org-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setOrganizations((prev) => [...prev, newOrg]);
    setFormData(initialFormData);
    setTouched({});
    setErrors({});
    toast.success("Organization created successfully!");
    setIsSubmitting(false);
  };

  // Handle reset
  const handleReset = () => {
    setFormData(initialFormData);
    setErrors({});
    setTouched({});
  };

  // Handle delete
  const handleDelete = (id: string) => {
    setOrganizations((prev) => prev.filter((org) => org.id !== id));
    toast.success("Organization deleted!");
  };

  return (
    <div className="space-y-6">
      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Building2 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Add New Organization
            </h2>
            <p className="text-sm text-gray-500">
              Fill in the details below to create a new organization
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Organization Code & Name - Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Organization Code */}
            <Input
              name="organizationCode"
              type={fields.organizationCode.type}
              label={fields.organizationCode.label}
              placeholder={fields.organizationCode.placeholder}
              value={formData.organizationCode}
              onChange={handleChange("organizationCode")}
              onBlur={handleBlur("organizationCode")}
              error={touched.organizationCode ? errors.organizationCode : undefined}
              required={fields.organizationCode.required}
              leftIcon={<Building2 className="h-5 w-5" />}
              maxLength={fields.organizationCode.constraints?.maxLength}
            />

            {/* Organization Name */}
            <Input
              name="organizationName"
              type={fields.organizationName.type}
              label={fields.organizationName.label}
              placeholder={fields.organizationName.placeholder}
              value={formData.organizationName}
              onChange={handleChange("organizationName")}
              onBlur={handleBlur("organizationName")}
              error={touched.organizationName ? errors.organizationName : undefined}
              required={fields.organizationName.required}
              leftIcon={<Building2 className="h-5 w-5" />}
            />
          </div>

          {/* Address - Textarea */}
          <div>
            <label
              htmlFor="address"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              {fields.address.label}
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute top-3 left-0 flex items-center pl-3 text-slate-400">
                <MapPin className="h-5 w-5" />
              </span>
              <textarea
                id="address"
                name="address"
                rows={fields.address.rows || 2}
                placeholder={fields.address.placeholder}
                value={formData.address}
                onChange={handleChange("address")}
                onBlur={handleBlur("address")}
                maxLength={fields.address.constraints?.maxLength}
                className={`block w-full rounded-md border bg-white text-slate-900 placeholder-slate-400 
                  transition-colors outline-none pl-10 pr-3 py-2
                  focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                  ${touched.address && errors.address ? "border-red-500" : "border-slate-300"}`}
              />
            </div>
            {touched.address && errors.address && (
              <p className="mt-1 text-xs text-red-600">{errors.address}</p>
            )}
            <p className="mt-1 text-xs text-slate-500">
              {formData.address.length}/{fields.address.constraints?.maxLength} characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white 
                rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 
                disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSubmitting ? "Saving..." : "Save Organization"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 
                text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Organizations List */}
      {organizations.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Organizations ({organizations.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Code</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Address</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Created</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {organizations.map((org) => (
                  <tr key={org.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 font-mono text-xs">
                        {org.organizationCode}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{org.organizationName}</td>
                    <td className="py-3 px-4 text-gray-600 max-w-xs truncate">{org.address || "-"}</td>
                    <td className="py-3 px-4 text-gray-500">
                      {new Date(org.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(org.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty State */}
      {organizations.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-gray-600 font-medium">No organizations yet</h3>
          <p className="text-sm text-gray-400 mt-1">
            Create your first organization using the form above
          </p>
        </div>
      )}
    </div>
  );
}