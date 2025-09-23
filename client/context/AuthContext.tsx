import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import { ensureFirebase, isFirebaseEnabled } from "@/lib/firebase";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  continueAsGuest: () => void;
  isGuest: boolean;
  firebaseReady: boolean;
}

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
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

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      loading,
      firebaseReady: isFirebaseEnabled,
      isGuest,
      continueAsGuest: async () => {
        if (!isFirebaseEnabled) {
          alert("Firebase not configured. Please set VITE_FIREBASE_* to use guest mode (anonymous auth).");
          return;
        }
        const svc = ensureFirebase();
        if (!svc) return;
        const { signInAnonymously } = await import("firebase/auth");
        await signInAnonymously(svc.auth);
        setGuest(true);
      },
      signInWithGoogle: async () => {
        const svc = ensureFirebase();
        if (!svc) throw new Error("Firebase not configured");
        const { signInWithPopup } = await import("firebase/auth");
        await signInWithPopup(svc.auth, svc.provider);
      },
      signInWithEmail: async (email: string, password: string) => {
        const svc = ensureFirebase();
        if (!svc) throw new Error("Firebase not configured");
        const { signInWithEmailAndPassword } = await import("firebase/auth");
        await signInWithEmailAndPassword(svc.auth, email, password);
      },
      signUpWithEmail: async (email: string, password: string) => {
        const svc = ensureFirebase();
        if (!svc) throw new Error("Firebase not configured");
        const { createUserWithEmailAndPassword } = await import(
          "firebase/auth"
        );
        await createUserWithEmailAndPassword(svc.auth, email, password);
      },
      signOut: async () => {
        const svc = ensureFirebase();
        if (!svc) {
          setGuest(false);
          setUser(null);
          return;
        }
        const { signOut } = await import("firebase/auth");
        await signOut(svc.auth);
        setGuest(false);
        setUser(null);
      },
    }),
    [user, loading, isGuest],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
