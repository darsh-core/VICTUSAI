import React from "react"
import { cn } from "../../lib/utils"

// ==========================================
// BUTTON COMPONENT
// ==========================================
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]",
          // Variants
          variant === "primary" && "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-xs",
          variant === "secondary" && "bg-slate-100 hover:bg-slate-200 text-slate-800 focus:ring-slate-400 border border-slate-200/80",
          variant === "outline" && "border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 focus:ring-blue-500 shadow-2xs",
          variant === "ghost" && "hover:bg-slate-100 text-slate-600 hover:text-slate-900",
          variant === "destructive" && "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-xs",
          // Sizes
          size === "sm" && "px-3 py-1.5 text-xs",
          size === "md" && "px-4 py-2 text-sm",
          size === "lg" && "px-5 py-2.5 text-base",
          className
        )}
        disabled={isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

// ==========================================
// CARD COMPONENT
// ==========================================
export const Card = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden", className)} {...props} />
)

export const CardHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6 py-4 border-b border-slate-100 bg-slate-50/40", className)} {...props} />
)

export const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-base font-semibold text-slate-900 tracking-tight", className)} {...props} />
)

export const CardDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-xs text-slate-500 mt-1 leading-relaxed", className)} {...props} />
)

export const CardContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6 py-4", className)} {...props} />
)

export const CardFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("px-6 py-3.5 border-t border-slate-100 bg-slate-50/40 flex justify-end gap-2", className)} {...props} />
)

// ==========================================
// BADGE COMPONENT
// ==========================================
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "error" | "info";
}

export const Badge = ({ className, variant = "default", ...props }: BadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border transition-colors",
        variant === "default" && "bg-slate-100 text-slate-700 border-slate-200",
        variant === "secondary" && "bg-blue-50 text-blue-700 border-blue-200",
        variant === "outline" && "text-slate-600 bg-white border-slate-200",
        variant === "success" && "bg-emerald-50 text-emerald-700 border-emerald-200",
        variant === "warning" && "bg-amber-50 text-amber-800 border-amber-200/80",
        variant === "error" && "bg-rose-50 text-rose-700 border-rose-200",
        variant === "info" && "bg-sky-50 text-sky-700 border-sky-200",
        className
      )}
      {...props}
    />
  )
}

// ==========================================
// PROGRESS COMPONENT (BAR)
// ==========================================
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  colorClassName?: string;
}

export const Progress = ({ className, value, colorClassName = "bg-blue-600", ...props }: ProgressProps) => {
  return (
    <div className={cn("h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60", className)} {...props}>
      <div
        className={cn("h-full transition-all duration-300", colorClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

// ==========================================
// ALERT COMPONENT
// ==========================================
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "warning" | "destructive" | "success";
}

export const Alert = ({ className, variant = "default", children, ...props }: AlertProps) => {
  return (
    <div
      className={cn(
        "p-4 rounded-lg border flex gap-3 text-sm leading-relaxed shadow-2xs",
        variant === "default" && "bg-slate-50 text-slate-800 border-slate-200",
        variant === "warning" && "bg-amber-50 text-amber-900 border-amber-200",
        variant === "destructive" && "bg-rose-50 text-rose-900 border-rose-200",
        variant === "success" && "bg-emerald-50 text-emerald-900 border-emerald-200",
        className
      )}
      role="alert"
      {...props}
    >
      <div className="flex-1">{children}</div>
    </div>
  )
}

// ==========================================
// SPINNER COMPONENT
// ==========================================
interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

export const Spinner = ({ size = "md", className }: SpinnerProps) => {
  const sizeClasses = {
    xs: "h-3 w-3 border-2",
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-2"
  };

  return (
    <div className={cn(
      "animate-spin rounded-full border-gov-blue-200 border-t-gov-blue-600",
      sizeClasses[size],
      className
    )} />
  );
};
