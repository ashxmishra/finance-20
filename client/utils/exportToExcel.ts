import * as XLSX from "xlsx";

export interface IncomeRow {
  date: string;
  source: string;
  amount: number;
  invoiceUrl?: string;
}
export interface ExpenseRow {
  date: string;
  category: string;
  amount: number;
  receiptUrl?: string;
}
export interface ReminderRow {
  title: string;
  dueDate: string;
  amount?: number;
}
export interface SavingRow {
  name: string;
  amount: number;
  date?: string;
}

function colToLetter(colIndex: number) {
  // 0-based index to Excel column letter
  let s = "";
  let n = colIndex + 1;
  while (n > 0) {
    const m = (n - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

function addHyperlinks(ws: XLSX.WorkSheet, header: string[]) {
  // Add hyperlink metadata for any http(s) URL string cells
  const ref = ws["!ref"];
  if (!ref) return;
  const range = XLSX.utils.decode_range(ref);
  for (let c = range.s.c; c <= range.e.c; c++) {
    const key = header[c];
    if (!key || !(key.toLowerCase().includes("url") || key.toLowerCase().includes("link"))) continue;
    const col = colToLetter(c);
    // start from row 2 (index 1) to skip header
    for (let r = range.s.r + 1; r <= range.e.r; r++) {
      const addr = `${col}${r + 1}`; // convert 0-based row index to 1-based Excel row number
      const cell = ws[addr] as XLSX.CellObject | undefined;
      if (!cell || typeof cell.v !== "string") continue;
      const val = String(cell.v);
      if (val.startsWith("http://") || val.startsWith("https://")) {
        (cell as any).l = { Target: val };
        ws[addr] = cell;
      }
    }
  }
}

export function exportFinanceToExcel(opts: {
  incomes: IncomeRow[];
  expenses: ExpenseRow[];
  reminders?: ReminderRow[];
  savings?: SavingRow[];
  variant: "ITR" | "GST";
  fileNameBase?: string; // optional override without extension
}) {
  const { incomes, expenses, reminders = [], savings = [], variant, fileNameBase } = opts;
  const wb = XLSX.utils.book_new();

  const incomeHasUrl = incomes.some((r: any) => typeof r.invoiceUrl !== "undefined");
  const expenseHasUrl = expenses.some((r: any) => typeof r.receiptUrl !== "undefined");

  const incomeHeader: (keyof IncomeRow | "invoiceUrl")[] = ["date", "source", "amount", ...(incomeHasUrl ? ["invoiceUrl"] : [])];
  const expenseHeader: (keyof ExpenseRow | "receiptUrl")[] = ["date", "category", "amount", ...(expenseHasUrl ? ["receiptUrl"] : [])];

  const normalizedIncomes = incomes.map((r) => {
    const base: any = { date: r.date, source: r.source, amount: r.amount };
    if (incomeHasUrl) base.invoiceUrl = r.invoiceUrl ?? "";
    return base;
  });
  const normalizedExpenses = expenses.map((r) => {
    const base: any = { date: r.date, category: r.category, amount: r.amount };
    if (expenseHasUrl) base.receiptUrl = r.receiptUrl ?? "";
    return base;
  });

  const incomeSheet = XLSX.utils.json_to_sheet(normalizedIncomes, { header: incomeHeader as string[] });
  const expenseSheet = XLSX.utils.json_to_sheet(normalizedExpenses, { header: expenseHeader as string[] });

  addHyperlinks(incomeSheet, incomeHeader as string[]);
  addHyperlinks(expenseSheet, expenseHeader as string[]);

  XLSX.utils.book_append_sheet(wb, incomeSheet, "Incomes");
  XLSX.utils.book_append_sheet(wb, expenseSheet, "Expenses");

  if (reminders.length) {
    const remHeader: (keyof ReminderRow)[] = ["title", "dueDate", "amount"];
    const remSheet = XLSX.utils.json_to_sheet(
      reminders.map((r) => ({ title: r.title, dueDate: r.dueDate, amount: r.amount ?? "" })),
      { header: remHeader as string[] },
    );
    XLSX.utils.book_append_sheet(wb, remSheet, "Reminders");
  }
  if (savings.length) {
    const savHeader: (keyof SavingRow)[] = ["name", "amount", "date"];
    const savSheet = XLSX.utils.json_to_sheet(
      savings.map((s) => ({ name: s.name, amount: s.amount, date: s.date ?? "" })),
      { header: savHeader as string[] },
    );
    XLSX.utils.book_append_sheet(wb, savSheet, "Savings");
  }

  const totalIncome = incomes.reduce((a, b) => a + (Number(b.amount) || 0), 0);
  const totalExpense = expenses.reduce((a, b) => a + (Number(b.amount) || 0), 0);
  const summary = [
    { field: "Variant", value: variant },
    { field: "Total Incomes", value: totalIncome },
    { field: "Total Expenses", value: totalExpense },
    { field: "Savings", value: totalIncome - totalExpense },
  ];
  const summarySheet = XLSX.utils.json_to_sheet(summary, { header: ["field", "value"] });
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

  const fileBase = fileNameBase || `fintrack-${variant.toLowerCase()}-${new Date().toISOString().slice(0, 10)}`;
  XLSX.writeFile(wb, `${fileBase}.xlsx`);
}
