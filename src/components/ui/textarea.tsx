// src/components/ui/input/Textarea.tsx

import React, { forwardRef, useId } from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  {
    label,
    name,
    id,
    error = "",
    helperText,
    required = false,
    disabled = false,
    rows = 3,
    className = "",
    ...rest
  },
  ref
) {
  const autoId = useId();
  const textareaId = id || `${name || "textarea"}-${autoId}`;

  const showError = typeof error === "string" && error.trim().length > 0;
  const hintId = helperText ? `${textareaId}-hint` : undefined;
  const errorId = showError ? `${textareaId}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  const baseTextarea =
    "block w-full rounded-lg border bg-white text-gray-900 placeholder-gray-400 " +
    "transition-colors outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 " +
    "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none px-4 py-2.5";

  const borderClasses = showError
    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
    : "border-gray-300";

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={textareaId}
          className="mb-2 block text-sm font-medium text-gray-700 select-none"
        >
          {label}
          {required && <span className="ml-0.5 text-red-600">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        name={name}
        rows={rows}
        required={required}
        disabled={disabled}
        aria-invalid={showError || undefined}
        aria-describedby={describedBy}
        className={`${baseTextarea} ${borderClasses}`}
        {...rest}
      />

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

export {Textarea};

// import * as React from "react";

// import { cn } from "./utils";

// const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
//   ({ className, ...props }, ref) => {
//     return (
//       <textarea
//         data-slot="textarea"
//         className={cn(
//           "resize-none border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
//           className,
//         )}
//         ref={ref}
//         {...props}
//       />
//     );
//   }
// );

// Textarea.displayName = "Textarea";

// export { Textarea };
