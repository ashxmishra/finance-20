import AppLayout from "@/components/layout/AppLayout";
import MetricCard from "@/components/MetricCard";
import { useAuth } from "@/context/AuthContext";
import { useFinance } from "@/context/FinanceContext";
import { useEffect, useState } from "react";

export default function Profile() {
  const { user, isGuest, signOut } = useAuth();
  const { incomes, expenses, savings, reminders } = useFinance();
  const totalIncome = incomes.reduce((a, b) => a + (Number(b.amount) || 0), 0);
  const totalExpenses = expenses.reduce(
    (a, b) => a + (Number(b.amount) || 0),
    0,
  );
  const savingsAmt = totalIncome - totalExpenses;

  const profileKey = `fintrack:profile:${user?.uid || (isGuest ? "guest" : "anon")}`;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(profileKey);
    if (raw) {
      try {
        const p = JSON.parse(raw);
        setName(p.name ?? (user?.displayName || ""));
        setEmail(p.email ?? (user?.email || ""));
        setAddress(p.address ?? "");
        setPhone(p.phone ?? "");
        return;
      } catch {}
    }
    setName(user?.displayName || "");
    setEmail(user?.email || "");
    setAddress("");
    setPhone("");
  }, [profileKey, user?.displayName, user?.email]);

  function handleSaveProfile() {
    localStorage.setItem(
      profileKey,
      JSON.stringify({ name, email, address, phone })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground grid place-items-center text-2xl overflow-hidden">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            ) : (
              (user?.displayName?.[0] ?? "F")
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">
              {user?.displayName || user?.email || (isGuest ? "Guest" : "User")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user?.email || (isGuest ? "Browsing as guest" : "")}
            </p>
          </div>
          <div>
            <button
              onClick={signOut}
              className="px-4 py-2 rounded-md border hover:bg-muted"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mt-6">
          <MetricCard
            title="Total Income"
            value={`₹${totalIncome.toLocaleString()}`}
            accent="green"
          />
          <MetricCard
            title="Total Expenses"
            value={`₹${totalExpenses.toLocaleString()}`}
            accent="red"
          />
          <MetricCard
            title="Savings"
            value={`₹${savingsAmt.toLocaleString()}`}
            accent={savingsAmt >= 0 ? "green" : "red"}
          />
          <MetricCard
            title="Items"
            value={`${incomes.length + expenses.length + savings.length + reminders.length}`}
            accent="amber"
          />
        </div>

        <div className="mt-6">
          <div className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold mb-4">Profile Details</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm">Name</label>
                <input
                  className="w-full mt-1 border rounded-md px-2 py-2 bg-background"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  className="w-full mt-1 border rounded-md px-2 py-2 bg-background"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm">Address</label>
                <textarea
                  className="w-full mt-1 border rounded-md px-2 py-2 bg-background min-h-[80px]"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, State, ZIP"
                />
              </div>
              <div>
                <label className="text-sm">Phone number</label>
                <input
                  className="w-full mt-1 border rounded-md px-2 py-2 bg-background"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-md bg-gradient-to-r from-primary to-accent text-primary-foreground shadow"
              >
                Save Profile
              </button>
              {saved && (
                <span className="text-sm text-muted-foreground">Saved</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
