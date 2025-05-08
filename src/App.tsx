
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import AuthGuard from "@/components/AuthGuard";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PromptGenerator from "./pages/PromptGenerator";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";

const queryClient = new QueryClient();

// Wrapper component to provide navigation function to AuthProvider
const AuthProviderWithRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  return <AuthProvider navigateFunction={navigate}>{children}</AuthProvider>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProviderWithRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route 
                path="/prompt-generator" 
                element={
                  <AuthGuard>
                    <PromptGenerator />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                } 
              />
              <Route 
                path="/admin" 
                element={
                  <AuthGuard>
                    <AdminDashboard />
                  </AuthGuard>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProviderWithRouter>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
