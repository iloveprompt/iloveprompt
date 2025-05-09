
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import UserDashboardNavbar from '@/components/dashboard/UserDashboardNavbar';
import UserDashboardFooter from '@/components/dashboard/UserDashboardFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/i18n/LanguageContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <DashboardLayout
      navbarComponent={<UserDashboardNavbar />}
      footerComponent={<UserDashboardFooter />}
    >
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
        <p className="text-gray-500">
          {t('dashboard.welcomeBack')}, {user?.email?.split('@')[0] || 'User'}!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.promptsCreated')}</CardTitle>
              <CardDescription>{t('dashboard.totalPrompts')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">24</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.usage')}</CardTitle>
              <CardDescription>{t('dashboard.currentMonthUsage')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">65%</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.savedTemplates')}</CardTitle>
              <CardDescription>{t('dashboard.templateLibrary')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">7</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
              <CardDescription>{t('dashboard.latestPromptGenerations')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">E-commerce Product Description</span>
                  <span className="text-gray-500 text-sm">2 hours ago</span>
                </li>
                <li className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Blog Post Draft</span>
                  <span className="text-gray-500 text-sm">Yesterday</span>
                </li>
                <li className="flex justify-between items-center border-b pb-2">
                  <span className="font-medium">Email Campaign</span>
                  <span className="text-gray-500 text-sm">3 days ago</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.proTips')}</CardTitle>
              <CardDescription>{t('dashboard.getMore')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-start gap-2">
                  <div className="bg-blue-100 text-blue-700 rounded-full p-1 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <span>Try using specific keywords in your prompts for better results.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-blue-100 text-blue-700 rounded-full p-1 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <span>Save your best prompts as templates for quick access.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="bg-blue-100 text-blue-700 rounded-full p-1 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <span>Explore our tutorial section for advanced prompt techniques.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
