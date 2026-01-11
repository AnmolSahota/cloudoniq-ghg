import React, {
  forwardRef,
  useId,
  ReactNode,
  SelectHTMLAttributes,
} from "react";
import { ChevronDown } from "lucide-react";

/* ---------------------------------- types --------------------------------- */

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  error?: string;
  helperText?: string;
  placeholder?: string;
  options?: SelectOption[];
  className?: string;
  children?: ReactNode;
}

/* ---------------------------------- Select -------------------------------- */

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      name,
      id,
      value,
      defaultValue,
      onChange,
      placeholder,
      options,
      error = "",
      helperText,
      required = false,
      disabled = false,
      className = "w-full",
      children,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const selectId = id || `${name || "select"}-${autoId}`;

    const showError = typeof error === "string" && error.trim().length > 0;
    const hintId = helperText && !showError ? `${selectId}-hint` : undefined;
    const errorId = showError ? `${selectId}-error` : undefined;

    const describedBy =
      [errorId, hintId].filter(Boolean).join(" ") || undefined;

    const base =
      "block w-full h-10 rounded-md border bg-white text-slate-900 placeholder-slate-400 " +
      "pr-10 pl-3 appearance-none outline-none transition-colors " +
      "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 " +
      "focus:ring-2 focus:ring-brand-500 focus:border-brand-500";

    const border = showError
      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
      : "border-slate-300";

    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1 block text-sm font-medium text-slate-700 select-none"
          >
            {label}
            {required && <span className="ml-0.5 text-red-600">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            name={name}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            required={required}
            disabled={disabled}
            aria-invalid={showError || undefined}
            aria-describedby={describedBy}
            className={`${base} ${border}`}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}

            {children
              ? children
              : Array.isArray(options)
              ? options.map((opt) => (
                  <option
                    key={String(opt.value)}
                    value={opt.value}
                    disabled={opt.disabled}
                  >
                    {opt.label}
                  </option>
                ))
              : null}
          </select>

          {/* Chevron */}
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-slate-400">
            <ChevronDown className="h-5 w-5" />
          </span>
        </div>

        {!showError && helperText && (
          <p id={hintId} className="mt-1 text-xs text-slate-500">
            {helperText}
          </p>
        )}

        {showError && (
          <p
            id={errorId}
            role="alert"
            aria-live="polite"
            className="mt-1 text-xs text-red-600"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
