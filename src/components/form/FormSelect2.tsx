import React from "react";
import { useFormContext } from "react-hook-form";
import { AlertCircle } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options: Option[];
  helperText?: string;
}

function FormSelect2({
  label,
  name,
  options,
  helperText,
  ...props
}: FormSelectProps) {
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(event.target.selectedOptions).map(
      (option) => option.value
    );
    setValue(name, selectedOptions); // Update the form value with the selected options
  };

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={name}
        multiple
        {...props}
        onChange={handleChange}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-blue-500"
        }`}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <div
          className={`text-sm flex items-start ${
            error ? "text-red-600" : "text-gray-500"
          }`}>
          {error && (
            <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
          )}
          <span>{error || helperText}</span>
        </div>
      )}
    </div>
  );
}

export default FormSelect2;
