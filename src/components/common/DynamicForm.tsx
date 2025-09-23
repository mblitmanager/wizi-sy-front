import { memo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

const FormField = memo(({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  required = false,
}: FormFieldProps) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors
        ${error
          ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
          : 'border-gray-300 focus:border-orange-500 focus:ring-orange-200'
        }`}
    />
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-1 text-sm text-red-500"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
));

FormField.displayName = 'FormField';

export interface FormConfig<T extends z.ZodType> {
  schema: T;
  defaultValues?: Partial<z.infer<T>>;
  onSubmit: (data: z.infer<T>) => Promise<void>;
  fields: Array<FormFieldProps & { validation?: z.ZodType }>;
}

interface DynamicFormProps<T extends z.ZodType> {
  config: FormConfig<T>;
  submitLabel?: string;
  className?: string;
}

function DynamicForm<T extends z.ZodType>({ 
  config,
  submitLabel = 'Enregistrer',
  className = ''
}: DynamicFormProps<T>) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(config.schema),
    defaultValues: config.defaultValues
  });

  const onSubmit = useCallback(async (data: z.infer<T>) => {
    try {
      await config.onSubmit(data);
      reset();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  }, [config.onSubmit, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={className}>
      {config.fields.map((field) => (
        <FormField
          key={field.name}
          {...field}
          {...register(field.name)}
          error={errors[field.name]?.message as string}
        />
      ))}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full px-4 py-2 bg-orange-500 text-white rounded-md
          hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-200
          disabled:bg-orange-300 disabled:cursor-not-allowed
          transition-all duration-200`}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2" />
            Chargement...
          </div>
        ) : (
          submitLabel
        )}
      </motion.button>
    </form>
  );
}

export default memo(DynamicForm) as typeof DynamicForm;