import { useEffect } from "react";
import {
  RegisterOptions,
  FieldValues,
  FieldPath,
  Control,
  useController,
} from "react-hook-form";
import { useFieldFormat } from "./use-field-format";

type ValidationRules = Omit<
  RegisterOptions,
  "valueAsNumber" | "valueAsDate" | "setValueAs"
>;

interface TextInputWithClearAndFormatProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
  control: Control<TFieldValues>;
  name: TName;
  placeholder: string;
  rules?: ValidationRules;
  format?: (x: string) => string;
  defaultValue?: string;
}

export const TextInputWithClearAndFormat = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  control,
  name,
  placeholder,
  rules,
  format = (x) => x,
  defaultValue = "",
}: TextInputWithClearAndFormatProps<TFieldValues, TName>) => {
  const { field } = useController<TFieldValues, TName>({
    control,
    name,
    rules,
    defaultValue,
  });

  const fieldFormat = useFieldFormat({
    format,
    defaultValue,
  });

  useEffect(() => field.onChange(fieldFormat.inputValue), [
    fieldFormat.inputValue,
    field,
  ]);

  return (
    <span style={{ marginRight: 10 }}>
      <input
        ref={field.ref}
        name={field.name}
        value={fieldFormat.displayValue}
        onChange={fieldFormat.onChange}
        onFocus={fieldFormat.onFocus}
        onBlur={() => {
          fieldFormat.onBlur();
          field.onBlur();
        }}
        placeholder={placeholder}
        autoComplete="off"
      />
      <button onClick={() => fieldFormat.onChange("")}>clear</button>
    </span>
  );
};
