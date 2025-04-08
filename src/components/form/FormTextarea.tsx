import React from 'react';
import { useFormContext } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  name: string;
  helperText?: string;
}

function FormTextarea({ label, name, helperText, ...props }: FormTextareaProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        id={name}
        {...register(name)}
        {...props}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-blue-500'
        }`}
      />
      {(error || helperText) && (
        <div className={`text-sm flex items-start ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error && <AlertCircle className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />}
          <span>{error || helperText}</span>
        </div>
      )}
    </div>
  );
}

export default FormTextarea;