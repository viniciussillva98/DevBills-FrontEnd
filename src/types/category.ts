import type { TransactionType } from "./transactions";

export interface Category {
  id: string;
  name: string;
  color: string;
  type: TransactionType;
}

export interface CategorySummary {
  categoryId: string; //id da categoria
  categoryName: string; //nome de cada categoria
  categoryColor: string; //cor de cada categoria
  amout: number; //valor de cada categoria
  percentage: number; //porcentagem de cada categoria
}
