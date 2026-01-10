// src/components/ui/FormField.tsx

import React, { useState, useId } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  User,
  Building2,
  MapPin,
  Shield,
  ChevronDown,
  Lock as LockIcon,
} from "lucide-react";

import fieldsConfig from "../../field_config/fields.config.json";

const { fields } = fieldsConfig;

// Icon map
const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  mail: Mail,
  lock: Lock,
  phone: Phone,
  user: User,
  building: Building2,
  mapPin: MapPin,
  shield: Shield,
};

interface FormFieldProps {
  name: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  error?: string;
  disabled?: boolean;
  showPermissionWarning?: boolean;
}

export default function FormField({
  name,
  value,
  onChange,
  onBlur,
  error = "",
  disabled = false,
  showPermissionWarning = false,
}: FormFieldProps) {
  const config = fields[name as keyof typeof fields] as any;
  if (!config) return null;

  const autoId = useId();
  const inputId = `${name}-${autoId}`;
  const [showPassword, setShowPassword] = useState(false);

  const showError = error.length > 0;
  const Icon = config.icon ? IconMap[config.icon] : null;

  // Base styles
  const baseInput =
    "block w-full rounded-lg border bg-white text-gray-900 placeholder-gray-400 " +
    "transition-colors outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 " +
    "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  const borderClasses = showError
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "border-gray-300";

  const height = "h-11 py-2.5";

  // Render label
  const renderLabel = () => (
    <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-gray-700">
      {config.label}
      {config.required && <span className="ml-0.5 text-red-600">*</span>}
    </label>
  );

  // Render error
  const renderError = () =>
    showError && (
      <p className="mt-1 text-xs text-red-600" role="alert">
        {error}
      </p>
    );

  // Render permission warning
  const renderPermissionWarning = () =>
    disabled && showPermissionWarning && (
      <p className="mt-1 text-xs text-amber-600 flex items-center gap-1">
        <LockIcon className="w-3 h-3" />
        No permission to change
      </p>
    );

  // SELECT
  if (config.type === "select") {
    return (
      <div>
        {renderLabel()}
        <div className="relative">
          <select
            id={inputId}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={config.required}
            className={`${baseInput} ${borderClasses} ${height} px-4 pr-10 appearance-none cursor-pointer`}
          >
            {config.options?.map((opt: any) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
        {renderError()}
        {renderPermissionWarning()}
      </div>
    );
  }

  // TEXTAREA
  if (config.type === "textarea") {
    return (
      <div className={config.colSpan === 3 ? "md:col-span-3" : ""}>
        {renderLabel()}
        <textarea
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={config.required}
          placeholder={config.placeholder}
          rows={config.rows || 2}
          className={`${baseInput} ${borderClasses} px-4 py-2.5 resize-none`}
        />
        {renderError()}
      </div>
    );
  }

  // PASSWORD with toggle
  if (config.type === "password" && config.showToggle) {
    return (
      <div>
        {renderLabel()}
        <div className="relative">
          {Icon && (
            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          )}
          <input
            id={inputId}
            name={name}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled}
            required={config.required}
            placeholder={config.placeholder}
            className={`${baseInput} ${borderClasses} ${height} ${Icon ? "pl-10" : "pl-4"} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {renderError()}
      </div>
    );
  }

  // DEFAULT INPUT (text, email, tel, etc.)
  return (
    <div>
      {renderLabel()}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        )}
        <input
          id={inputId}
          name={name}
          type={config.type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={config.required}
          placeholder={config.placeholder}
          maxLength={config.constraints?.maxLength}
          className={`${baseInput} ${borderClasses} ${height} ${Icon ? "pl-10" : "pl-4"} pr-4`}
        />
      </div>
      {renderError()}
    </div>
  );
}