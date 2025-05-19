import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Edit2, Trash2, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

type AdminUserViewRow = Database['public']['Views']['admin_users_view']['Row'];

interface AdminUserView {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string | null;
  role_id: string | null;
  role_name: string | null;
  subscription_status: string;
  plan_name: string;
}

interface UserWithDetails {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: string;
  plan: string;
  status: string;
  created_at: string;
  last_sign_in_at: string | null;
}

// Schema para validação do formulário
const userFormSchema = z.object({
  email: z.string().email('Email inválido'),
  full_name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  role: z.string(),
  plan: z.string(),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres').optional(),
});

const ITEMS_PER_PAGE = 6;

const AdminUsers = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithDetails | null>(null);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      email: '',
      full_name: '',
      role: 'user',
      plan: 'Free',
    },
  });

    const fetchUsers = async () => {
      try {
        setLoading(true);
        
      const { data: users, error } = await supabase
        .from('admin_users_view')
        .select('*');

      if (error) throw error;

      if (!users) {
        throw new Error('Nenhum usuário encontrado');
      }

      const usersList = users.map((user: AdminUserViewRow) => ({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        role: t(`userRole.${user.role_name?.toLowerCase() || 'user'}`),
        plan: t(`userPlan.${user.plan_name.toLowerCase()}`),
        status: t(`userStatus.${user.subscription_status.toLowerCase()}`),
        created_at: user.created_at,
        last_sign_in_at: null
      })) as UserWithDetails[];
        
        setUsers(usersList);
      setTotalPages(Math.ceil(usersList.length / ITEMS_PER_PAGE));
    } catch (error: any) {
        console.error('Erro ao buscar usuários:', error);
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar usuários',
        description: error.message || 'Ocorreu um erro ao buscar os usuários.'
      });
      } finally {
        setLoading(false);
      }
    };
    
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrar usuários baseado na busca
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Paginação
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleEditUser = (user: UserWithDetails) => {
    setSelectedUser(user);
    form.reset({
      email: user.email,
      full_name: user.full_name || '',
      role: user.role,
      plan: user.plan,
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        const { error } = await supabase.auth.admin.deleteUser(userId);
        if (error) throw error;
        
        await supabase.from('user_profiles').delete().eq('id', userId);
        
        toast({
          title: 'Usuário excluído',
          description: 'O usuário foi excluído com sucesso.',
        });
        
        fetchUsers();
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Erro ao excluir usuário',
          description: error.message,
        });
      }
    }
  };

  const onSubmit = async (data: z.infer<typeof userFormSchema>) => {
    try {
      if (selectedUser) {
        // Atualizar usuário
        const updates = {
          full_name: data.full_name,
          // Adicionar outros campos conforme necessário
        };

        const { error } = await supabase
          .from('user_profiles')
          .update(updates)
          .eq('id', selectedUser.id);

        if (error) throw error;

        // Atualizar role e plan se necessário
        // Aqui você precisaria implementar a lógica para atualizar role e plan

        toast({
          title: 'Usuário atualizado',
          description: 'As informações foram atualizadas com sucesso.',
        });
      } else {
        // Criar novo usuário
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: data.email,
          password: data.password!,
          email_confirm: true,
        });

        if (authError) throw authError;

        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: authData.user.id,
            full_name: data.full_name,
          });

        if (profileError) throw profileError;

        toast({
          title: 'Usuário criado',
          description: 'O novo usuário foi criado com sucesso.',
        });
      }

      setIsEditDialogOpen(false);
      fetchUsers();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao salvar usuário',
        description: error.message,
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Usuários</h1>
        <div className="flex gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar usuários..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setSelectedUser(null);
                form.reset({
                  email: '',
                  full_name: '',
                  role: 'user',
                  plan: 'Free',
                });
              }}>
                <UserPlus className="h-4 w-4 mr-2" />
                Novo Usuário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{selectedUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
                <DialogDescription>
                  {selectedUser 
                    ? 'Edite as informações do usuário abaixo.' 
                    : 'Preencha as informações para criar um novo usuário.'}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" disabled={!!selectedUser} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Função</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma função" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="user">Usuário</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="plan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plano</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um plano" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Free">Gratuito</SelectItem>
                            <SelectItem value="Pro">Profissional</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!selectedUser && (
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <DialogFooter>
                    <Button type="submit">
                      {selectedUser ? 'Salvar Alterações' : 'Criar Usuário'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando usuários...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedUsers.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Nenhum usuário encontrado.
              </div>
            ) : (
              paginatedUsers.map(user => (
                <Card key={user.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback>
                          {user.full_name ? user.full_name.substring(0, 2).toUpperCase() : 'US'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold">{user.full_name || 'Sem nome'}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit2 className="h-4 w-4" />
                        </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                          <Badge variant="outline">{user.role}</Badge>
                          <Badge variant="outline">{user.plan}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                          <p>Criado em: {new Date(user.created_at).toLocaleDateString()}</p>
                          {user.last_sign_in_at && (
                            <p>Último acesso: {new Date(user.last_sign_in_at).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          {/* Paginação */}
          {filteredUsers.length > 0 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminUsers;
