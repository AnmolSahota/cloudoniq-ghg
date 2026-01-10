// src/components/ui/input/Input.tsx

import React, { forwardRef, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    name,
    id,
    type = "text",
    error = "",
    helperText,
    required = false,
    disabled = false,
    leftIcon,
    rightIcon,
    showPasswordToggle = false,
    className = "",
    ...rest
  },
  ref
) {
  const autoId = useId();
  const inputId = id || `${name || "input"}-${autoId}`;
  const [showPassword, setShowPassword] = useState(false);

  const showError = typeof error === "string" && error.trim().length > 0;
  const hintId = helperText ? `${inputId}-hint` : undefined;
  const errorId = showError ? `${inputId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  // Determine actual input type
  const actualType = type === "password" && showPassword ? "text" : type;

  // Determine if we should show password toggle
  const shouldShowToggle = type === "password" && showPasswordToggle;

  const baseInput =
    "block w-full rounded-lg border bg-white text-gray-900 placeholder-gray-400 " +
    "transition-colors outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 " +
    "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500";

  const paddingLeft = leftIcon ? "pl-10" : "pl-3";
  const paddingRight = rightIcon || shouldShowToggle ? "pr-10" : "pr-3";
  const height = "h-11 py-2.5";
  const borderClasses = showError
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "border-gray-300";

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-gray-700 select-none"
        >
          {label}
          {required && <span className="ml-0.5 text-red-600">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={actualType}
          required={required}
          disabled={disabled}
          aria-invalid={showError || undefined}
          aria-describedby={describedBy}
          className={`${baseInput} ${borderClasses} ${paddingLeft} ${paddingRight} ${height}`}
          {...rest}
        />

        {/* Password Toggle */}
        {shouldShowToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        )}

        {/* Right Icon (when not password) */}
        {rightIcon && !shouldShowToggle && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightIcon}
          </span>
        )}
      </div>

      {/* Helper or Error text */}
      {!showError && helperText && (
        <p id={hintId} className="mt-1 text-xs text-gray-500">
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
});

export {Input};


// import * as React from "react";

// import { cn } from "./utils";

// const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
//   ({ className, type, ...props }, ref) => {
//     return (
//       // <input
//       //   type={type}
//       //   data-slot="input"
//       //   className={cn(
//       //     "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//       //     "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
//       //     "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
//       //     className,
//       //   )}
//       //   ref={ref}
//       //   {...props}
//       // />
//       <input
//         type={type}
//         data-slot="input"
//         className={cn(
//           "text-black file:text-black placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//           "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
//           "aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
//           className
//         )}
//       />

//     );
//   }
// );

// Input.displayName = "Input";

// export { Input };
