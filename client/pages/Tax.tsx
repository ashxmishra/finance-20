import AppLayout from "@/components/layout/AppLayout";
import { useFinance } from "@/context/FinanceContext";
import { exportFinanceToExcel } from "@/utils/exportToExcel";
import { useState } from "react";

export default function Tax() {
  const { incomes, expenses, reminders, savings } = useFinance();
  const [variant, setVariant] = useState<"ITR" | "GST">("ITR");

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-2xl font-bold">ITR / GST Export</h1>
        <p className="text-muted-foreground mt-1">Generate an Excel file tailored for your filing needs, including receipts and invoices URLs.</p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <label className="flex items-center gap-2"><input type="radio" name="v" checked={variant==='ITR'} onChange={()=>setVariant('ITR')} /> ITR</label>
          <label className="flex items-center gap-2"><input type="radio" name="v" checked={variant==='GST'} onChange={()=>setVariant('GST')} /> GST</label>
        </div>
        <div className="mt-6">
          <button className="px-5 py-3 rounded-lg bg-gradient-to-r from-primary to-accent text-primary-foreground shadow" onClick={() => exportFinanceToExcel({ incomes: incomes.map(i=>({ date: i.date, source: i.source, amount: i.amount, invoiceUrl: i.invoiceUrl })), expenses: expenses.map(e=>({ date: e.date, category: e.category, amount: e.amount, receiptUrl: e.receiptUrl })), reminders: reminders.map(r=>({ title: r.title, dueDate: r.dueDate, amount: r.amount })), savings: savings.map(s=>({ name: s.name, amount: s.amount, date: s.date })), variant })}>Download {variant} Excel</button>
        </div>
      </div>
    </AppLayout>
  );
}
