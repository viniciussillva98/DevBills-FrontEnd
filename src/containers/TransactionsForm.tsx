import { AlertCircle, Calendar, DollarSign, Save, Tag } from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useId, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";
import Select from "../components/Select";
import TransactionTypeSelector from "../components/transactionTypeSelector";
import { getCategories } from "../services/categoriesServices";
import { createTransaction } from "../services/transactionService";
import type { Category } from "../types/category";
import { type CreateTransactionDTO, TransactionType } from "../types/transactions";

interface FormData {
  description: string;
  amount: number;
  date: string;
  categoryId: string;
  type: TransactionType;
}

const initialFormData = {
  description: "",
  amount: 0,
  date: "",
  categoryId: "",
  type: TransactionType.EXPENSE,
};

const TransactionsForm = () => {
  const navigate = useNavigate();
  const formId = useId();
  const [categories, setcategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAllCategories = async (): Promise<void> => {
      const data = await getCategories();
      setcategories(data);
    };
    getAllCategories();
  }, []);

  const filteredCategories = categories.filter((category) => category.type === formData.type);

  const validateForm = (): boolean => {
    if (!formData.amount || !formData.categoryId || !formData.date || !formData.description) {
      setError("Todos os campos devem ser prenchidos");
      return false;
    }
    if (formData.amount <= 0) {
      setError("Adicione um valor positivo");
      return false;
    }

    return true;
  };

  const handleTransactionType = (itemType: TransactionType): void => {
    setFormData((prev) => ({ ...prev, type: itemType }));
  };
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    setError(null);
    try {
      if (!validateForm()) {
        return;
      }
      const transactionData: CreateTransactionDTO = {
        description: formData.description,
        amount: Number(formData.amount),
        categoryId: formData.categoryId,
        type: formData.type,
        date: `${formData.date}T12:00:00.000Z`,
      };
      await createTransaction(transactionData);
      toast.success("Transação criada com sucesso!");
      navigate("/transacoes");
    } catch (_error) {
      toast.error("Falha ao criar a transação");
    }
  };

  const handleCancel = () => {
    navigate("/transacoes");
  };

  return (
    <div className="Container-app p-y-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Nova transação</h1>
        <Card>
          {error && (
            <div className="flex items-center justify-center bg-gray-800 border border-red-600 rounded-xl px-3 mb-1 gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor={formId}>Tipo de transação</label>
              <TransactionTypeSelector id={formId} value={formData.type} onChange={handleTransactionType} />
            </div>
            <Input
              label="Descição"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ex: Supermercado, salário, etc..."
            />
            <Input
              label="Valor"
              name="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0,00"
              icon={<DollarSign className="w-4 h-4" />}
            />
            <Input
              label="Data"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              icon={<Calendar className="w-4 h-4" />}
            />
            <Select
              label="Categoria"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              icon={<Tag className="w-4 h-4" />}
              options={[
                { value: "", label: "Selecione uma categoria" },
                ...filteredCategories.map((category) => ({
                  value: category.id,
                  label: category.name,
                })),
              ]}
            />

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={handleCancel} type="button">
                Cancelar
              </Button>
              <Button type="submit" variant={formData.type === TransactionType.EXPENSE ? "outlineDanger" : "primary"}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default TransactionsForm;
