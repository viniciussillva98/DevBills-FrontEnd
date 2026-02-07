import type {
  CreateTransactionDTO,
  MonthlyItem,
  Transaction,
  TransactionFilter,
  TransactionSummary,
} from "../types/transactions";
import { api } from "./api";

// Função para obter transações com filtros opcionais
export const getTransactions = async (filters?: Partial<TransactionFilter>): Promise<Transaction[]> => {
  const response = await api.get<Transaction[]>("/transactions", { params: filters });
  return response.data;
};

// Função para obter o resumo das transações para um mês e ano específicos
export const getTransactionSummary = async (month: number, year: number): Promise<TransactionSummary> => {
  const response = await api.get<TransactionSummary>("/transactions/summary", { params: { month, year } });
  return response.data;
};

export const getTransactionHistorical = async (
  month: number,
  year: number,
  months?: number,
): Promise<{ history: MonthlyItem[] }> => {
  const response = await api.get<{ history: MonthlyItem[] }>("/transactions/historical", {
    params: { month, months, year },
  });
  return response.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};

export const createTransaction = async (transactionData: CreateTransactionDTO): Promise<Transaction> => {
  try {
    const response = await api.post<Transaction>("/transactions", transactionData);
    return response.data;
  } catch (error) {
    if (error && typeof error === "object" && "response" in error) {
      // If using axios, import AxiosError from 'axios' at the top of the file
      // and use error as AxiosError here
      const err = error as { response?: { data?: unknown } };
      console.error("ERRO BACKEND 👉", err.response?.data);
    } else {
      console.error("ERRO BACKEND 👉", error);
    }
    throw error;
  }
};
