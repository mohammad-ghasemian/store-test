import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const spinnerVariants = cva("animate-spin text-current", {
  variants: {
    size: {
      sm: "h-3.5 w-3.5",
      md: "h-4 w-4",
      lg: "h-5 w-5",
    },
  },
  defaultVariants: { size: "md" },
});

type SpinnerProps = React.ComponentProps<"svg"> &
  VariantProps<typeof spinnerVariants>;

export function Spinner({ className, size, ...props }: SpinnerProps) {
  return (
    <Loader2
      aria-hidden="true"
      className={cn(spinnerVariants({ size }), className)}
      {...props}
    />
  );
}

export { spinnerVariants };
