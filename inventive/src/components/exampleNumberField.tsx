import { useId, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";

// ─── Usage Examples ───────────────────────────────────────────────────────────
// Place number-field.tsx in: components/ui/number-field.tsx
// Then use it like this:

import { Label } from "@/components/ui/label";
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldStepper,
} from "@/components/ui/number-field";

function BasicExample() {
  const id = useId();
  return (
    <NumberField id={id} defaultValue={18} min={0}>
      <Label htmlFor={id}>Age</Label>
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  );
}

function DisabledExample() {
  const id = useId();
  return (
    <NumberField id={id} defaultValue={18} disabled>
      <Label htmlFor={id}>Age</Label>
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  );
}

function DecimalExample() {
  const id = useId();
  return (
    <NumberField
      id={id}
      defaultValue={5}
      formatOptions={{
        signDisplay: "exceptZero",
        minimumFractionDigits: 1,
      }}
    >
      <Label htmlFor={id}>Number</Label>
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  );
}

function PercentExample() {
  const id = useId();
  return (
    <NumberField
      id={id}
      defaultValue={0.05}
      step={0.01}
      formatOptions={{
        style: "percent",
      }}
    >
      <Label htmlFor={id}>Percent</Label>
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  );
}

function CurrencyExample() {
  const id = useId();
  return (
    <NumberField
      id={id}
      defaultValue={1500}
      formatOptions={{
        style: "currency",
        currency: "EUR",
        currencyDisplay: "code",
        currencySign: "accounting",
      }}
    >
      <Label htmlFor={id}>Balance</Label>
      <NumberFieldContent>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldContent>
    </NumberField>
  );
}

function ControlledExample() {
  const [value, setValue] = useState<number | undefined>(42);
  const id = useId();

  return (
    <div className="space-y-2">
      <NumberField
        id={id}
        value={value}
        onValueChange={setValue}
        min={0}
        max={100}
      >
        <Label htmlFor={id}>Quantity</Label>
        <NumberFieldContent>
          <NumberFieldDecrement />
          <NumberFieldInput />
          <NumberFieldIncrement />
        </NumberFieldContent>
      </NumberField>
      <p className="text-sm text-muted-foreground">
        Current value: {value ?? "empty"}
      </p>
    </div>
  );
}

function OpacityExample() {
  const id = useId();
  return (
    <NumberField id={id} defaultValue={100} min={0} max={100}>
      <Label htmlFor={id}>Opacity</Label>
      <NumberFieldContent className="h-7 w-24">
        <NumberFieldInput className="text-xs text-center px-2" />
        <NumberFieldStepper />
      </NumberFieldContent>
    </NumberField>
  );
}

export function ExampleNumberField() {
  return (
    <div className="container mx-auto">
      <Card>
        <CardContent>
          <FieldSet>
            <FieldLegend>Number Fields</FieldLegend>
            <FieldDescription>
              Different Types of Number Fields
            </FieldDescription>
            <FieldGroup>
              <Field>
                <BasicExample></BasicExample>
              </Field>
              <Field>
                <DisabledExample></DisabledExample>
              </Field>
              <Field>
                <DecimalExample></DecimalExample>
              </Field>
              <Field>
                <PercentExample></PercentExample>
              </Field>
              <Field>
                <CurrencyExample></CurrencyExample>
              </Field>
              <Field>
                <ControlledExample></ControlledExample>
              </Field>
              <Field>
                <OpacityExample></OpacityExample>
              </Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
      </Card>
    </div>
  );
}
