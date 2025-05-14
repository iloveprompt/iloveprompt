import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/i18n/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Camera, Trash2, Lock } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: user?.user_metadata?.full_name || '',
    bio: user?.user_metadata?.bio || '',
    website: user?.user_metadata?.website || '',
    country: user?.user_metadata?.country || '',
  });
  
  const userInitials = user?.email 
    ? user.email.substring(0, 2).toUpperCase()
    : 'US';
  
  const handleSaveProfile = () => {
    // In a real app, this would update the user profile in the database
    toast({
      title: t('profile.savedChanges'),
      description: t('profile.updateProfile'),
    });
    
    setIsEditing(false);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };
  
  const formatDate = (timestamp: string | null | undefined) => {
    if (!timestamp) return 'N/A';
    return format(new Date(timestamp), 'PP');
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{t('profile.title')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - User Summary */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-blue-600 text-white text-2xl">{userInitials}</AvatarFallback>
                </Avatar>
                
                {!isEditing ? (
                  <Button 
                    variant="outline" 
                    className="absolute bottom-0 right-0 rounded-full h-8 w-8 p-0"
                    onClick={() => setIsEditing(true)}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="absolute -bottom-2 left-0 right-0 flex justify-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 px-2 bg-white"
                    >
                      <Camera className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">{t('profile.uploadNew')}</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-7 px-2 bg-white text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">{t('profile.removeAvatar')}</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <CardTitle>{user?.user_metadata?.full_name || user?.email}</CardTitle>
            <CardDescription>Free Plan</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">{t('profile.email')}</span>
              </div>
              <div>{user?.email}</div>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">{t('profile.memberSince')}</span>
              </div>
              <div>{formatDate(user?.created_at)}</div>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">{t('profile.lastLogin')}</span>
              </div>
              <div>{formatDate(user?.last_sign_in_at)}</div>
            </div>
            
            <Separator />
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">{t('profile.accountType')}</span>
              </div>
              <div className="flex items-center">
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  Free
                </span>
              </div>
            </div>
            
            <Button variant="default" className="w-full mt-2">
              {t('profile.upgradeAccount')}
            </Button>
          </CardContent>
        </Card>
        
        {/* Right column - Profile Information */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t('profile.personalInfo')}</CardTitle>
            <CardDescription>{t('profile.updateProfile')}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('profile.name')}</Label>
                {isEditing ? (
                  <Input 
                    id="name" 
                    name="name"
                    value={userData.name} 
                    onChange={handleChange}
                  />
                ) : (
                  <div className="px-3 py-2 border rounded-md bg-gray-50">
                    {userData.name || user?.user_metadata?.full_name || '-'}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t('profile.email')}</Label>
                <div className="px-3 py-2 border rounded-md bg-gray-50 flex items-center justify-between">
                  <span>{user?.email}</span>
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">{t('profile.bio')}</Label>
              {isEditing ? (
                <textarea 
                  id="bio"
                  name="bio"
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder={t('profile.bioPlaceholder')}
                  value={userData.bio}
                  onChange={handleChange}
                />
              ) : (
                <div className="px-3 py-2 border rounded-md bg-gray-50 min-h-[100px]">
                  {userData.bio || '-'}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">{t('profile.country')}</Label>
                {isEditing ? (
                  <Input 
                    id="country" 
                    name="country"
                    value={userData.country} 
                    onChange={handleChange}
                  />
                ) : (
                  <div className="px-3 py-2 border rounded-md bg-gray-50">
                    {userData.country || '-'}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">{t('profile.website')}</Label>
                {isEditing ? (
                  <Input 
                    id="website" 
                    name="website"
                    value={userData.website} 
                    onChange={handleChange}
                    placeholder="https://"
                  />
                ) : (
                  <div className="px-3 py-2 border rounded-md bg-gray-50">
                    {userData.website || '-'}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              {isEditing && (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              )}
              
              {isEditing ? (
                <Button onClick={handleSaveProfile}>
                  {t('profile.saveChanges')}
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
