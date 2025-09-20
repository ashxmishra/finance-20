import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ensureFirebase, isFirebaseEnabled } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export type Income = {
  id?: string;
  uid?: string;
  date: string;
  source: string;
  amount: number;
  invoiceUrl?: string;
};
export type Expense = {
  id?: string;
  uid?: string;
  date: string;
  category: string;
  amount: number;
  receiptUrl?: string;
};
export type Reminder = {
  id?: string;
  uid?: string;
  title: string;
  dueDate: string;
  amount?: number;
};
export type Saving = {
  id?: string;
  uid?: string;
  name: string;
  amount: number;
  date?: string;
};

interface FinanceCtx {
  incomes: Income[];
  expenses: Expense[];
  reminders: Reminder[];
  savings: Saving[];
  addIncome: (
    i: Omit<Income, "id" | "uid">,
    file?: File | null,
  ) => Promise<void>;
  addExpense: (
    e: Omit<Expense, "id" | "uid">,
    file?: File | null,
  ) => Promise<void>;
  addReminder: (r: Omit<Reminder, "id" | "uid">) => Promise<void>;
  addSaving: (s: Omit<Saving, "id" | "uid">) => Promise<void>;
  updateIncome: (id: string, i: Omit<Income, "id" | "uid">, file?: File | null) => Promise<void>;
  updateExpense: (id: string, e: Omit<Expense, "id" | "uid">, file?: File | null) => Promise<void>;
  updateReminder: (id: string, r: Omit<Reminder, "id" | "uid">) => Promise<void>;
  updateSaving: (id: string, s: Omit<Saving, "id" | "uid">) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  deleteSaving: (id: string) => Promise<void>;
}

const Ctx = createContext<FinanceCtx | null>(null);

function lsKey(uid: string) {
  return `fintrack:${uid || "guest"}`;
}

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isGuest } = useAuth();
  const storageKey = useMemo(
    () => lsKey(user?.uid || (isGuest ? "guest" : "anon")),
    [user?.uid, isGuest],
  );
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [savings, setSavings] = useState<Saving[]>([]);

  // Load from localStorage immediately to avoid flicker
  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      setIncomes(parsed.incomes || []);
      setExpenses(parsed.expenses || []);
      setReminders(parsed.reminders || []);
      setSavings(parsed.savings || []);
    } else {
      setIncomes([]);
      setExpenses([]);
      setReminders([]);
      setSavings([]);
    }
  }, [storageKey]);

  // Persist to localStorage on change
  useEffect(() => {
    const data = JSON.stringify({ incomes, expenses, reminders, savings });
    localStorage.setItem(storageKey, data);
  }, [incomes, expenses, reminders, savings, storageKey]);

  // Firestore realtime subscription when logged in
  useEffect(() => {
    let unsubscribers: Array<() => void> = [];
    async function sub() {
      if (!isFirebaseEnabled || !user) return;
      const svc = ensureFirebase();
      if (!svc) return;
      const { collection, onSnapshot, query, where, orderBy } = await import(
        "firebase/firestore"
      );
      unsubscribers.push(
        onSnapshot(
          query(
            collection(svc.db, "incomes"),
            where("uid", "==", user.uid),
            orderBy("date", "desc"),
          ),
          (snap) =>
            setIncomes(
              snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })),
            ),
        ),
      );
      unsubscribers.push(
        onSnapshot(
          query(
            collection(svc.db, "expenses"),
            where("uid", "==", user.uid),
            orderBy("date", "desc"),
          ),
          (snap) =>
            setExpenses(
              snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })),
            ),
        ),
      );
      unsubscribers.push(
        onSnapshot(
          query(
            collection(svc.db, "reminders"),
            where("uid", "==", user.uid),
            orderBy("dueDate", "asc"),
          ),
          (snap) =>
            setReminders(
              snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })),
            ),
        ),
      );
      unsubscribers.push(
        onSnapshot(
          query(
            collection(svc.db, "savings"),
            where("uid", "==", user.uid),
            orderBy("date", "desc"),
          ),
          (snap) =>
            setSavings(
              snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })),
            ),
        ),
      );
    }
    sub();
    return () => {
      unsubscribers.forEach((u) => u());
    };
  }, [user?.uid]);

  async function uploadFile(path: string, file: File) {
    const svc = ensureFirebase();
    if (!svc) return undefined;
    const { ref, uploadBytes, getDownloadURL } = await import(
      "firebase/storage"
    );
    const r = ref(svc.storage, path);
    await uploadBytes(r, file);
    return await getDownloadURL(r);
  }

  async function addIncome(
    data: Omit<Income, "id" | "uid">,
    file?: File | null,
  ) {
    if (isFirebaseEnabled && user) {
      const svc = ensureFirebase();
      if (!svc) return;
      let invoiceUrl: string | undefined = data.invoiceUrl;
      if (file)
        invoiceUrl = await uploadFile(
          `invoices/${user.uid}/${Date.now()}-${file.name}`,
          file,
        );
      const { addDoc, collection, serverTimestamp } = await import(
        "firebase/firestore"
      );
      await addDoc(collection(svc.db, "incomes"), {
        ...data,
        invoiceUrl,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
    } else {
      const invoiceUrl = file ? URL.createObjectURL(file) : data.invoiceUrl;
      setIncomes((prev) => [{ ...data, invoiceUrl, id: crypto.randomUUID() }, ...prev]);
    }
  }

  async function addExpense(
    data: Omit<Expense, "id" | "uid">,
    file?: File | null,
  ) {
    if (isFirebaseEnabled && user) {
      const svc = ensureFirebase();
      if (!svc) return;
      let receiptUrl: string | undefined = data.receiptUrl;
      if (file)
        receiptUrl = await uploadFile(
          `receipts/${user.uid}/${Date.now()}-${file.name}`,
          file,
        );
      const { addDoc, collection, serverTimestamp } = await import(
        "firebase/firestore"
      );
      await addDoc(collection(svc.db, "expenses"), {
        ...data,
        receiptUrl,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
    } else {
      const receiptUrl = file ? URL.createObjectURL(file) : data.receiptUrl;
      setExpenses((prev) => [{ ...data, receiptUrl, id: crypto.randomUUID() }, ...prev]);
    }
  }

  async function addReminder(data: Omit<Reminder, "id" | "uid">) {
    if (isFirebaseEnabled && user) {
      const svc = ensureFirebase();
      if (!svc) return;
      const { addDoc, collection, serverTimestamp } = await import(
        "firebase/firestore"
      );
      await addDoc(collection(svc.db, "reminders"), {
        ...data,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
    } else {
      setReminders((prev) => [{ ...data, id: crypto.randomUUID() }, ...prev]);
    }
  }

  async function addSaving(data: Omit<Saving, "id" | "uid">) {
    if (isFirebaseEnabled && user) {
      const svc = ensureFirebase();
      if (!svc) return;
      const { addDoc, collection, serverTimestamp } = await import(
        "firebase/firestore"
      );
      await addDoc(collection(svc.db, "savings"), {
        ...data,
        uid: user.uid,
        createdAt: serverTimestamp(),
      });
    } else {
      setSavings((prev) => [{ ...data, id: crypto.randomUUID() }, ...prev]);
    }
  }

  async function del(
    col: "incomes" | "expenses" | "reminders" | "savings",
    id: string,
  ) {
    if (isFirebaseEnabled && user) {
      const svc = ensureFirebase();
      if (!svc) return;
      const { doc, deleteDoc } = await import("firebase/firestore");
      await deleteDoc(doc(svc.db, col, id));
    }
    if (col === "incomes")
      setIncomes((prev) => prev.filter((i) => i.id !== id));
    if (col === "expenses")
      setExpenses((prev) => prev.filter((i) => i.id !== id));
    if (col === "reminders")
      setReminders((prev) => prev.filter((i) => i.id !== id));
    if (col === "savings")
      setSavings((prev) => prev.filter((i) => i.id !== id));
  }

  const value = useMemo<FinanceCtx>(
    () => ({
      incomes,
      expenses,
      reminders,
      savings,
      addIncome,
      addExpense,
      addReminder,
      addSaving,
      deleteIncome: (id: string) => del("incomes", id),
      deleteExpense: (id: string) => del("expenses", id),
      deleteReminder: (id: string) => del("reminders", id),
      deleteSaving: (id: string) => del("savings", id),
    }),
    [incomes, expenses, reminders, savings],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useFinance() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
}
