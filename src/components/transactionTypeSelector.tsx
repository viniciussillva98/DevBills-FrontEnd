import { TransactionType } from "../types/transactions";

interface TransactionTypeSelectorProps {
  value: TransactionType;
  id?: string;
  onChange: (type: TransactionType) => void;
}

const TransactionTypeSelector = ({ value, id, onChange }: TransactionTypeSelectorProps) => {
  const transactionsTypeButtons = [
    {
      type: TransactionType.EXPENSE,
      label: "Despesa",
      activeClasses: "bg-red-600 border-red-600 text-white font-medium",
      inactiveClasses: "bg-transparent border-red-600 text-red-600 hover:bg-gray-800",
    },

    {
      type: TransactionType.INCOME,
      label: "Receita",
      activeClasses: "bg-primary-500 border-primary-500 text-gray-800 font-medium",
      inactiveClasses: "bg-transparent border-primary-500 text-primary-500 hover:bg-gray-800",
    },
  ];

  return (
    <fieldset id={id} className="grid grid-cols-2 gap-4">
      {transactionsTypeButtons.map((item) => (
        <button
          type="button"
          key={item.type}
          onClick={() => onChange(item.type)}
          className={`flex items-center justify-center border rounded-md py-2 px-4 transition-all cursor-pointer
                    ${value === item.type ? item.activeClasses : item.inactiveClasses}
                    `}
        >
          {item.label}
        </button>
      ))}
    </fieldset>
  );
};

export default TransactionTypeSelector;
