"use client";

import { ChevronDown, ChevronUp, Minus, Plus } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Context ──────────────────────────────────────────────────────────────────

interface NumberFieldContextValue {
  value: number | undefined;
  inputValue: string;
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  id?: string;
  increment: () => void;
  decrement: () => void;
  setValue: (val: number | undefined) => void;
  setInputValue: (val: string) => void;
  commitInput: () => void;
  formatOptions?: Intl.NumberFormatOptions;
  locale?: string;
}

const NumberFieldContext = React.createContext<NumberFieldContextValue | null>(
  null,
);

function useNumberField() {
  const ctx = React.useContext(NumberFieldContext);
  if (!ctx)
    throw new Error("NumberField components must be used within <NumberField>");
  return ctx;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function formatNumber(
  value: number | undefined,
  formatOptions?: Intl.NumberFormatOptions,
  locale?: string,
): string {
  if (value === undefined) return "";
  try {
    return new Intl.NumberFormat(locale, formatOptions).format(value);
  } catch {
    return String(value);
  }
}

function parseFormattedNumber(
  input: string,
  locale?: string,
): number | undefined {
  if (!input.trim()) return undefined;

  // Try to extract a number by stripping non-numeric characters
  // but preserving minus signs and decimal separators
  const group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, "");
  const decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, "");

  let cleaned = input;
  if (group) cleaned = cleaned.replaceAll(group, "");
  if (decimal && decimal !== ".") cleaned = cleaned.replace(decimal, ".");

  // Strip currency symbols and whitespace, keep minus and digits and dot
  cleaned = cleaned.replace(/[^\d.-]/g, "");

  const parsed = parseFloat(cleaned);
  return Number.isNaN(parsed) ? undefined : parsed;
}

// ─── NumberField (Root) ───────────────────────────────────────────────────────

interface NumberFieldProps {
  /** Current controlled value */
  value?: number;
  /** Default uncontrolled value */
  defaultValue?: number;
  /** Callback when value changes */
  onValueChange?: (value: number | undefined) => void;
  /** Minimum allowed value */
  min?: number;
  /** Maximum allowed value */
  max?: number;
  /** Step increment/decrement amount */
  step?: number;
  /** Disable the entire field */
  disabled?: boolean;
  /** HTML id for the input (used with Label) */
  id?: string;
  /** Intl.NumberFormat options for display formatting */
  formatOptions?: Intl.NumberFormatOptions;
  /** BCP 47 locale string (defaults to browser locale) */
  locale?: string;
  /** Additional class names for the root wrapper */
  className?: string;
  children: React.ReactNode;
}

const NumberField = React.forwardRef<HTMLDivElement, NumberFieldProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      onValueChange,
      min = -Infinity,
      max = Infinity,
      step = 1,
      disabled = false,
      id,
      formatOptions,
      locale,
      className,
      children,
    },
    ref,
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = React.useState<
      number | undefined
    >(defaultValue);
    const value = isControlled ? controlledValue : internalValue;

    const [inputValue, setInputValue] = React.useState(() =>
      formatNumber(value, formatOptions, locale),
    );

    // Sync formatted display when value changes externally
    React.useEffect(() => {
      setInputValue(formatNumber(value, formatOptions, locale));
    }, [value, formatOptions, locale]);

    const updateValue = React.useCallback(
      (newValue: number | undefined) => {
        const clamped =
          newValue !== undefined ? clamp(newValue, min, max) : undefined;
        if (!isControlled) setInternalValue(clamped);
        onValueChange?.(clamped);
      },
      [isControlled, min, max, onValueChange],
    );

    const valueRef = React.useRef(value);
    valueRef.current = value;

    const increment = React.useCallback(() => {
      if (disabled) return;
      const current =
        valueRef.current !== undefined
          ? valueRef.current
          : min !== -Infinity
            ? min
            : 0;
      updateValue(current + step);
    }, [disabled, min, step, updateValue]);

    const decrement = React.useCallback(() => {
      if (disabled) return;
      const current =
        valueRef.current !== undefined
          ? valueRef.current
          : max !== Infinity
            ? max
            : 0;
      updateValue(current - step);
    }, [disabled, max, step, updateValue]);

    const commitInput = React.useCallback(() => {
      const parsed = parseFormattedNumber(inputValue, locale);
      if (parsed !== undefined) {
        updateValue(parsed);
      } else {
        // Reset to current formatted value
        setInputValue(formatNumber(value, formatOptions, locale));
      }
    }, [inputValue, locale, value, formatOptions, updateValue]);

    const ctx: NumberFieldContextValue = React.useMemo(
      () => ({
        value,
        inputValue,
        min,
        max,
        step,
        disabled,
        id,
        increment,
        decrement,
        setValue: updateValue,
        setInputValue,
        commitInput,
        formatOptions,
        locale,
      }),
      [
        value,
        inputValue,
        min,
        max,
        step,
        disabled,
        id,
        increment,
        decrement,
        updateValue,
        commitInput,
        formatOptions,
        locale,
      ],
    );

    return (
      <NumberFieldContext.Provider value={ctx}>
        <div
          ref={ref}
          className={cn("space-y-2", className)}
          data-disabled={disabled || undefined}
        >
          {children}
        </div>
      </NumberFieldContext.Provider>
    );
  },
);
NumberField.displayName = "NumberField";

// ─── NumberFieldContent ───────────────────────────────────────────────────────

interface NumberFieldContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const NumberFieldContent = React.forwardRef<
  HTMLDivElement,
  NumberFieldContentProps
>(({ className, ...props }, ref) => {
  const { disabled } = useNumberField();
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-9 w-full items-center rounded-md border border-input shadow-xs",
        "has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 has-[input:focus]:ring-[3px]",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
});
NumberFieldContent.displayName = "NumberFieldContent";

// ─── NumberFieldInput ─────────────────────────────────────────────────────────

interface NumberFieldInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "type"
  > {}

const NumberFieldInput = React.forwardRef<
  HTMLInputElement,
  NumberFieldInputProps
>(({ className, onWheel, ...props }, ref) => {
  const {
    inputValue,
    setInputValue,
    commitInput,
    increment,
    decrement,
    disabled,
    id,
  } = useNumberField();
  const internalRef = React.useRef<HTMLInputElement | null>(null);

  // Merge refs
  React.useImperativeHandle(ref, () => internalRef.current!);

  // Scroll to increment/decrement when the input is focused
  React.useEffect(() => {
    const el = internalRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (document.activeElement !== el) return;
      e.preventDefault();
      if (e.deltaY < 0) {
        increment();
      } else if (e.deltaY > 0) {
        decrement();
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [increment, decrement]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      increment();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      decrement();
    } else if (e.key === "Enter") {
      commitInput();
    }
  };

  return (
    <input
      ref={internalRef}
      id={id}
      type="text"
      inputMode="decimal"
      autoComplete="off"
      value={inputValue}
      disabled={disabled}
      onChange={(e) => setInputValue(e.target.value)}
      onBlur={commitInput}
      onKeyDown={handleKeyDown}
      className={cn(
        "h-full w-full bg-transparent px-3 py-1 text-center text-sm tabular-nums",
        "placeholder:text-muted-foreground",
        "focus:outline-none",
        "disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    />
  );
});
NumberFieldInput.displayName = "NumberFieldInput";

// ─── NumberFieldIncrement ─────────────────────────────────────────────────────

interface NumberFieldIncrementProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const NumberFieldIncrement = React.forwardRef<
  HTMLButtonElement,
  NumberFieldIncrementProps
>(
  (
    {
      className,
      children,
      onPointerDown,
      onPointerUp,
      onPointerLeave,
      ...props
    },
    ref,
  ) => {
    const { increment, disabled, value, max } = useNumberField();
    const atMax = value !== undefined && value >= max;
    const intervalRef = React.useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );
    const incrementRef = React.useRef(increment);
    incrementRef.current = increment;

    const stopRepeating = React.useCallback(() => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    }, []);

    const startRepeating = React.useCallback(() => {
      incrementRef.current();
      intervalRef.current = setTimeout(function repeat() {
        incrementRef.current();
        intervalRef.current = setTimeout(repeat, 60);
      }, 400);
    }, []);

    React.useEffect(() => stopRepeating, [stopRepeating]);

    return (
      <button
        ref={ref}
        type="button"
        aria-label="Increment"
        tabIndex={-1}
        disabled={disabled || atMax}
        onPointerDown={(e) => {
          startRepeating();
          onPointerDown?.(e);
        }}
        onPointerUp={(e) => {
          stopRepeating();
          onPointerUp?.(e);
        }}
        onPointerLeave={(e) => {
          stopRepeating();
          onPointerLeave?.(e);
        }}
        className={cn(
          "inline-flex h-full items-center justify-center px-2",
          "text-muted-foreground hover:text-foreground",
          "border-l border-input",
          "transition-colors select-none",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children ?? <Plus className="size-3.5" />}
      </button>
    );
  },
);
NumberFieldIncrement.displayName = "NumberFieldIncrement";

// ─── NumberFieldDecrement ─────────────────────────────────────────────────────

interface NumberFieldDecrementProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const NumberFieldDecrement = React.forwardRef<
  HTMLButtonElement,
  NumberFieldDecrementProps
>(
  (
    {
      className,
      children,
      onPointerDown,
      onPointerUp,
      onPointerLeave,
      ...props
    },
    ref,
  ) => {
    const { decrement, disabled, value, min } = useNumberField();
    const atMin = value !== undefined && value <= min;
    const intervalRef = React.useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );
    const decrementRef = React.useRef(decrement);
    decrementRef.current = decrement;

    const stopRepeating = React.useCallback(() => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    }, []);

    const startRepeating = React.useCallback(() => {
      decrementRef.current();
      intervalRef.current = setTimeout(function repeat() {
        decrementRef.current();
        intervalRef.current = setTimeout(repeat, 60);
      }, 400);
    }, []);

    React.useEffect(() => stopRepeating, [stopRepeating]);

    return (
      <button
        ref={ref}
        type="button"
        aria-label="Decrement"
        tabIndex={-1}
        disabled={disabled || atMin}
        onPointerDown={(e) => {
          startRepeating();
          onPointerDown?.(e);
        }}
        onPointerUp={(e) => {
          stopRepeating();
          onPointerUp?.(e);
        }}
        onPointerLeave={(e) => {
          stopRepeating();
          onPointerLeave?.(e);
        }}
        className={cn(
          "inline-flex h-full items-center justify-center px-2",
          "text-muted-foreground hover:text-foreground",
          "border-r border-input",
          "transition-colors select-none",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children ?? <Minus className="size-3.5" />}
      </button>
    );
  },
);
NumberFieldDecrement.displayName = "NumberFieldDecrement";

// ─── NumberFieldCompactIncrement ──────────────────────────────────────────────

interface NumberFieldCompactIncrementProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const NumberFieldCompactIncrement = React.forwardRef<
  HTMLButtonElement,
  NumberFieldCompactIncrementProps
>(
  (
    {
      className,
      children,
      onPointerDown,
      onPointerUp,
      onPointerLeave,
      ...props
    },
    ref,
  ) => {
    const { increment, disabled, value, max } = useNumberField();
    const atMax = value !== undefined && value >= max;
    const intervalRef = React.useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );
    const incrementRef = React.useRef(increment);
    incrementRef.current = increment;

    const stopRepeating = React.useCallback(() => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    }, []);

    const startRepeating = React.useCallback(() => {
      incrementRef.current();
      intervalRef.current = setTimeout(function repeat() {
        incrementRef.current();
        intervalRef.current = setTimeout(repeat, 60);
      }, 400);
    }, []);

    React.useEffect(() => stopRepeating, [stopRepeating]);

    return (
      <button
        ref={ref}
        type="button"
        aria-label="Increment"
        tabIndex={-1}
        disabled={disabled || atMax}
        onPointerDown={(e) => {
          startRepeating();
          onPointerDown?.(e);
        }}
        onPointerUp={(e) => {
          stopRepeating();
          onPointerUp?.(e);
        }}
        onPointerLeave={(e) => {
          stopRepeating();
          onPointerLeave?.(e);
        }}
        className={cn(
          "flex items-center justify-center",
          "text-muted-foreground hover:text-foreground hover:bg-accent",
          "transition-colors select-none",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children ?? <ChevronUp className="size-3" />}
      </button>
    );
  },
);
NumberFieldCompactIncrement.displayName = "NumberFieldCompactIncrement";

// ─── NumberFieldCompactDecrement ──────────────────────────────────────────────

interface NumberFieldCompactDecrementProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const NumberFieldCompactDecrement = React.forwardRef<
  HTMLButtonElement,
  NumberFieldCompactDecrementProps
>(
  (
    {
      className,
      children,
      onPointerDown,
      onPointerUp,
      onPointerLeave,
      ...props
    },
    ref,
  ) => {
    const { decrement, disabled, value, min } = useNumberField();
    const atMin = value !== undefined && value <= min;
    const intervalRef = React.useRef<ReturnType<typeof setTimeout> | null>(
      null,
    );
    const decrementRef = React.useRef(decrement);
    decrementRef.current = decrement;

    const stopRepeating = React.useCallback(() => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }
    }, []);

    const startRepeating = React.useCallback(() => {
      decrementRef.current();
      intervalRef.current = setTimeout(function repeat() {
        decrementRef.current();
        intervalRef.current = setTimeout(repeat, 60);
      }, 400);
    }, []);

    React.useEffect(() => stopRepeating, [stopRepeating]);

    return (
      <button
        ref={ref}
        type="button"
        aria-label="Decrement"
        tabIndex={-1}
        disabled={disabled || atMin}
        onPointerDown={(e) => {
          startRepeating();
          onPointerDown?.(e);
        }}
        onPointerUp={(e) => {
          stopRepeating();
          onPointerUp?.(e);
        }}
        onPointerLeave={(e) => {
          stopRepeating();
          onPointerLeave?.(e);
        }}
        className={cn(
          "flex items-center justify-center",
          "text-muted-foreground hover:text-foreground hover:bg-accent",
          "transition-colors select-none",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children ?? <ChevronDown className="size-3" />}
      </button>
    );
  },
);
NumberFieldCompactDecrement.displayName = "NumberFieldCompactDecrement";

// ─── NumberFieldStepper ───────────────────────────────────────────────────────

interface NumberFieldStepperProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const NumberFieldStepper = React.forwardRef<
  HTMLDivElement,
  NumberFieldStepperProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex flex-col border-l border-input", className)}
      {...props}
    >
      {children ?? (
        <>
          <NumberFieldCompactIncrement className="h-1/2 px-1 border-b border-input rounded-none" />
          <NumberFieldCompactDecrement className="h-1/2 px-1 rounded-none" />
        </>
      )}
    </div>
  );
});
NumberFieldStepper.displayName = "NumberFieldStepper";

// ─── Exports ──────────────────────────────────────────────────────────────────

export {
  NumberField,
  NumberFieldContent,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
  NumberFieldCompactIncrement,
  NumberFieldCompactDecrement,
  NumberFieldStepper,
};
