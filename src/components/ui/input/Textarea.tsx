import React, {
  forwardRef,
  TextareaHTMLAttributes,
} from "react";

/* ---------------------------------- types --------------------------------- */

interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "rows"> {
  label?: string;
  error?: string;
  helperText?: string;
  rows?: number;
  className?: string;
}

/* -------------------------------- Textarea -------------------------------- */

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      name,
      id,
      value,
      defaultValue,
      onChange,
      placeholder,
      error = "",
      helperText,
      required = false,
      disabled = false,
      rows = 3,
      className = "w-full",
      ...rest
    },
    ref
  ) => {
    const showError = typeof error === "string" && error.trim().length > 0;

    const inputId =
      id || `${name || "textarea"}-${Math.random().toString(36).slice(2)}`;

    const base =
      "block w-full rounded-md border bg-white text-slate-900 placeholder:text-slate-400 px-3 py-2 " +
      "transition-colors outline-none disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 " +
      "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2";

    const border = showError ? "border-danger-500" : "border-app-border";

    return (
      <div className={className}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            {label}
            {required && <span className="ml-0.5 text-danger-600">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          className={`${base} ${border} resize-y`}
          {...rest}
        />

        {!showError && helperText && (
          <p className="mt-1 text-xs text-slate-500">{helperText}</p>
        )}

        {showError && (
          <p
            className="mt-1 text-xs text-danger-600"
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

Textarea.displayName = "Textarea";

export default Textarea;
