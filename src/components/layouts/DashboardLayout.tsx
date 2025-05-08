
import React, { ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ScrollToTopOnMount from '@/components/ScrollToTopOnMount';

interface DashboardLayoutProps {
  children: ReactNode;
  navbarComponent: ReactNode;
  footerComponent: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  navbarComponent,
  footerComponent,
}) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ScrollToTopOnMount />
      {navbarComponent}
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      {footerComponent}
    </div>
  );
};

export default DashboardLayout;
