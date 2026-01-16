import { useState } from "react";
import {
  useExpenses,
  useCreateExpense
} from "../api/useExpenses";

const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Other"
];

const Expenses = () => {
  const { data, isLoading, isError } = useExpenses();
  const createExpense = useCreateExpense();

  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    createExpense.mutate(
      {
        amount: Number(amount),
        category,
        description
      },
      {
        onSuccess: () => {
          setAmount("");
          setCategory("");
          setDescription("");
          setShowForm(false);
        }
      }
    );
  };

  return (
    <div className="space-y-8 pb-20 md:pb-0 animate-[fadeIn_0.3s_ease-out]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">
            Expenses
          </h1>
          <p className="text-slate-400 mt-1">
            Track your personal expenses
          </p>
        </div>

        <button
          onClick={() => setShowForm(v => !v)}
          className="px-4 py-2 rounded-lg font-medium text-sm
                     text-white bg-linear-to-r
                     from-indigo-500 to-violet-500
                     hover:from-indigo-600 hover:to-violet-600
                     active:scale-95 transition"
        >
          {showForm ? "Close" : "+ Add"}
        </button>
      </div>

      {/* Add Expense Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl p-5 space-y-4
                     bg-slate-900/70 backdrop-blur
                     border border-slate-800 shadow-lg"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Amount */}
            <div>
              <label htmlFor="amount" className="sr-only">
                Expense amount
              </label>
              <input
                id="amount"
                title="Expense amount"
                aria-label="Expense amount"
                className="w-full rounded-lg p-3 text-sm
                           bg-slate-800 text-slate-100
                           border border-slate-700
                           placeholder-slate-400
                           focus:outline-none focus:ring-2
                           focus:ring-indigo-500"
                placeholder="Amount"
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="sr-only">
                Expense category
              </label>
              <select
                id="category"
                title="Expense category"
                aria-label="Expense category"
                className="w-full rounded-lg p-3 text-sm
                           bg-slate-800 text-slate-100
                           border border-slate-700
                           focus:outline-none focus:ring-2
                           focus:ring-indigo-500"
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
              >
                <option value="" className="bg-slate-900">
                  Select category
                </option>
                {CATEGORIES.map(cat => (
                  <option
                    key={cat}
                    value={cat}
                    className="bg-slate-900"
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="sr-only">
                Expense description
              </label>
              <input
                id="description"
                title="Expense description"
                aria-label="Expense description"
                className="w-full rounded-lg p-3 text-sm
                           bg-slate-800 text-slate-100
                           border border-slate-700
                           placeholder-slate-400
                           focus:outline-none focus:ring-2
                           focus:ring-indigo-500"
                placeholder="Description (optional)"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={createExpense.isPending}
            className="px-5 py-2 rounded-lg font-medium text-sm
                       text-white bg-linear-to-r
                       from-indigo-500 to-violet-500
                       hover:from-indigo-600 hover:to-violet-600
                       disabled:opacity-50 transition"
          >
            {createExpense.isPending
              ? "Adding..."
              : "Add Expense"}
          </button>
        </form>
      )}

      {/* Expense List */}
      <div className="rounded-xl bg-slate-900/70 backdrop-blur
                      border border-slate-800 shadow-lg">
        <div className="p-5 border-b border-slate-800">
          <h2 className="font-semibold text-slate-100">
            Expense History
          </h2>
        </div>

        <div className="max-h-105 overflow-y-auto divide-y divide-slate-800">
          {isLoading && (
            <p className="p-5 text-slate-400">
              Loading expenses…
            </p>
          )}

          {isError && (
            <p className="p-5 text-rose-400">
              Failed to load expenses
            </p>
          )}

          {!isLoading && data?.length === 0 && (
            <p className="p-5 text-slate-400">
              No expenses yet. Add your first one.
            </p>
          )}

          {data?.map(expense => (
            <div
              key={expense._id}
              className="p-5 flex justify-between items-center text-sm
                         hover:bg-slate-800/60 transition"
            >
              <div>
                <p className="font-medium text-slate-100">
                  {expense.category}
                </p>
                <p className="text-slate-400">
                  {expense.description || "—"}
                </p>
              </div>

              <div className="text-right">
                <p className="font-semibold text-slate-100">
                  ₹{expense.amount}
                </p>
                <p className="text-slate-400">
                  {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Expenses;
