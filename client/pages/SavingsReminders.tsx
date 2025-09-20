import AppLayout from "@/components/layout/AppLayout";
import { useFinance } from "@/context/FinanceContext";
import { useState } from "react";
import { Pencil, Trash2, X } from "lucide-react";

export default function SavingsReminders() {
  const {
    reminders,
    savings,
    addReminder,
    addSaving,
    deleteReminder,
    deleteSaving,
    updateReminder,
    updateSaving,
  } = useFinance();
  const [savingName, setSavingName] = useState("");
  const [savingAmount, setSavingAmount] = useState("");
  const [savingDate, setSavingDate] = useState<string | undefined>(
    new Date().toISOString().slice(0, 10),
  );
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [amount, setAmount] = useState("");
  const [editingSavingId, setEditingSavingId] = useState<string | null>(null);
  const [editingReminderId, setEditingReminderId] = useState<string | null>(null);

  return (
    <AppLayout>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold">Savings</h2>
          <div className="mt-3 rounded-xl border bg-card p-5 shadow-sm">
            <form
              className="grid gap-3 md:grid-cols-3 items-end"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!savingName || !savingAmount) return;
                if (editingSavingId) {
                  await updateSaving(editingSavingId, { name: savingName, amount: Number(savingAmount), date: savingDate });
                } else {
                  await addSaving({ name: savingName, amount: Number(savingAmount), date: savingDate });
                }
                setSavingName("");
                setSavingAmount("");
                setEditingSavingId(null);
              }}
            >
              <div>
                <label className="text-sm">Name</label>
                <input
                  value={savingName}
                  onChange={(e) => setSavingName(e.target.value)}
                  className="w-full mt-1 border rounded-md px-2 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="text-sm">Amount (₹)</label>
                <input
                  type="number"
                  value={savingAmount}
                  onChange={(e) => setSavingAmount(e.target.value)}
                  className="w-full mt-1 border rounded-md px-2 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="text-sm">Date</label>
                <input
                  type="date"
                  value={savingDate}
                  onChange={(e) => setSavingDate(e.target.value)}
                  className="w-full mt-1 border rounded-md px-2 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div className="md:col-span-3 flex items-center gap-3">
                <button className="px-4 py-2 rounded-md bg-gradient-to-r from-primary to-accent text-primary-foreground shadow">
                  {editingSavingId ? 'Save Saving' : 'Add Saving'}
                </button>
                {editingSavingId && <button type="button" onClick={()=>{ setEditingSavingId(null); setSavingName(''); setSavingAmount(''); }} className="px-3 py-2 rounded-md border flex items-center gap-2"><X className="h-4 w-4"/> Cancel</button>}
              </div>
            </form>
          </div>
          <div className="mt-4 space-y-2">
            {savings.map((s) => (
              <div
                key={(s.id || s.name) + s.amount}
                className="flex items-center justify-between border rounded-lg p-3 bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="font-medium">{s.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {s.date || ""} • ₹{s.amount.toLocaleString()}
                  </div>
                </div>
                {s.id && (
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-md hover:bg-emerald-50 text-emerald-600" onClick={()=>{ setEditingSavingId(s.id!); setSavingName(s.name); setSavingAmount(String(s.amount)); setSavingDate(s.date); }} aria-label="Edit saving">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      className="text-sm text-rose-600 hover:underline"
                      onClick={() => deleteSaving(s.id!)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
            {savings.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No savings yet.
              </div>
            )}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Reminders</h2>
          <div className="mt-3 rounded-xl border bg-card p-5 shadow-sm">
            <form
              className="grid gap-3 md:grid-cols-3 items-end"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!title || !dueDate) return;
                if (editingReminderId) {
                  await updateReminder(editingReminderId, { title, dueDate, amount: amount ? Number(amount) : undefined });
                } else {
                  await addReminder({ title, dueDate, amount: amount ? Number(amount) : undefined });
                }
                setTitle("");
                setAmount("");
                setEditingReminderId(null);
              }}
            >
              <div>
                <label className="text-sm">Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-1 border rounded-md px-2 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="text-sm">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full mt-1 border rounded-md px-2 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="text-sm">Amount (₹) (optional)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full mt-1 border rounded-md px-2 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div className="md:col-span-3 flex items-center gap-3">
                <button className="px-4 py-2 rounded-md bg-gradient-to-r from-primary to-accent text-primary-foreground shadow">
                  {editingReminderId ? 'Save Reminder' : 'Add Reminder'}
                </button>
                {editingReminderId && <button type="button" onClick={()=>{ setEditingReminderId(null); setTitle(''); setAmount(''); }} className="px-3 py-2 rounded-md border flex items-center gap-2"><X className="h-4 w-4"/> Cancel</button>}
              </div>
            </form>
          </div>
          <div className="mt-4 space-y-2">
            {reminders.map((r) => (
              <div
                key={(r.id || r.title) + r.dueDate}
                className="flex items-center justify-between border rounded-lg p-3 bg-card shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="font-medium">{r.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {r.dueDate}
                    {typeof r.amount !== "undefined"
                      ? ` • ₹${r.amount.toLocaleString()}`
                      : ""}
                  </div>
                </div>
                {r.id && (
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-md hover:bg-emerald-50 text-emerald-600" onClick={()=>{ setEditingReminderId(r.id!); setTitle(r.title); setAmount(typeof r.amount!=="undefined"? String(r.amount): ''); setDueDate(r.dueDate); }} aria-label="Edit reminder">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      className="text-sm text-rose-600 hover:underline"
                      onClick={() => deleteReminder(r.id!)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
            {reminders.length === 0 && (
              <div className="text-sm text-muted-foreground">
                No reminders yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
