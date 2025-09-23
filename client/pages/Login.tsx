import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { isFirebaseEnabled } from "@/lib/firebase";
import { useState } from "react";

export default function Login() {
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    continueAsGuest,
    firebaseReady,
  } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (e) {
      console.error(e);
      alert("Login failed. Please configure Firebase or try again.");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center">Login to FinTrack</h1>
        <p className="text-muted-foreground mt-1 text-center">
          Securely access your personalized finance dashboard.
        </p>

        <div className="mt-6 rounded-xl border bg-card p-5">
          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="m"
                checked={mode === "signin"}
                onChange={() => setMode("signin")}
              />{" "}
              Sign in
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="m"
                checked={mode === "signup"}
                onChange={() => setMode("signup")}
              />{" "}
              Sign up
            </label>
          </div>
          <div className="mt-4 grid gap-3">
            <div>
              <label className="text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 border rounded-md px-3 py-2 bg-background"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 border rounded-md px-3 py-2 bg-background"
                placeholder="Minimum 6 characters"
              />
            </div>
            <button
              disabled={!firebaseReady || loading}
              onClick={async () => {
                try {
                  setLoading(true);
                  if (mode === "signup") {
                    await signUpWithEmail(email, password);
                  } else {
                    await signInWithEmail(email, password);
                  }
                  navigate("/dashboard");
                } catch (e: any) {
                  console.error(e);
                  alert(
                    e?.message ||
                      "Authentication failed. Check Firebase config or credentials.",
                  );
                } finally {
                  setLoading(false);
                }
              }}
              className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50"
            >
              {mode === "signup"
                ? loading
                  ? "Signing up..."
                  : "Sign up with Email"
                : loading
                  ? "Signing in..."
                  : "Sign in with Email"}
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <button
            onClick={handleLogin}
            disabled={!firebaseReady}
            className="w-full px-4 py-2 rounded-lg bg-secondary text-secondary-foreground disabled:opacity-50"
          >
            Continue with Google
          </button>
          {!isFirebaseEnabled && (
            <div className="text-xs text-amber-600 bg-amber-100 border border-amber-200 p-3 rounded-md">
              Firebase is not configured. You can still explore FinTrack in
              guest mode. Set VITE_FIREBASE_* env vars to enable authentication
              and data sync.
            </div>
          )}
          <button
            onClick={async () => {
              if (!firebaseReady) {
                alert("Firebase not configured. Guest mode requires anonymous auth.");
                return;
              }
              await continueAsGuest();
              navigate("/dashboard");
            }}
            className="w-full px-4 py-2 rounded-lg border"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
