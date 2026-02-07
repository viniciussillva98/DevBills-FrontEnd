import { AlertCircle, ArrowDown, ArrowUp, LucideCalendarSearch, Plus, Search, Trash2 } from "lucide-react";
import { type ChangeEvent, useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import MonthYearSelect from "../components/MonthYearSelect";
import { deleteTransaction, getTransactions } from "../services/transactionService";
import { type Transaction, TransactionType } from "../types/transactions";
import { formatDate } from "../utils/formatDate";
import { formatValue } from "../utils/formatValue";

const Transactions = () => {
  const currentDate = new Date();
  const [year, setYear] = useState<number>(currentDate.getFullYear());
  const [month, setMonth] = useState<number>(currentDate.getMonth() + 1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [deletingId, setDeletigId] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");

  const getAllTransactions = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");
      const data = await getTransactions({ month, year });
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (_error) {
      setError("Não foi possível carregar transaçõs, tente novamente");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    try {
      setDeletigId(id);
      await deleteTransaction(id);
      toast.success("Transação deletada");
      setFilteredTransactions((dado) => dado.filter((dado) => dado.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Falha ao deletar");
    } finally {
      setDeletigId("");
    }
  };
  const confirmDelete = (id: string): void => {
    if (window.confirm("Ao confirmar você vai deletar uma transação.")) {
      handleDelete(id);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  useEffect(() => {
    getAllTransactions();
  }, [month, year]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setSearchText(event.target.value);
    setFilteredTransactions(
      transactions.filter((transaction) =>
        transaction.description?.toUpperCase().includes(event.target.value.toUpperCase()),
      ),
    );
  };

  return (
    <div className="Container-app py-6">
      <div className="flex flex-row justify-between items-center  mb-6 ">
        <h1 className="text-2xl font-bold">Transações</h1>
        <Link
          to={"/transações/nova-transação"}
          className="bg-primary-500 hover:bg-primary-600 transition-all text-[#051626] font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2 text-[#051626]" />
          Nova transação
        </Link>
      </div>

      <div className="mb-6">
        <MonthYearSelect year={year} month={month} onMonthChange={setMonth} onYearChange={setYear} />
      </div>

      <Card className="mb-6">
        <Input
          placeholder="Buscar transações..."
          icon={<Search className="w-4 h-4" />}
          fullWidth
          onChange={handleSearchChange}
          value={searchText}
        />
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex gap-2 p-8 items-center justify-center py-12">
            <LucideCalendarSearch className="text-gray-500 mb-4" />
            {/* {<p className="w-6 h-6 mb-4 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />}LOADING-OPCIONAL*/}
            <p className="text-gray-500 mb-4">Buscando...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-700 mx-auto mb-4 " />
            <p>{error}</p>
            <Button className="mx-auto mt-3" onClick={getAllTransactions}>
              Tentar novamente
            </Button>
          </div>
        ) : transactions?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhuma transação encontrada</p>
          </div>
        ) : (
          <div className="overflow-x-auto ">
            <table className="divide-y divide-gray-700 min-h-full w-full">
              <thead>
                <tr>
                  <th scope="col" className="px-5 py-3 text-left text-sm text-gray-400 uppercase">
                    Descrição
                  </th>
                  <th scope="col" className="px-5 py-3 text-left text-sm text-gray-400 uppercase">
                    Data
                  </th>
                  <th scope="col" className="px-5 py-3 text-left text-sm text-gray-400 uppercase">
                    Categoria
                  </th>
                  <th scope="col" className="px-5 py-3 text-left text-sm text-gray-400 uppercase">
                    Valor
                  </th>
                  <th scope="col" className="px-5 py-3 text-left text-sm text-gray-400 uppercase">
                    {""}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-sm text-gray-400">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-800">
                    <td className="px-6 py-4  whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="mr-2">
                          {transaction.type === TransactionType.INCOME ? (
                            <ArrowUp className="w-4 h-4 text-primary-500" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-red-700" />
                          )}
                        </div>
                        <span className="font-medium">{transaction.description}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(transaction.date)}</td>

                    <td className="px-6 py-4  whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: transaction.category?.color }}
                        />
                        <span>{transaction.category?.name}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4  whitespace-nowrap">
                      <span
                        className={`${transaction.type === TransactionType.INCOME ? "text-primary-500" : "text-red-700"}`}
                      >
                        {formatValue(transaction.amount)}
                      </span>
                    </td>

                    <td className="px-6 py-4  whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => confirmDelete(transaction.id)}
                        disabled={deletingId === transaction.id}
                      >
                        {deletingId === transaction.id ? (
                          <span className="inline-block w-4 h-4 border-2 border-text-gray-100 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 cursor-pointer hover:text-gray-100 transition-colors" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Transactions;
