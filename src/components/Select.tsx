import { type ReactNode, type SelectHTMLAttributes, useId } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
  options: SelectOption[];
}

const Select = ({ label, error, icon, fullWidth = true, options, className = "", id, ...rest }: SelectProps) => {
  const selectId = useId();

  return (
    <div className={`${fullWidth ? "w-full" : ""} mb-4`}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-50  mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && <div className="absolute top-3.5 text-gray-400 left-0 pl-2 flex items-center">{icon}</div>}
      </div>
      <select
        id={selectId}
        {...rest}
        className="block w-full bg-gray-800 py-3 pl-10 pr-4 cursor-pointer text-gray-50 text-sm rounded-xl outline-none appearance-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-gray-950">
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
