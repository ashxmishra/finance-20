import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/income", label: "Income" },
  { to: "/expenses", label: "Expenses" },
  { to: "/savings-reminders", label: "Savings & Reminders" },
  { to: "/tax", label: "ITR/GST" },
  { to: "/profile", label: "Profile" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut, isGuest } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 font-extrabold text-xl tracking-tight"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground">
              ₹
            </span>
            <span>
              <span className="text-primary">Fin</span>Track
            </span>
          </Link>
          <nav className="hidden md:flex gap-2 text-sm">
            {navItems.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-1.5 rounded-md transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-muted",
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:block text-sm text-muted-foreground">
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="px-3 py-1.5 rounded-md bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm shadow hover:opacity-95"
                >
                  Sign out
                </button>
              </>
            ) : isGuest ? (
              <button
                onClick={signOut}
                className="px-3 py-1.5 rounded-md border text-sm hover:bg-muted"
              >
                Exit guest
              </button>
            ) : (
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-md bg-gradient-to-r from-primary to-accent text-primary-foreground text-sm shadow hover:opacity-95"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} FinTrack. All rights reserved.
      </footer>
    </div>
  );
}
