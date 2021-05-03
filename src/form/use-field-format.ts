import { useState, useCallback } from "react";

interface UseFieldFormatOptions {
  defaultValue?: string;
  format: (x: string) => string;
}

interface UseFieldFormatValues {
  inputValue: string;
  displayValue: string;
}

export const useFieldFormat = ({ format, defaultValue = "" }: UseFieldFormatOptions) => {
  const [values, setValues] = useState<UseFieldFormatValues>({
    inputValue: defaultValue,
    displayValue: format(defaultValue),
  });

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement> | string) => {
    const inputValue = typeof e === "string" ? e : e.target.value;
    setValues({ inputValue, displayValue: inputValue });
  }, []);

  const onBlur = useCallback(() => {
    setValues((current) => ({
      ...current,
      displayValue: format(current.inputValue),
    }));
  }, [format]);

  const onFocus = useCallback(() => {
    setValues((current) => ({ ...current, displayValue: current.inputValue }));
  }, []);

  return { ...values, onBlur, onChange, onFocus };
};
