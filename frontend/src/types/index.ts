export type User = {
  id: number;
  email: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: number;
  transaction_type: TransactionType;
  amount: number;
  category: { id: number; name: string };
  date: string;
  memo: string | null;
};

export type TransactionSummary = {
  income_total: number;
  expense_total: number;
  balance: number;
};

export type TransactionsResponse = {
  transactions: Transaction[];
  summary: TransactionSummary;
};

export type TransactionFormData = {
  transaction_type: TransactionType;
  amount: number;
  category_id: number;
  date: string;
  memo?: string;
};

export type CategoryType = "income" | "expense";

export type Category = {
  id: number;
  name: string;
};

export type CategoriesResponse = {
  income: Category[];
  expense: Category[];
};

export type CategoryFormData = {
  name: string;
  category_type: CategoryType;
};

export type MonthlyReport = {
  year: number;
  month: number;
  income_total: number;
  expense_total: number;
  balance: number;
};

export type CategorySummaryItem = {
  name: string;
  amount: number;
  percentage: number;
};

export type CategorySummaryResponse = {
  year: number;
  month: number;
  categories: CategorySummaryItem[];
};

export type ApiError = {
  message: string;
  errors?: string[];
};
