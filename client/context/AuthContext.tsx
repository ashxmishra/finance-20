import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { ensureFirebase, isFirebaseEnabled } from "@/lib/firebase";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  isGuest: boolean;
  firebaseReady: boolean;
}

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setGuest] = useState(false);

  useEffect(() => {
    if (!isFirebaseEnabled) {
      setLoading(false);
      return;
    }
    const svc = ensureFirebase();
    if (!svc) {
      setLoading(false);
      return;
    }
    let unsub = () => {};
    import("firebase/auth").then(({ onAuthStateChanged }) => {
      unsub = onAuthStateChanged(svc.auth, (u) => {
        setUser(u);
        setLoading(false);
      });
    });
    return () => unsub();
  }, []);

  const value = useMemo<AuthCtx>(() => ({
    user,
    loading,
    firebaseReady: isFirebaseEnabled,
    isGuest,
    continueAsGuest: () => {
      setGuest(true);
      setUser(null);
      setLoading(false);
    },
    signInWithGoogle: async () => {
      const svc = ensureFirebase();
      if (!svc) throw new Error("Firebase not configured");
      await svc.auth.signInWithPopup ? svc.auth.signInWithPopup(svc.provider) : (await import("firebase/auth")).signInWithPopup(svc.auth, svc.provider);
    },
    signOut: async () => {
      const svc = ensureFirebase();
      if (!svc) {
        setGuest(false);
        setUser(null);
        return;
      }
      await svc.auth.signOut();
      setGuest(false);
      setUser(null);
    },
  }), [user, loading, isGuest]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
