import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPrompts from "./pages/admin/AdminPrompts";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLogs from "./pages/admin/AdminLogs";
import AdminProfile from "./pages/admin/AdminProfile";
import DatabaseSetup from "./pages/admin/DatabaseSetup";
import Settings from "./pages/dashboard/Settings";
import Profile from "./pages/dashboard/Profile";
import History from "./pages/dashboard/History";
import DashboardLayout from "./components/layouts/DashboardLayout";
import UserDashboardNavbar from "./components/dashboard/UserDashboardNavbar";
import UserDashboardFooter from "./components/dashboard/UserDashboardFooter";
import AdminDashboardNavbar from "./components/dashboard/AdminDashboardNavbar";
import AdminDashboardFooter from "./components/dashboard/AdminDashboardFooter";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
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
                path="/dashboard/profile" 
                element={
                  <AuthGuard>
                    <DashboardLayout
                      navbarComponent={<UserDashboardNavbar />}
                      footerComponent={<UserDashboardFooter />}
                    >
                      <Profile />
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
              
              <Route 
                path="/admin/users" 
                element={
                  <AuthGuard>
                    <DashboardLayout
                      navbarComponent={<AdminDashboardNavbar />}
                      footerComponent={<AdminDashboardFooter />}
                    >
                      <AdminUsers />
                    </DashboardLayout>
                  </AuthGuard>
                } 
              />
              
              <Route 
                path="/admin/prompts" 
                element={
                  <AuthGuard>
                    <DashboardLayout
                      navbarComponent={<AdminDashboardNavbar />}
                      footerComponent={<AdminDashboardFooter />}
                    >
                      <AdminPrompts />
                    </DashboardLayout>
                  </AuthGuard>
                } 
              />
              
              <Route 
                path="/admin/settings" 
                element={
                  <AuthGuard>
                    <DashboardLayout
                      navbarComponent={<AdminDashboardNavbar />}
                      footerComponent={<AdminDashboardFooter />}
                    >
                      <AdminSettings />
                    </DashboardLayout>
                  </AuthGuard>
                } 
              />
              
              <Route 
                path="/admin/logs" 
                element={
                  <AuthGuard>
                    <DashboardLayout
                      navbarComponent={<AdminDashboardNavbar />}
                      footerComponent={<AdminDashboardFooter />}
                    >
                      <AdminLogs />
                    </DashboardLayout>
                  </AuthGuard>
                } 
              />

              {/* New admin profile route */}
              <Route 
                path="/admin/profile" 
                element={
                  <AuthGuard>
                    <DashboardLayout
                      navbarComponent={<AdminDashboardNavbar />}
                      footerComponent={<AdminDashboardFooter />}
                    >
                      <AdminProfile />
                    </DashboardLayout>
                  </AuthGuard>
                } 
              />
              
              {/* New database setup route */}
              <Route 
                path="/admin/database-setup" 
                element={
                  <AuthGuard>
                    <DashboardLayout
                      navbarComponent={<AdminDashboardNavbar />}
                      footerComponent={<AdminDashboardFooter />}
                    >
                      <DatabaseSetup />
                    </DashboardLayout>
                  </AuthGuard>
                } 
              />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
