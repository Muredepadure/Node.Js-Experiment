import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:4000" });

export type Category = { id: number; name: string };
export type Expense = {
  id: number;
  amount: number;
  date: string;
  merchant: string;
  note?: string | null;
  categoryId?: number | null;
  category?: Category | null;
};

export async function getCategories() {
  const { data } = await API.get<Category[]>("/categories");
  return data;
}
export async function listExpenses() {
  const { data } = await API.get<Expense[]>("/expenses");
  return data;
}
export async function addExpense(input: {
  amount: number; date: string; merchant: string; note?: string; categoryId?: number;
}) {
  const { data } = await API.post<Expense>("/expenses", input);
  return data;
}
export async function getSummary(params?: { from?: string; to?: string }) {
  const { data } = await API.get<{ total: number; byCategory: { category: string; amount: number }[] }>(
    "/reports/summary", { params }
  );
  return data;
}
