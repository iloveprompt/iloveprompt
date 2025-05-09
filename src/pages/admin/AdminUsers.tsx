
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Search, UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';

interface UserWithRole {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  plan: string;
  created: string;
}

interface UserProfile {
  id: string;
  full_name?: string;
}

const AdminUsers = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Verificar se as tabelas existem
        const { data: tables, error: tablesError } = await supabase.rpc('get_tables');
        
        let usersList: UserWithRole[] = [];
        
        if (tablesError || !tables || !Array.isArray(tables) || !tables.includes('user_role_assignments')) {
          // Se as tabelas não existirem, retornar dados mockados
          usersList = [
            { 
              id: '1', 
              name: 'John Doe', 
              email: 'john.doe@example.com', 
              role: 'User', 
              status: 'active',
              plan: 'Free',
              created: '2023-05-10' 
            },
            { 
              id: '2', 
              name: 'Jane Smith', 
              email: 'jane.smith@example.com', 
              role: 'Premium', 
              status: 'active',
              plan: 'Premium',
              created: '2023-06-15' 
            },
            { 
              id: '3', 
              name: 'Robert Johnson', 
              email: 'robert.johnson@example.com', 
              role: 'User', 
              status: 'inactive',
              plan: 'Free',
              created: '2023-07-20' 
            },
            { 
              id: '4', 
              name: 'Sarah Williams', 
              email: 'sarah.williams@example.com', 
              role: 'Premium', 
              status: 'active',
              plan: 'Premium',
              created: '2023-08-25' 
            },
            { 
              id: '5', 
              name: 'Ander Dorneles', 
              email: 'ander_dorneles@hotmail.com', 
              role: 'Admin', 
              status: 'active',
              plan: 'Professional',
              created: '2023-04-01' 
            }
          ];
        } else {
          // Se as tabelas existirem, buscar dados reais
          try {
            // Buscar usuários Supabase
            const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
            
            if (authError) {
              throw authError;
            }
            
            // Processar usuários
            if (authUsers && authUsers.users) {
              for (const authUser of authUsers.users) {
                // Buscar role do usuário
                const { data: roleAssignments, error: roleError } = await supabase
                  .from('user_role_assignments')
                  .select(`
                    role_id,
                    user_roles:role_id(name)
                  `)
                  .eq('user_id', authUser.id)
                  .maybeSingle();
                  
                // Buscar plano do usuário
                const { data: subscriptions, error: subscriptionError } = await supabase
                  .from('user_subscriptions')
                  .select(`
                    subscription_plans:plan_id(name)
                  `)
                  .eq('user_id', authUser.id)
                  .eq('status', 'active')
                  .order('created_at', { ascending: false })
                  .maybeSingle();
                  
                // Buscar perfil do usuário
                const { data: profileData, error: profileError } = await supabase
                  .from('user_profiles')
                  .select('full_name')
                  .eq('id', authUser.id)
                  .maybeSingle();
                  
                // Determinar valores
                const roleName = roleAssignments && roleAssignments.user_roles ? 
                  (roleAssignments.user_roles as any).name || 'User' : 
                  'User';
                  
                const planName = subscriptions && subscriptions.subscription_plans ? 
                  (subscriptions.subscription_plans as any).name || 'Free' : 
                  'Free';
                  
                const userName = (profileData && profileData.full_name) || 
                  (authUser.email ? authUser.email.split('@')[0] : 'Unknown');
                
                const userStatus = authUser.banned_until ? 'inactive' : 'active';
                const createdDate = authUser.created_at ? 
                  new Date(authUser.created_at).toLocaleDateString() : 
                  'Unknown';
                
                usersList.push({
                  id: authUser.id,
                  name: userName,
                  email: authUser.email || 'No email',
                  role: roleName,
                  status: userStatus,
                  plan: planName,
                  created: createdDate
                });
              }
            }
          } catch (authError) {
            console.error('Erro ao buscar usuários:', authError);
            
            // Fallback para buscar usuários diretamente da tabela auth.users
            const { data: authUsers, error } = await supabase
              .from('auth.users')
              .select('id, email, created_at');
            
            if (error) {
              throw error;
            }
            
            if (authUsers) {
              for (const authUser of authUsers) {
                let userName = authUser.email ? authUser.email.split('@')[0] : 'Unknown';
                
                usersList.push({
                  id: authUser.id as string,
                  name: userName,
                  email: authUser.email as string || 'No email',
                  role: 'User',
                  status: 'active',
                  plan: 'Free',
                  created: authUser.created_at ? 
                    new Date(authUser.created_at as string).toLocaleDateString() : 
                    'Unknown'
                });
              }
            }
          }
        }
        
        setUsers(usersList);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar usuários',
          description: 'Ocorreu um erro ao buscar os usuários. Por favor, tente novamente.'
        });
        
        // Usar dados mockados em caso de erro
        setUsers([
          { 
            id: '1', 
            name: 'John Doe', 
            email: 'john.doe@example.com', 
            role: 'User', 
            status: 'active',
            plan: 'Free',
            created: '2023-05-10' 
          },
          { 
            id: '5', 
            name: 'Ander Dorneles', 
            email: 'ander_dorneles@hotmail.com', 
            role: 'Admin', 
            status: 'active',
            plan: 'Professional',
            created: '2023-04-01' 
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [toast]);

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
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          {t('admin.addUser')}
        </Button>
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
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.name')}</TableHead>
                  <TableHead>{t('admin.email')}</TableHead>
                  <TableHead>{t('admin.role')}</TableHead>
                  <TableHead>{t('admin.plan')}</TableHead>
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
                      <Badge variant={
                        user.plan === 'Professional' ? 'default' : 
                        user.plan === 'Premium' ? 'secondary' : 
                        'outline'
                      }>
                        {user.plan}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminUsers;
