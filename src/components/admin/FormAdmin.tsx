import { ReactNode, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FormField {
  name: string;
  label: string;
  type: "text" | "textarea" | "email" | "number" | "date" | "select" | "file";
  required?: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  value?: any;
}

interface FormAdminProps {
  title: string;
  fields: FormField[];
  values: Record<string, any>;
  onChange: (name: string, value: any) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  loading?: boolean;
  submitLabel?: string;
}

export const FormAdmin = ({
  title,
  fields,
  values,
  onChange,
  onSubmit,
  onCancel,
  loading = false,
  submitLabel = "Enregistrer",
}: FormAdminProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
                {field.required && <span className="text-red-600">*</span>}
              </label>

              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={values[field.name] || ""}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : field.type === "select" ? (
                <select
                  name={field.name}
                  value={values[field.name] || ""}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  required={field.required}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option value="">Sélectionner...</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "file" ? (
                <input
                  type="file"
                  name={field.name}
                  onChange={(e) => onChange(field.name, e.target.files?.[0])}
                  required={field.required}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={values[field.name] || ""}
                  onChange={(e) => onChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              )}
            </div>
          ))}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="submit"
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white">
              {loading ? "Enregistrement..." : submitLabel}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}>
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
