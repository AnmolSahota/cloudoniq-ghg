import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { getIcon } from "../../utils/iconMapper";
import type { FieldConfig } from "../../types/form.types";

interface DynamicFieldProps {
  name: string;
  config: FieldConfig;
  value: string;
  error?: string;
  touched: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onBlur: () => void;
  passwordVisible?: boolean;
  onPasswordToggle?: () => void;
}

export function DynamicField({
  name,
  config,
  value,
  error,
  touched,
  onChange,
  onBlur,
  passwordVisible = false,
  onPasswordToggle,
}: DynamicFieldProps) {
  const showError = touched && error;
  const hasIcon = !!config.icon;

  // ✅ Ensure value is always a string
  const safeValue = value ?? "";

  const baseClasses = `
    block w-full rounded-lg border bg-white text-gray-900 
    placeholder-gray-400 transition-colors outline-none
    focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
    ${hasIcon ? "pl-10" : "pl-3"}
    ${config.type === "password" && config.showToggle ? "pr-10" : "pr-3"}
    ${showError ? "border-red-500" : "border-gray-300"}
  `;

  const getColSpanClass = () => {
    if (config.colSpan === 3) return "md:col-span-3 lg:col-span-3";
    if (config.colSpan === 2) return "md:col-span-2";
    return "";
  };

  // SELECT
  if (config.type === "select") {
    return (
      <div className={getColSpanClass()}>
        <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-gray-700">
          {config.label}
          {config.required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
        <div className="relative">
          {hasIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              {getIcon(config.icon)}
            </span>
          )}
          <select
            id={name}
            name={name}
            value={safeValue}
            onChange={onChange}
            onBlur={onBlur}
            disabled={config.disabled}
            className={`${baseClasses} h-11 appearance-none cursor-pointer pr-10`}
          >
            <option value="">{config.placeholder}</option>
            {config.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
        {showError && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  // TEXTAREA
  if (config.type === "textarea") {
    return (
      <div className={getColSpanClass()}>
        <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-gray-700">
          {config.label}
          {config.required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
        <div className="relative">
          {hasIcon && (
            <span className="pointer-events-none absolute top-3 left-0 flex items-center pl-3 text-gray-400">
              {getIcon(config.icon)}
            </span>
          )}
          <textarea
            id={name}
            name={name}
            rows={config.rows || 3}
            placeholder={config.placeholder}
            value={safeValue}
            onChange={onChange}
            onBlur={onBlur}
            disabled={config.disabled}
            readOnly={config.readOnly}
            maxLength={config.constraints?.maxLength}
            className={`${baseClasses} py-2.5 resize-none`}
          />
        </div>
        <div className="flex justify-between mt-1">
          {showError ? <p className="text-sm text-red-600">{error}</p> : <span />}
          {config.constraints?.maxLength && (
            <p className="text-xs text-gray-500">
              {safeValue.length}/{config.constraints.maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }

  // INPUT (text, email, password, tel, etc.)
  const inputType = config.type === "password" && passwordVisible ? "text" : config.type;

  return (
    <div className={getColSpanClass()}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-gray-700">
        {config.label}
        {config.required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
      <div className="relative">
        {hasIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            {getIcon(config.icon)}
          </span>
        )}
        <input
          id={name}
          name={name}
          type={inputType}
          placeholder={config.placeholder}
          value={safeValue}
          onChange={onChange}
          onBlur={onBlur}
          disabled={config.disabled}
          readOnly={config.readOnly}
          maxLength={config.constraints?.maxLength}
          minLength={config.constraints?.minLength}
          autoComplete={config.type === "password" ? "current-password" : undefined}
          className={`${baseClasses} h-11`}
        />
        {config.type === "password" && config.showToggle && onPasswordToggle && (
          <button
            type="button"
            onClick={onPasswordToggle}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {passwordVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {config.helperText && !showError && (
        <p className="mt-1 text-xs text-gray-500">{config.helperText}</p>
      )}
      {showError && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}