import api from "./axios";

export interface Expense {
  _id: string;
  amount: number;
  category: string;
  description?: string;
  date: string;
}

export const fetchExpenses = async (): Promise<Expense[]> => {
  const res = await api.get("/expenses");
  return res.data;
};

export const createExpense = async (data: {
  amount: number;
  category: string;
  description?: string;
}) => {
  const res = await api.post("/expenses", data);
  return res.data;
};
