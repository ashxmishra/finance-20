import AppLayout from "@/components/layout/AppLayout";
import { useFinance } from "@/context/FinanceContext";
import { useState } from "react";

export default function SavingsReminders() {
  const { reminders, savings, addReminder, addSaving, deleteReminder, deleteSaving } = useFinance();
  const [savingName, setSavingName] = useState("");
  const [savingAmount, setSavingAmount] = useState("");
  const [savingDate, setSavingDate] = useState<string | undefined>(new Date().toISOString().slice(0,10));
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(() => new Date().toISOString().slice(0,10));
  const [amount, setAmount] = useState("");

  return (
    <AppLayout>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold">Savings</h2>
          <form className="mt-3 grid gap-3 md:grid-cols-3 items-end" onSubmit={async (e)=>{e.preventDefault(); if(!savingName||!savingAmount) return; await addSaving({ name: savingName, amount: Number(savingAmount), date: savingDate }); setSavingName(""); setSavingAmount("");}}>
            <div>
              <label className="text-sm">Name</label>
              <input value={savingName} onChange={(e)=>setSavingName(e.target.value)} className="w-full mt-1 border rounded-md px-2 py-2 bg-background" />
            </div>
            <div>
              <label className="text-sm">Amount (₹)</label>
              <input type="number" value={savingAmount} onChange={(e)=>setSavingAmount(e.target.value)} className="w-full mt-1 border rounded-md px-2 py-2 bg-background" />
            </div>
            <div>
              <label className="text-sm">Date</label>
              <input type="date" value={savingDate} onChange={(e)=>setSavingDate(e.target.value)} className="w-full mt-1 border rounded-md px-2 py-2 bg-background" />
            </div>
            <div className="md:col-span-3"><button className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Add Saving</button></div>
          </form>
          <div className="mt-4 space-y-2">
            {savings.map(s => (
              <div key={(s.id||s.name)+s.amount} className="flex items-center justify-between border rounded-lg p-3 bg-card">
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-sm text-muted-foreground">{s.date || ""} • ₹{s.amount.toLocaleString()}</div>
                </div>
                {s.id && <button className="text-sm text-rose-600" onClick={()=>deleteSaving(s.id!)}>Delete</button>}
              </div>
            ))}
            {savings.length===0 && <div className="text-sm text-muted-foreground">No savings yet.</div>}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Reminders</h2>
          <form className="mt-3 grid gap-3 md:grid-cols-3 items-end" onSubmit={async (e)=>{e.preventDefault(); if(!title||!dueDate) return; await addReminder({ title, dueDate, amount: amount? Number(amount): undefined }); setTitle(""); setAmount("");}}>
            <div>
              <label className="text-sm">Title</label>
              <input value={title} onChange={(e)=>setTitle(e.target.value)} className="w-full mt-1 border rounded-md px-2 py-2 bg-background" />
            </div>
            <div>
              <label className="text-sm">Due Date</label>
              <input type="date" value={dueDate} onChange={(e)=>setDueDate(e.target.value)} className="w-full mt-1 border rounded-md px-2 py-2 bg-background" />
            </div>
            <div>
              <label className="text-sm">Amount (₹) (optional)</label>
              <input type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} className="w-full mt-1 border rounded-md px-2 py-2 bg-background" />
            </div>
            <div className="md:col-span-3"><button className="px-4 py-2 rounded-md bg-primary text-primary-foreground">Add Reminder</button></div>
          </form>
          <div className="mt-4 space-y-2">
            {reminders.map(r => (
              <div key={(r.id||r.title)+r.dueDate} className="flex items-center justify-between border rounded-lg p-3 bg-card">
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-sm text-muted-foreground">{r.dueDate}{typeof r.amount!=="undefined" ? ` • ₹${r.amount.toLocaleString()}` : ""}</div>
                </div>
                {r.id && <button className="text-sm text-rose-600" onClick={()=>deleteReminder(r.id!)}>Delete</button>}
              </div>
            ))}
            {reminders.length===0 && <div className="text-sm text-muted-foreground">No reminders yet.</div>}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
