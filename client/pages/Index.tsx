import AppLayout from "@/components/layout/AppLayout";
import { Link, useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();
  return (
    <AppLayout>
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <span className="inline-block text-xs font-semibold tracking-wider uppercase text-primary bg-primary/10 px-2 py-1 rounded">
            Personalized Finance
          </span>
          <h1 className="mt-3 text-4xl md:text-5xl font-extrabold leading-tight">
            FinTrack — your smart way to track income, expenses, and taxes
          </h1>
          <p className="mt-3 text-muted-foreground text-lg">
            Upload invoices and receipts, visualize your cash flow, set bill
            reminders, and export ITR/GST-ready Excel files.
          </p>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-3 rounded-lg bg-primary text-primary-foreground font-semibold"
            >
              Get started
            </button>
            <Link to="#features" className="px-5 py-3 rounded-lg border">
              Learn more
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <div className="aspect-[16/10] rounded-xl bg-gradient-to-br from-emerald-400/20 via-primary/10 to-indigo-400/20 grid place-items-center">
            <div className="text-center">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                Preview
              </div>
              <div className="text-2xl font-bold">Dashboard</div>
              <div className="mt-2 text-sm text-muted-foreground">
                Pie + Bar charts, totals, and reminders
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mt-16 grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Upload income & expenses",
            desc: "Attach invoices and receipts with secure cloud storage.",
          },
          {
            title: "Visual insights",
            desc: "Pie chart by category and bar chart comparing income vs expenses.",
          },
          {
            title: "Reminders & savings",
            desc: "Track savings and set reminders for upcoming bills.",
          },
          {
            title: "ITR & GST export",
            desc: "Generate Excel tailored for ITR or GST with one click.",
          },
          {
            title: "Secure login",
            desc: "Google sign-in powered by Firebase Auth.",
          },
          {
            title: "Mobile friendly",
            desc: "Beautiful, responsive UI that works on every screen.",
          },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border p-5 bg-card">
            <div className="font-semibold">{f.title}</div>
            <div className="text-sm text-muted-foreground mt-1">{f.desc}</div>
          </div>
        ))}
      </section>

      <section className="mt-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold">
          Ready to take control of your finances?
        </h2>
        <p className="text-muted-foreground mt-2">
          Start with FinTrack today. Log your income and expenses, then export
          an ITR/GST-ready Excel.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="mt-6 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold"
        >
          Launch FinTrack
        </button>
      </section>
    </AppLayout>
  );
}
