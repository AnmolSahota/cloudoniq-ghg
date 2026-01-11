import React, { forwardRef, ReactNode, ElementType } from "react";

/* ---------------------------------- utils --------------------------------- */

function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

/* ---------------------------------- types --------------------------------- */

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "successOutline";

type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  as?: ElementType;
}

/* -------------------------------- Button ---------------------------------- */

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      leftIcon,
      rightIcon,
      loading = false,
      disabled,
      fullWidth = false,
      as: Comp = "button",
      className,
      children,
      ...rest
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium " +
      "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 " +
      "disabled:opacity-60 disabled:cursor-not-allowed";

    const sizes: Record<ButtonSize, string> = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-11 px-5 text-base",
      icon: "h-8 w-8 p-0",
    };

    const variants: Record<ButtonVariant, string> = {
      primary: "bg-brand-500 text-white hover:bg-brand-600",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
      outline:
        "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
      ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
      danger: "bg-red-600 text-white hover:bg-red-700",
      success: "bg-emerald-600 text-white hover:bg-emerald-700",
      successOutline:
        "border border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50",
    };

    const isDisabled = disabled || loading;

    return (
      <Comp
        ref={ref}
        className={cn(
          base,
          sizes[size],
          variants[variant],
          fullWidth && "w-full",
          className
        )}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        {...rest}
      >
        {/* left icon / spinner */}
        {loading ? (
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-r-transparent"
            aria-hidden
          />
        ) : (
          leftIcon && (
            <span className={cn(size === "icon" ? "" : "-ml-0.5")} aria-hidden>
              {leftIcon}
            </span>
          )
        )}

        <span className={cn(loading && "opacity-90")}>{children}</span>

        {rightIcon && !loading && (
          <span className="-mr-0.5" aria-hidden>
            {rightIcon}
          </span>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export default Button;

/* ------------------------------- IconButton ------------------------------- */

type IconIntent = "neutral" | "view" | "edit" | "delete";
type IconButtonSize = "sm" | "md";

interface IconButtonProps
  extends Omit<ButtonProps, "children" | "size" | "variant"> {
  label: string;
  intent?: IconIntent;
  size?: IconButtonSize;
  icon: React.ComponentType<{ className?: string }>;
  title?: string;
}

export function IconButton({
  label,
  intent = "neutral",
  size = "sm",
  icon: Icon,
  className,
  title,
  ...props
}: IconButtonProps) {
  const intents: Record<IconIntent, string> = {
    neutral: "text-slate-600 hover:text-slate-700 hover:bg-slate-100",
    view: "text-blue-600 hover:text-blue-700 hover:bg-blue-50",
    edit: "text-amber-600 hover:text-amber-700 hover:bg-amber-50",
    delete: "text-red-600 hover:text-red-700 hover:bg-red-50",
  };

  const iconSizes = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  const iconColorClass = intents[intent].split(" ")[0];

  return (
    <Button
      aria-label={label}
      title={title || label}
      variant="ghost"
      size="icon"
      className={cn("hover:bg-transparent", className)}
      {...props}
    >
      <Icon className={cn(iconSizes, iconColorClass)} />
      <span className="sr-only">{label}</span>
    </Button>
  );
}
