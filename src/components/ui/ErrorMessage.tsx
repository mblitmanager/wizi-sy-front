import React from 'react';
import { AlertCircle, XCircle } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  variant?: 'error' | 'warning';
  action?: {
    label: string;
    onClick: () => void;
  };
}

function ErrorMessage({ title, message, variant = 'error', action }: ErrorMessageProps) {
  const styles = {
    error: {
      container: 'bg-red-50 border-red-200',
      icon: <XCircle className="w-5 h-5 text-red-500" />,
      title: 'text-red-800',
      message: 'text-red-600',
      button: 'text-red-600 hover:text-red-800'
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200',
      icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
      title: 'text-yellow-800',
      message: 'text-yellow-600',
      button: 'text-yellow-600 hover:text-yellow-800'
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${styles[variant].container}`}>
      <div className="flex">
        <div className="flex-shrink-0">{styles[variant].icon}</div>
        <div className="ml-3">
          {title && (
            <h3 className={`text-sm font-medium ${styles[variant].title}`}>
              {title}
            </h3>
          )}
          <div className={`text-sm ${styles[variant].message}`}>{message}</div>
          {action && (
            <div className="mt-4">
              <button
                type="button"
                className={`text-sm font-medium ${styles[variant].button}`}
                onClick={action.onClick}
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorMessage;