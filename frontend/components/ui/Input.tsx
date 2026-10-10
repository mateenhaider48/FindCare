import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type InputProps = ComponentProps<"input"> & {
  label: string;
  error?: string;
  /** Rendered inside the field on the right, e.g. a show/hide button. */
  trailing?: React.ReactNode;
};

export default function Input({ label, error, trailing, id, className, ...props }: InputProps) {
  const inputId = id ?? props.name;
  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          className={cn(
            "h-11 w-full rounded-xl border border-line bg-white px-4 text-sm text-ink placeholder:text-muted",
            "focus-visible:border-primary focus-visible:outline-2 focus-visible:outline-primary/30",
            error && "border-danger",
            trailing && "pr-11",
            className,
          )}
          {...props}
        />
        {trailing && <div className="absolute inset-y-0 right-2 flex items-center">{trailing}</div>}
      </div>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
