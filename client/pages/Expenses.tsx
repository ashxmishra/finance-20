import AppLayout from "@/components/layout/AppLayout";
import { useFinance } from "@/context/FinanceContext";
import { useState } from "react";

export default function Expenses() {
  const { expenses, addExpense, deleteExpense } = useFinance();
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [file, setFile] = useState<File | null>(null);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <form className="mt-4 grid gap-3 md:grid-cols-4 items-end" onSubmit={async (e) => { e.preventDefault(); if (!category || !amount) return; await addExpense({ category, amount: Number(amount), date }, file); setCategory(""); setAmount(""); setFile(null); }}>
          <div className="md:col-span-1">
            <label className="text-sm">Date</label>
            <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="w-full mt-1 border rounded-md px-2 py-2 bg-background" />
          </div>
          <div className="md:col-span-1">
            <label className="text-sm">Category</label>
            <input value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Rent / Food / Transport" className="w-full mt-1 border rounded-md px-2 py-2 bg-background" />
          </div>
          <div className="md:col-span-1">
            <label className="text-sm">Amount (₹)</label>
            <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full mt-1 border rounded-md px-2 py-2 bg-background" />
          </div>
          <div className="md:col-span-1">
            <label className="text-sm">Receipt</label>
            <input type="file" onChange={(e)=>setFile(e.target.files?.[0] || null)} className="w-full mt-1" />
          </div>
          <div className="md:col-span-4">
            <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Add Expense</button>
          </div>
        </form>
        <div className="mt-6 space-y-2">
          {expenses.map((i) => (
            <div key={(i.id||i.date)+i.category+i.amount} className="flex items-center justify-between border rounded-lg p-3 bg-card">
              <div>
                <div className="font-medium">{i.category}</div>
                <div className="text-sm text-muted-foreground">{i.date} • ₹{i.amount.toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-3">
                {i.receiptUrl && <a href={i.receiptUrl} target="_blank" className="text-sm underline">Receipt</a>}
                {i.id && <button onClick={()=>deleteExpense(i.id!)} className="text-sm text-rose-600">Delete</button>}
              </div>
            </div>
          ))}
          {expenses.length===0 && <div className="text-sm text-muted-foreground">No expenses yet.</div>}
        </div>
      </div>
    </AppLayout>
  );
}
