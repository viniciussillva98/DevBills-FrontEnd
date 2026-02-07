import { type InputHTMLAttributes, type ReactNode, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
  icon?: ReactNode;
  label?: string;
  error?: string;
  id?: string;
  className?: string;
}

const Input = ({ fullWidth, icon, label, error, id, className, ...rest }: InputProps) => {
  const generateId = useId();
  const inputId = id || generateId;

  return (
    <div className={`${fullWidth ? "w-full" : ""} mb-4`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-50 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute top-3.5 left-2 pl-1 flex items-center cursor-pointer text-gray-400">{icon}</div>
        )}
      </div>

      <input
        id={inputId}
        className={`block w-full rounded-xl border bg-gray-800 px-4 py-3 text-sm  cursor-pointer text-gray-50 
            transition-all focus:outline-none 
            ${error ? "border-red-700" : "border-gray-700"}
            ${error ? "focus:border-red-400" : "focus:border-primary-500 "}
            ${icon ? "pl-10" : ""}
            ${className}
        `}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
export default Input;
