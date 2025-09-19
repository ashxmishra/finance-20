import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { isFirebaseEnabled } from "@/lib/firebase";

export default function Login() {
  const { signInWithGoogle, continueAsGuest, firebaseReady } = useAuth();
  const navigate = useNavigate();

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
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-3xl font-bold">Login to FinTrack</h1>
        <p className="text-muted-foreground mt-1">Securely access your personalized finance dashboard.</p>
        <div className="mt-6 space-y-3">
          <button onClick={handleLogin} disabled={!firebaseReady} className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-50">Continue with Google</button>
          {!isFirebaseEnabled && (
            <div className="text-xs text-amber-600 bg-amber-100 border border-amber-200 p-3 rounded-md text-left">
              Firebase is not configured. You can still explore FinTrack in guest mode. Set VITE_FIREBASE_* env vars to enable authentication and data sync.
            </div>
          )}
          <button onClick={() => { continueAsGuest(); navigate("/dashboard"); }} className="w-full px-4 py-2 rounded-lg border">Continue as Guest</button>
        </div>
      </div>
    </AppLayout>
  );
}
