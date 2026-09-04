import { useId, type ComponentPropsWithoutRef } from "react";

type InputProps = {
  label: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
} & Omit<ComponentPropsWithoutRef<"input">, "className">;

export default function Input({ label, error, hint, containerClassName = "", id, ...rest }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className={containerClassName}>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={inputId}
        aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
        aria-invalid={error ? true : undefined}
        className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary-600 focus:ring-2 focus:ring-primary-100 ${
          error ? "border-accent-600" : "border-muted-200"
        }`}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-muted-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-accent-700">
          {error}
        </p>
      )}
    </div>
  );
}
