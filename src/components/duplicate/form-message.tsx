import type { ReactNode } from "react";

type FormMessageProps = {
  children?: ReactNode;
  variant?: "error" | "success" | "info";
};

const variantClassNames = {
  error: "text-destructive",
  success: "text-emerald-600",
  info: "text-muted-foreground",
} as const;

export function FormMessage({ children, variant = "error" }: FormMessageProps) {
  if (!children) {
    return null;
  }

  return (
    <p
      className={`text-sm ${variantClassNames[variant]}`}
      role={variant === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      {children}
    </p>
  );
}
