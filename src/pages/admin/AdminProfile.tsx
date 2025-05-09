
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

const AdminProfile = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const userInitials = user?.email 
    ? user.email.substring(0, 2).toUpperCase()
    : 'US';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('profile.title')}</h1>
          <p className="text-gray-500">
            {t('profile.updateProfile')}
          </p>
        </div>
        <Button>{t('profile.saveChanges')}</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.accountInfo')}</CardTitle>
              <CardDescription>
                {t('profile.yourAccount')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="text-2xl bg-blue-600 text-white">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="mt-4 space-y-2">
                  <Button variant="outline" size="sm">{t('profile.changeAvatar')}</Button>
                  <Button variant="ghost" size="sm" className="text-red-600">{t('profile.removeAvatar')}</Button>
                </div>
              </div>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-2">{t('profile.accountType')}</h3>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm inline-block">
                  Admin
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">{t('profile.memberSince')}</h3>
                <p className="text-sm text-gray-500">Jan 15, 2023</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">{t('profile.lastLogin')}</h3>
                <p className="text-sm text-gray-500">Today at 09:30 AM</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.personalInfo')}</CardTitle>
              <CardDescription>{t('profile.updateProfile')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('profile.name')}</label>
                  <Input defaultValue="Admin User" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('profile.email')}</label>
                  <Input defaultValue={user?.email || 'admin@example.com'} disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('profile.role')}</label>
                  <Input defaultValue="Administrator" disabled />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('profile.timezone')}</label>
                  <Input defaultValue="UTC-03:00" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('profile.bio')}</label>
                <Textarea rows={4} placeholder={t('profile.bioPlaceholder')} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('profile.securitySettings')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button variant="outline">{t('profile.changePassword')}</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{t('profile.twoFactorAuth')}</h3>
                  <p className="text-sm text-gray-500">Secure your account with 2FA</p>
                </div>
                <Button variant="outline">{t('profile.enable')}</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
