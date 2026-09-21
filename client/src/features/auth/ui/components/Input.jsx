import React from "react";
import { cn } from "../../../../lib/cn";

/**
 * Reusable text input with label + inline error, styled for the
 * dark ChatGPT-like auth screens. React 19 passes `ref` as a plain
 * prop, so no forwardRef wrapper is needed here — just destructure
 * `ref` and forward it to the underlying <input>.
 *
 * Usage with react-hook-form:
 *   <Input label="Email" error={errors.email?.message} {...register("email")} />
 */
export default function Input({
  id,
  label,
  error,
  className,
  ref,
  ...props
}) {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={cn(
          "w-full rounded-lg border bg-transparent px-3.5 py-2.5 text-[15px] text-ink",
          "placeholder:text-ink-faint",
          "border-line focus:border-line-focus focus:outline-none",
          "transition-colors",
          error && "border-danger focus:border-danger",
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}