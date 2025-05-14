import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminDashboardNavbar from '@/components/dashboard/AdminDashboardNavbar';
import AdminDashboardFooter from '@/components/dashboard/AdminDashboardFooter';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboardNavbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <AdminDashboardFooter />
    </div>
  );
};

export default AdminLayout; 