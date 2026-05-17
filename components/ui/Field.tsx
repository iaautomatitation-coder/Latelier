import { cn } from "@/lib/utils/cn";
import type { ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes, InputHTMLAttributes } from "react";

export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="flex items-center gap-1.5 text-xs font-medium text-ink-mid">
        {label}
        {required ? <span className="text-signal-crit">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="text-2xs text-signal-crit">{error}</p>
      ) : hint ? (
        <p className="text-2xs text-ink-low">{hint}</p>
      ) : null}
    </div>
  );
}

const baseInput =
  "w-full rounded border bg-canvas px-2.5 py-1.5 text-sm text-ink-high placeholder:text-ink-low focus:outline-none focus:ring-1 disabled:opacity-50";

export function TextInput({
  invalid,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      {...props}
      className={cn(
        baseInput,
        invalid
          ? "border-signal-crit/60 focus:border-signal-crit focus:ring-signal-crit"
          : "border-surface-border focus:border-accent focus:ring-accent",
        className,
      )}
    />
  );
}

export function TextArea({
  invalid,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) {
  return (
    <textarea
      {...props}
      className={cn(
        baseInput,
        "min-h-[88px] resize-y",
        invalid
          ? "border-signal-crit/60 focus:border-signal-crit focus:ring-signal-crit"
          : "border-surface-border focus:border-accent focus:ring-accent",
        className,
      )}
    />
  );
}

export function Select({
  invalid,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) {
  return (
    <select
      {...props}
      className={cn(
        baseInput,
        "appearance-none bg-[length:14px] bg-[right_8px_center] bg-no-repeat pr-7",
        invalid
          ? "border-signal-crit/60 focus:border-signal-crit focus:ring-signal-crit"
          : "border-surface-border focus:border-accent focus:ring-accent",
        className,
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239aa3b7' stroke-width='2'><path stroke-linecap='round' stroke-linejoin='round' d='m6 9 6 6 6-6'/></svg>\")",
      }}
    >
      {children}
    </select>
  );
}
