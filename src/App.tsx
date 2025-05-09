
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
import PromptGeneratorWizard from "./pages/wizard/PromptGeneratorWizard";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Settings from "./pages/dashboard/Settings";
import History from "./pages/dashboard/History";
import DashboardLayout from "./components/layouts/DashboardLayout";
import UserDashboardNavbar from "./components/dashboard/UserDashboardNavbar";
import UserDashboardFooter from "./components/dashboard/UserDashboardFooter";
import AdminDashboardNavbar from "./components/dashboard/AdminDashboardNavbar";
import AdminDashboardFooter from "./components/dashboard/AdminDashboardFooter";

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
              
              {/* Dashboard routes */}
              <Route 
                path="/dashboard" 
                element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                } 
              />
              
              <Route 
                path="/dashboard/prompt-generator" 
                element={
                  <AuthGuard>
                    <DashboardLayout
                      navbarComponent={<UserDashboardNavbar />}
                      footerComponent={<UserDashboardFooter />}
                    >
                      <PromptGeneratorWizard />
                    </DashboardLayout>
                  </AuthGuard>
                } 
              />
              
              <Route 
                path="/dashboard/settings" 
                element={
                  <AuthGuard>
                    <DashboardLayout
                      navbarComponent={<UserDashboardNavbar />}
                      footerComponent={<UserDashboardFooter />}
                    >
                      <Settings />
                    </DashboardLayout>
                  </AuthGuard>
                } 
              />
              
              <Route 
                path="/dashboard/history" 
                element={
                  <AuthGuard>
                    <DashboardLayout
                      navbarComponent={<UserDashboardNavbar />}
                      footerComponent={<UserDashboardFooter />}
                    >
                      <History />
                    </DashboardLayout>
                  </AuthGuard>
                } 
              />
              
              {/* Admin routes */}
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
