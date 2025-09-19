import AppLayout from "@/components/layout/AppLayout";
import { useFinance } from "@/context/FinanceContext";
import { useState } from "react";

export default function Income() {
  const { incomes, addIncome, deleteIncome } = useFinance();
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0,10));
  const [file, setFile] = useState<File | null>(null);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold">Income</h1>
        <form className="mt-4 grid gap-3 md:grid-cols-4 items-end" onSubmit={async (e) => { e.preventDefault(); if (!source || !amount) return; await addIncome({ source, amount: Number(amount), date }, file); setSource(""); setAmount(""); setFile(null); }}>
          <div className="md:col-span-1">
            <label className="text-sm">Date</label>
            <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="w-full mt-1 border rounded-md px-2 py-2 bg-background" />
          </div>
          <div className="md:col-span-1">
            <label className="text-sm">Source</label>
            <input value={source} onChange={(e)=>setSource(e.target.value)} placeholder="Job / Freelancing / Trading" className="w-full mt-1 border rounded-md px-2 py-2 bg-background" />
          </div>
          <div className="md:col-span-1">
            <label className="text-sm">Amount (₹)</label>
            <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full mt-1 border rounded-md px-2 py-2 bg-background" />
          </div>
          <div className="md:col-span-1">
            <label className="text-sm">Invoice</label>
            <input type="file" onChange={(e)=>setFile(e.target.files?.[0] || null)} className="w-full mt-1" />
          </div>
          <div className="md:col-span-4">
            <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Add Income</button>
          </div>
        </form>
        <div className="mt-6 space-y-2">
          {incomes.map((i) => (
            <div key={(i.id||i.date)+i.source+i.amount} className="flex items-center justify-between border rounded-lg p-3 bg-card">
              <div>
                <div className="font-medium">{i.source}</div>
                <div className="text-sm text-muted-foreground">{i.date} • ₹{i.amount.toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-3">
                {i.invoiceUrl && <a href={i.invoiceUrl} target="_blank" className="text-sm underline">Invoice</a>}
                {i.id && <button onClick={()=>deleteIncome(i.id!)} className="text-sm text-rose-600">Delete</button>}
              </div>
            </div>
          ))}
          {incomes.length===0 && <div className="text-sm text-muted-foreground">No income yet.</div>}
        </div>
      </div>
    </AppLayout>
  );
}
