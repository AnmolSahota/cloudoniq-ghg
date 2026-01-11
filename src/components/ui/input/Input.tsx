import React, {
  forwardRef,
  useId,
  ReactNode,
  InputHTMLAttributes,
} from "react";

/* ---------------------------------- types --------------------------------- */

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

/* ---------------------------------- Input --------------------------------- */

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      name,
      id,
      type = "text",
      value,
      defaultValue,
      onChange,
      placeholder,
      error = "",
      helperText,
      required = false,
      disabled = false,
      leftIcon,
      rightIcon,
      className = "w-full",
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = id || `${name || "input"}-${autoId}`;

    const showError = typeof error === "string" && error.trim().length > 0;
    const hintId = helperText ? `${inputId}-hint` : undefined;
    const errorId = showError ? `${inputId}-error` : undefined;

    const describedBy =
      [errorId, hintId].filter(Boolean).join(" ") || undefined;

    const baseInput =
      "block w-full rounded-md border bg-white text-slate-900 placeholder-slate-400 " +
      "transition-colors outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 " +
      "focus:ring-2 focus:ring-brand-500 focus:border-brand-500";

    const paddingLeft = leftIcon ? "pl-10" : "pl-3";
    const paddingRight = rightIcon ? "pr-10" : "pr-3";
    const height = "h-10";

    const borderClasses = showError
      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
      : "border-slate-300";

    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1 block text-sm font-medium text-slate-700 select-none"
          >
            {label}
            {required && <span className="ml-0.5 text-red-600">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Left Icon (decorative) */}
          {leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            aria-invalid={showError || undefined}
            aria-describedby={describedBy}
            className={`${baseInput} ${borderClasses} ${paddingLeft} ${paddingRight} ${height}`}
            {...rest}
          />

          {/* Right Icon (interactive) */}
          {rightIcon && (
            <span className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Helper / Error text */}
        {!showError && helperText && (
          <p id={hintId} className="mt-1 text-xs text-slate-500">
            {helperText}
          </p>
        )}

        {showError && (
          <p
            id={errorId}
            className="mt-1 text-xs text-red-600"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
