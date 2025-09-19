import * as XLSX from "xlsx";

export interface IncomeRow { date: string; source: string; amount: number; invoiceUrl?: string }
export interface ExpenseRow { date: string; category: string; amount: number; receiptUrl?: string }
export interface ReminderRow { title: string; dueDate: string; amount?: number }
export interface SavingRow { name: string; amount: number; date?: string }

export function exportFinanceToExcel(opts: { incomes: IncomeRow[]; expenses: ExpenseRow[]; reminders?: ReminderRow[]; savings?: SavingRow[]; variant: "ITR" | "GST" }) {
  const { incomes, expenses, reminders = [], savings = [], variant } = opts;
  const wb = XLSX.utils.book_new();
  const incomeSheet = XLSX.utils.json_to_sheet(incomes);
  const expenseSheet = XLSX.utils.json_to_sheet(expenses);
  XLSX.utils.book_append_sheet(wb, incomeSheet, "Incomes");
  XLSX.utils.book_append_sheet(wb, expenseSheet, "Expenses");
  if (reminders.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(reminders), "Reminders");
  if (savings.length) XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(savings), "Savings");
  const summary = [
    { field: "Variant", value: variant },
    { field: "Total Incomes", value: incomes.reduce((a, b) => a + (b.amount || 0), 0) },
    { field: "Total Expenses", value: expenses.reduce((a, b) => a + (b.amount || 0), 0) },
    { field: "Savings", value: incomes.reduce((a, b) => a + (b.amount || 0), 0) - expenses.reduce((a, b) => a + (b.amount || 0), 0) },
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(summary), "Summary");
  XLSX.writeFile(wb, `fintrack-${variant.toLowerCase()}-${new Date().toISOString().slice(0,10)}.xlsx`);
}
