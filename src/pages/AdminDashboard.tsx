import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import AdminDashboardNavbar from '@/components/dashboard/AdminDashboardNavbar';
import AdminDashboardFooter from '@/components/dashboard/AdminDashboardFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout
      navbarComponent={<AdminDashboardNavbar />}
      footerComponent={<AdminDashboardFooter />}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-500">
              System overview and management
            </p>
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm font-medium">
            Admin
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">1,247</p>
              <p className="text-green-600 text-sm mt-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
                12% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Active Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">842</p>
              <p className="text-green-600 text-sm mt-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
                8% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">$32.4k</p>
              <p className="text-green-600 text-sm mt-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
                15% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Prompts Generated</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">43.8k</p>
              <p className="text-green-600 text-sm mt-1 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
                23% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Last 7 days user activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                <p className="text-gray-500">Activity chart would go here</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Latest Signups</CardTitle>
              <CardDescription>New users in the last 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center">JD</div>
                    <div>
                      <p className="font-medium">john.doe@example.com</p>
                      <p className="text-xs text-gray-500">Free Plan</p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-sm">2 hours ago</span>
                </li>
                <li className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center">SM</div>
                    <div>
                      <p className="font-medium">sarah.miller@example.com</p>
                      <p className="text-xs text-gray-500">Pro Plan</p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-sm">4 hours ago</span>
                </li>
                <li className="flex justify-between items-center border-b pb-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center">RJ</div>
                    <div>
                      <p className="font-medium">robert.johnson@example.com</p>
                      <p className="text-xs text-gray-500">Free Plan</p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-sm">8 hours ago</span>
                </li>
                <li className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="bg-yellow-100 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center">LW</div>
                    <div>
                      <p className="font-medium">lisa.wong@example.com</p>
                      <p className="text-xs text-gray-500">Team Plan</p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-sm">12 hours ago</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
