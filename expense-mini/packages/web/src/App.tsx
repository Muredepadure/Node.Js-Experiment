import { useEffect, useMemo, useState } from "react";

// values (functions) come in a normal import
import { addExpense, getCategories, getSummary, listExpenses } from "./api";

// types must be imported with `import type`
import type { Category, Expense } from "./api";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

function AddExpenseForm({ categories, onAdded }: { categories: Category[]; onAdded: () => void }) {
  const [amount, setAmount] = useState("");
  const [date, setDate]   = useState(() => new Date().toISOString().slice(0,10));
  const [merchant, setMerchant] = useState("");
  const [note, setNote] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !date || !merchant) return;
    await addExpense({
      amount: Number(amount),
      date,
      merchant,
      note: note || undefined,
      categoryId: categoryId === "" ? undefined : Number(categoryId),
    });
    setAmount(""); setMerchant(""); setNote(""); setCategoryId("");
    onAdded();
  }

  return (
    <form onSubmit={submit} className="flex flex-wrap items-end gap-3 p-3 rounded-lg border shadow-sm">
      <div className="flex flex-col">
        <label className="text-sm">Amount</label>
        <input className="border rounded px-2 py-1" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="12.50"/>
      </div>
      <div className="flex flex-col">
        <label className="text-sm">Date</label>
        <input className="border rounded px-2 py-1" type="date" value={date} onChange={e=>setDate(e.target.value)}/>
      </div>
      <div className="flex flex-col">
        <label className="text-sm">Merchant</label>
        <input className="border rounded px-2 py-1" value={merchant} onChange={e=>setMerchant(e.target.value)} placeholder="Starbucks"/>
      </div>
      <div className="flex flex-col">
        <label className="text-sm">Note</label>
        <input className="border rounded px-2 py-1" value={note} onChange={e=>setNote(e.target.value)} placeholder="latte"/>
      </div>
      <div className="flex flex-col">
        <label className="text-sm">Category (optional)</label>
        <select className="border rounded px-2 py-1" value={categoryId}
                onChange={e=>setCategoryId(e.target.value==="" ? "" : Number(e.target.value))}>
          <option value="">Auto (AI-ish)</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <button className="bg-black text-white px-4 py-2 rounded-lg">Add</button>
    </form>
  );
}

function ExpensesTable({ items }: { items: Expense[] }) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left border-b">
          <th className="py-2">Date</th><th>Merchant</th><th>Category</th><th className="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        {items.map(e => (
          <tr key={e.id} className="border-b last:border-0">
            <td className="py-2">{new Date(e.date).toLocaleDateString()}</td>
            <td>{e.merchant}</td>
            <td>{e.category?.name ?? "Auto"}</td>
            <td className="text-right">{Number(e.amount).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<{ total:number; byCategory:{category:string; amount:number}[] }|null>(null);

  const reload = async () => {
    const [cats, exps, sum] = await Promise.all([getCategories(), listExpenses(), getSummary()]);
    setCategories(cats); setExpenses(exps); setSummary(sum);
  };

  useEffect(() => { reload(); }, []);

  const COLORS = useMemo(() => Array.from({length:10},(_,i)=>`hsl(${(i*37)%360} 70% 50%)`), []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Expense Tracker</h1>

      <AddExpenseForm categories={categories} onAdded={reload} />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-4 shadow-sm">
          <h2 className="font-medium mb-2">Spending by Category</h2>
          <div style={{ width: "100%", height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={summary?.byCategory ?? []} dataKey="amount" nameKey="category" outerRadius={100} label>
                  {(summary?.byCategory ?? []).map((_e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-sm">Total: <b>{summary?.total?.toFixed(2) ?? "0.00"}</b></div>
        </div>

        <div className="border rounded-xl p-4 shadow-sm">
          <h2 className="font-medium mb-2">Recent Expenses</h2>
          <ExpensesTable items={expenses} />
        </div>
      </div>
    </div>
  );
}
