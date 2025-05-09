
import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Search } from 'lucide-react';

const AdminUsers = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for users
  const users = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john.doe@example.com', 
      role: 'User', 
      status: 'active', 
      created: '2023-05-10' 
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane.smith@example.com', 
      role: 'Premium', 
      status: 'active', 
      created: '2023-06-15' 
    },
    { 
      id: 3, 
      name: 'Robert Johnson', 
      email: 'robert.johnson@example.com', 
      role: 'User', 
      status: 'inactive', 
      created: '2023-07-20' 
    },
    { 
      id: 4, 
      name: 'Sarah Williams', 
      email: 'sarah.williams@example.com', 
      role: 'Premium', 
      status: 'active', 
      created: '2023-08-25' 
    },
    { 
      id: 5, 
      name: 'Ander Dorneles', 
      email: 'ander_dorneles@hotmail.com', 
      role: 'Admin', 
      status: 'active', 
      created: '2023-04-01' 
    }
  ];

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.userManagement')}</h1>
          <p className="text-gray-500">
            {t('admin.users')}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t('admin.users')}</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder={t('admin.search')}
                  className="pl-8 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.name')}</TableHead>
                <TableHead>{t('admin.email')}</TableHead>
                <TableHead>{t('admin.role')}</TableHead>
                <TableHead>{t('admin.status')}</TableHead>
                <TableHead>{t('admin.created')}</TableHead>
                <TableHead className="text-right">{t('admin.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'Admin' ? 'default' : user.role === 'Premium' ? 'secondary' : 'outline'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'success' : 'destructive'} className={user.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}>
                      {user.status === 'active' ? t('admin.active') : t('admin.inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.created}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
