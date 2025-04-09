import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select";

type Option = {
  label: string;
  value: string;
};

type FormSelect2Props = {
  name: string;
  label: string;
  options: Option[];
  required?: boolean;
  helperText?: string;
};

export default function FormSelect2({
  name,
  label,
  options,
  required = false,
  helperText,
}: FormSelect2Props) {
  const { control } = useFormContext();

  return (
    <div className="flex flex-col gap-1">
      <label className="font-semibold">{label}</label>
      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({ field }) => (
          <Select
            {...field}
            options={options}
            isMulti
            onChange={(selected) => field.onChange(selected)}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        )}
      />
      {helperText && <small className="text-gray-500">{helperText}</small>}
    </div>
  );
}
