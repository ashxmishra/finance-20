import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Income from "./pages/Income";
import Expenses from "./pages/Expenses";
import SavingsReminders from "./pages/SavingsReminders";
import Tax from "./pages/Tax";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { FinanceProvider } from "./context/FinanceContext";

const queryClient = new QueryClient();

const App = () => (
  <AuthProvider>
    <FinanceProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/income"
                element={
                  <ProtectedRoute>
                    <Income />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/expenses"
                element={
                  <ProtectedRoute>
                    <Expenses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/savings-reminders"
                element={
                  <ProtectedRoute>
                    <SavingsReminders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tax"
                element={
                  <ProtectedRoute>
                    <Tax />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </FinanceProvider>
  </AuthProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
