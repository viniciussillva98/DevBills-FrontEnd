import type { Category, CategorySummary } from "./category";

export const TransactionType = {
  EXPENSE: "expense",
  INCOME: "income",
} as const;

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

export interface TransactionFilter {
  month: number;
  year: number;
  categoryId?: string;
  type?: TransactionType;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  date: string | Date;
  categoryId: string;
  type: TransactionType;
  description?: string;
  updatedAt: string | Date;
  createdAt: string | Date;
  category?: Category;
}

export interface TransactionSummary {
  totalExpenses: number; //despesas ou saidas
  totalIncomes: number; //receitas ou entradas
  balance: number; //saldo atual
  expensesByCategory: CategorySummary[];
}

export interface MonthlyItem {
  name: string;
  expense: number;
  income: number;
}

export interface CreateTransactionDTO {
  description: string;
  amount: number;
  date: Date | string;
  categoryId: string;
  type: TransactionType;
}
