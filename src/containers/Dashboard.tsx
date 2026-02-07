import { RechartsDevtools } from "@recharts/devtools";
import { ArrowDown, ArrowUp, Calendar, TrendingUp, Wallet } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PieLabelRenderProps } from "recharts/types/polar/Pie";
import Card from "../components/Card.tsx";
import MonthYearSelect from "../components/MonthYearSelect.tsx";
import { getTransactionHistorical, getTransactionSummary } from "../services/transactionService.ts";
import type { MonthlyItem, TransactionSummary } from "../types/transactions.ts";
import { formatValue } from "../utils/formatValue.ts";

const initialSummary: TransactionSummary = {
  totalExpenses: 0,
  totalIncomes: 0,
  balance: 0,
  expensesByCategory: [],
};

const Dashboard = () => {
  const currentDate = new Date();
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [summary, setSummary] = useState<TransactionSummary>(initialSummary);
  const [monthlyItems, setMonthlyItems] = useState<MonthlyItem[]>([]);

  useEffect(() => {
    async function getAllTransactionsSummary() {
      const data = await getTransactionSummary(month, year);
      setSummary(data);
    }

    getAllTransactionsSummary();
  }, [month, year]);

  useEffect(() => {
    async function getAllTransactionsHistory() {
      const data = await getTransactionHistorical(month, year);
      setMonthlyItems(data.history);
    }
    getAllTransactionsHistory();
  }, [month, year]);

  const expensesByCategoryWithColor = summary.expensesByCategory.map((item) => ({
    categoryName: item.categoryName,
    amount: Number(item.amout) || 0,
    fill: item.categoryColor,
  }));

  const renderChartLabel = ({ name, percent }: PieLabelRenderProps) => {
    return `${name ?? "Sem categoria"}: ${((percent ?? 0) * 100).toFixed(1)}%`;
  };

  const formatToolTipValue = (value: number | undefined): string => {
    return formatValue(typeof value === "number" ? value : 0);
  };

  return (
    <div className="Container-app">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Dashboard</h1>

        <MonthYearSelect year={year} month={month} onMonthChange={setMonth} onYearChange={setYear} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          icon={<Wallet size={20} className="text-primary-500" />}
          title="Saldo"
          glowEffect={summary.balance > 0}
          hover
        >
          <p className={`text-lg font-semibold mt-2 ${summary.balance < 0 ? "text-red-600" : "text-green-500"}`}>
            {formatValue(summary.balance)}
          </p>
        </Card>

        <Card icon={<ArrowUp size={20} className="text-primary-500" />} title="Receitas" hover>
          <p className="text-lg font-semibold mt-2 text-green-500">{formatValue(summary.totalIncomes)}</p>
        </Card>

        <Card icon={<ArrowDown size={20} className="text-red-600" />} title="Despesas" hover>
          <p className="text-lg font-semibold mt-2 text-red-600">{formatValue(summary.totalExpenses)}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6 mt-3">
        {/*Grafico das categorias */}
        <Card
          icon={<TrendingUp size={20} className="text-primary-500" />}
          title="Despesas por categoria"
          className="min-h-72"
        >
          {expensesByCategoryWithColor.length > 0 ? (
            <div className="w-full" style={{ height: 260 }}>
              <ResponsiveContainer width="95%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategoryWithColor}
                    dataKey="amount"
                    nameKey="categoryName"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={renderChartLabel}
                  />
                  <Tooltip
                    formatter={formatToolTipValue}
                    itemStyle={{ color: "#f8f8f8" }}
                    contentStyle={{
                      backgroundColor: "#0E141D",
                      borderColor: "#141F2B",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className=" flex justify-center items-center h-60 text-gray-500">
              Nenhuma despesa registrada para este mês.
            </p>
          )}
        </Card>
        {/*Grafico histórico mensal */}
        <Card
          icon={<Calendar size={20} className="text-primary-500" />}
          title="Histórico mensal"
          className="min-h-72 p-6"
        >
          {monthlyItems.length > 0 ? (
            <div className="h-64 mt-6">
              <ResponsiveContainer width="95%" height="100%">
                <BarChart data={monthlyItems} margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ style: { textTransform: "capitalize" } }} />
                  <YAxis width="auto" stroke="#94a3b8" tickFormatter={formatValue} />
                  <Tooltip
                    formatter={formatToolTipValue}
                    contentStyle={{
                      backgroundColor: "#0E141D",
                      borderColor: "#141F2B",
                    }}
                    labelStyle={{ color: "#f8f8f8" }}
                  />
                  <Legend />
                  <Bar
                    dataKey="expense"
                    name="Despesas"
                    fill="#e7000b"
                    activeBar={{ fill: "#e7000b", stroke: "black" }}
                    radius={[10, 10, 0, 0]}
                  />
                  <Bar
                    dataKey="income"
                    name="Receitas"
                    fill="#37E359"
                    activeBar={{ fill: "#37E359", stroke: "black" }}
                    radius={[10, 10, 0, 0]}
                  />
                  <RechartsDevtools />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className=" flex justify-center items-center h-60 text-gray-500">
              Nenhum historico registrado nos últimos meses.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
