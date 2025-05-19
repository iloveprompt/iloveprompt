// Importação dos componentes e bibliotecas necessárias para o funcionamento da aplicação
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { AuthProvider } from "@/hooks/useAuth";
import AuthGuard from "@/components/AuthGuard";
import { LlmProvider } from '@/contexts/LlmContext';
// Importação das páginas principais do sistema
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
import WizardItems from './pages/admin/prompts';
import AdminLayout from './components/layouts/AdminLayout';

// Criação do cliente de queries para gerenciamento de cache e requisições
const queryClient = new QueryClient();

// Componente principal da aplicação
const App = () => (
  // Provedor do React Query para gerenciamento de dados assíncronos
  <QueryClientProvider client={queryClient}>
    {/* Provedor de contexto de idioma para internacionalização */}
    <LanguageProvider>
      {/* Provedor de tooltips para exibir dicas ao usuário */}
      <TooltipProvider>
        {/* Router para navegação entre páginas */}
        <Router>
          {/* Provedor de autenticação para gerenciar login/logout */}
          <AuthProvider>
            {/* Provedor de contexto de LLM para gerenciar modelos de linguagem */}
            <LlmProvider>
              {/* Componente para exibir notificações do sistema */}
              <Toaster />
              <Sonner />
              {/* Definição das rotas da aplicação */}
              <Routes>
                {/* Rota da página inicial */}
                <Route path="/" element={<Index />} />
                {/* Rotas de autenticação */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                
                {/* Rotas do dashboard do usuário, protegidas por autenticação */}
                <Route 
                  path="/dashboard" 
                  element={
                    <AuthGuard>
                      <Dashboard />
                    </AuthGuard>
                  } 
                />
                {/* Rota para o gerador de prompts dentro do dashboard */}
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
                {/* Rota para configurações do usuário */}
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
                {/* Rota para perfil do usuário */}
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
                {/* Rota para histórico do usuário */}
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
                
                {/* Rotas administrativas, protegidas por autenticação */}
                <Route 
                  path="/admin" 
                  element={
                    <AuthGuard>
                      <AdminLayout />
                    </AuthGuard>
                  } 
                >
                  {/* Sub-rotas administrativas */}
                  <Route path="prompts" element={<WizardItems />} />
                  <Route 
                    path="users" 
                    element={
                      <DashboardLayout
                        navbarComponent={<AdminDashboardNavbar />}
                        footerComponent={<AdminDashboardFooter />}
                      >
                        <AdminUsers />
                      </DashboardLayout>
                    } 
                  />
                  <Route 
                    path="settings" 
                    element={
                      <DashboardLayout
                        navbarComponent={<AdminDashboardNavbar />}
                        footerComponent={<AdminDashboardFooter />}
                      >
                        <AdminSettings />
                      </DashboardLayout>
                    } 
                  />
                  <Route 
                    path="logs" 
                    element={
                      <DashboardLayout
                        navbarComponent={<AdminDashboardNavbar />}
                        footerComponent={<AdminDashboardFooter />}
                      >
                        <AdminLogs />
                      </DashboardLayout>
                    } 
                  />
                  <Route 
                    path="profile" 
                    element={
                      <DashboardLayout
                        navbarComponent={<AdminDashboardNavbar />}
                        footerComponent={<AdminDashboardFooter />}
                      >
                        <AdminProfile />
                      </DashboardLayout>
                    } 
                  />
                  <Route 
                    path="database-setup" 
                    element={
                      <DashboardLayout
                        navbarComponent={<AdminDashboardNavbar />}
                        footerComponent={<AdminDashboardFooter />}
                      >
                        <DatabaseSetup />
                      </DashboardLayout>
                    } 
                  />
                </Route>
                {/* Todas as rotas personalizadas devem ser adicionadas acima da rota catch-all */}
                {/* Rota para página não encontrada */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </LlmProvider>
          </AuthProvider>
        </Router>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

// Exporta o componente principal para ser utilizado no ponto de entrada da aplicação
export default App;
