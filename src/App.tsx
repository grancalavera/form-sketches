import React, { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import "react/jsx-runtime";
import "./App.css";
import { TextInputWithClearAndFormat } from "./form/text-input-with-clear-and-format";

interface Fields {
  people: Person[];
}

interface Person {
  firstName: string;
  lastName: string;
}

const person = (): Person => ({ firstName: "", lastName: "" });

const Box: React.FC = ({ children }) => (
  <div style={{ border: "1px solid black", marginBottom: 10, padding: 5 }}>
    {children}
  </div>
);

const ErrorBox: React.FC = ({ children }) => (
  <div
    style={{
      border: "1px solid red",
      backgroundColor: "pink",
      color: "red",
      marginBottom: 10,
      padding: 5,
    }}
  >
    {children}
  </div>
);

export default function App() {
  const { control, formState, handleSubmit } = useForm<Fields>({
    defaultValues: {
      people: [{ firstName: "", lastName: "" }],
    },
    mode: "onSubmit",
  });

  const [result, setResult] = useState<Fields>();

  const { fields, append, remove } = useFieldArray({ control, name: "people" });
  const errors = formState.errors;

  const onSubmit = (data: Fields) => setResult(data);

  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>people</h2>
        {fields.map((field, index) => {
          return (
            <div key={field.id}>
              <Box>
                <TextInputWithClearAndFormat
                  name={`people.${index}.firstName` as const}
                  control={control}
                  placeholder="first name"
                  rules={{
                    required: { value: true, message: "first name is required" },
                  }}
                  format={(x) => x.split("").reverse().join("")}
                />
                <TextInputWithClearAndFormat
                  name={`people.${index}.lastName` as const}
                  control={control}
                  placeholder="last name"
                  rules={{
                    required: { value: true, message: "last name is required" },
                  }}
                  format={(x) => x.toUpperCase()}
                />
                {fields.length > 1 && (
                  <button onClick={() => remove(index)}>delete</button>
                )}
              </Box>
              {Object.entries(errors.people?.[index] ?? []).map(
                ([fieldName, fieldError]) => (
                  <ErrorBox key={field.id + fieldName}>
                    {fieldError?.message ?? "unknown validation error"}
                  </ErrorBox>
                )
              )}
            </div>
          );
        })}
        <Box>
          <button onClick={() => append(person())}>add person</button>
        </Box>
        <Box>
          <button type="submit">submit</button>
        </Box>
      </form>

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
