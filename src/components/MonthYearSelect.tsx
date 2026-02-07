import { ChevronLeft, ChevronRight } from "lucide-react";

interface MonthYearSelectProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

const monthNames: readonly string[] = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const MonthYearSelect = ({ month, year, onMonthChange, onYearChange }: MonthYearSelectProps) => {
  const currentyear = new Date().getFullYear();
  const yearOptions: number[] = Array.from({ length: 11 }, (_, i) => currentyear - 5 + i);

  const handleNextMonth = (): void => {
    if (month === 12) {
      //Se for dezembro, avança para janeiro do próximo ano
      onMonthChange(1);
      onYearChange(year + 1);
    } else {
      //Caso contrário, apenas avança 1 mês
      onMonthChange(month + 1);
    }
  };

  const handlePrevMonth = (): void => {
    if (month === 1) {
      //Se for janeiro, volta para dezembro do ano anterior
      onMonthChange(12);
      onYearChange(year - 1);
    } else {
      //Caso contrário, apenas volta 1 mês
      onMonthChange(month - 1);
    }
  };

  return (
    <div className="flex mb:gap-1 gap-5 items-center justify-between bg-gray-900 rounded-lg p-2 border border-gray-700">
      <button
        className="p-1 rounded-full hover:bg-gray-800 hover:text-primary-500 cursor-pointer transition-colors"
        type="button"
        aria-label="Selecionar mês anterior"
        onClick={handlePrevMonth}
      >
        <ChevronLeft />
      </button>
      <div className="flex mb:gap-1 gap-5 ">
        <label htmlFor="selectMonth" className="sr-only">
          Selecionar mês
        </label>
        <select
          value={month}
          id="selectMonth"
          className="bg-gray-900 border border-lg rounded-md border-gray-700 focus:outline-none px-2 py-1 cursor-pointer text-sm font-medium text-gray-100 "
          onChange={(e) => onMonthChange(Number(e.target.value))}
        >
          {monthNames.map((name, index) => (
            <option key={name} value={index + 1}>
              {name}
            </option>
          ))}
        </select>

        <label htmlFor="selectYear" className="sr-only">
          Selecionar ano
        </label>
        <select
          value={year}
          id="selectYear"
          className="bg-gray-900 border border-lg rounded-md border-gray-700 focus:outline-none px-2 py-1 cursor-pointer text-sm font-medium text-gray-100"
          onChange={(e) => onYearChange(Number(e.target.value))}
        >
          {yearOptions.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <button
        className="p-1 rounded-full hover:bg-gray-800 hover:text-primary-500 cursor-pointer transition-colors"
        type="button"
        aria-label="Selecionar próximo mês"
        onClick={handleNextMonth}
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default MonthYearSelect;
