import React from 'react';
import {
  useForm,
  FormProvider,
  UseFormProps,
  SubmitHandler,
  FieldValues
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface FormProps<T extends FieldValues> {
  onSubmit: SubmitHandler<T>;
  children: React.ReactNode;
  schema: z.ZodType<T>;
  defaultValues?: UseFormProps<T>['defaultValues'];
  className?: string;
}

function Form<T extends FieldValues>({
  onSubmit,
  children,
  schema,
  defaultValues,
  className
}: FormProps<T>) {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
}

export default Form;
