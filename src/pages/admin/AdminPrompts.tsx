
import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2, Eye, Plus, Search } from 'lucide-react';
import PromptGeneratorWizard from '../wizard/PromptGeneratorWizard';

const AdminPrompts = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('prompts');
  const [selectedPrompt, setSelectedPrompt] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Mock data for prompts
  const prompts = [
    { 
      id: 1, 
      title: 'E-commerce Website', 
      author: 'John Doe', 
      type: 'Web Application', 
      created: '2023-05-10',
      modified: '2023-06-15',
      status: 'active'
    },
    { 
      id: 2, 
      title: 'Mobile Banking App', 
      author: 'Jane Smith', 
      type: 'Mobile App', 
      created: '2023-06-15',
      modified: '2023-07-20',
      status: 'active'
    },
    { 
      id: 3, 
      title: 'Restaurant Management System', 
      author: 'Robert Johnson', 
      type: 'Desktop Application', 
      created: '2023-07-20',
      modified: '2023-08-25',
      status: 'inactive'
    },
    { 
      id: 4, 
      title: 'Healthcare Portal', 
      author: 'Sarah Williams', 
      type: 'Web Application', 
      created: '2023-08-25',
      modified: '2023-09-30',
      status: 'active'
    }
  ];

  // Filter prompts based on search term
  const filteredPrompts = prompts.filter(prompt => 
    prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    prompt.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler for viewing a prompt
  const handleViewPrompt = (prompt: any) => {
    setSelectedPrompt(prompt);
    setIsViewDialogOpen(true);
  };

  // Handler for editing a prompt
  const handleEditPrompt = (prompt: any) => {
    setSelectedPrompt(prompt);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.promptManagement')}</h1>
          <p className="text-gray-500">
            {t('admin.prompts')}
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> {t('admin.createPrompt')}
        </Button>
      </div>

      <Tabs defaultValue="prompts" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="prompts">{t('admin.prompts')}</TabsTrigger>
          <TabsTrigger value="templates">{t('dashboard.templates')}</TabsTrigger>
          <TabsTrigger value="categories">{t('dashboard.categories')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prompts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t('admin.prompts')}</CardTitle>
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
                    <TableHead>{t('admin.type')}</TableHead>
                    <TableHead>{t('admin.author')}</TableHead>
                    <TableHead>{t('admin.status')}</TableHead>
                    <TableHead>{t('admin.modified')}</TableHead>
                    <TableHead className="text-right">{t('admin.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrompts.map(prompt => (
                    <TableRow key={prompt.id}>
                      <TableCell className="font-medium">{prompt.title}</TableCell>
                      <TableCell>{prompt.type}</TableCell>
                      <TableCell>{prompt.author}</TableCell>
                      <TableCell>
                        <Badge variant={prompt.status === 'active' ? 'success' : 'destructive'} className={prompt.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}>
                          {prompt.status === 'active' ? t('admin.active') : t('admin.inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell>{prompt.modified}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleViewPrompt(prompt)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleEditPrompt(prompt)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>{t('admin.confirmDelete')}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t('admin.deleteConfirmation')}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                                  {t('admin.deletePrompt')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.templates')}</CardTitle>
              <CardDescription>
                {t('dashboard.manageTemplates')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{t('dashboard.noTemplatesYet')}</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.categories')}</CardTitle>
              <CardDescription>
                {t('dashboard.manageCategories')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{t('dashboard.noCategoriesYet')}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Prompt Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedPrompt?.title}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">{t('admin.type')}</p>
                <p>{selectedPrompt?.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">{t('admin.author')}</p>
                <p>{selectedPrompt?.author}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">{t('admin.created')}</p>
                <p>{selectedPrompt?.created}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">{t('admin.modified')}</p>
                <p>{selectedPrompt?.modified}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              {t('admin.cancel')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Prompt Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.editPrompt')}: {selectedPrompt?.title}</DialogTitle>
          </DialogHeader>
          <PromptGeneratorWizard />
        </DialogContent>
      </Dialog>

      {/* Create Prompt Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('admin.createPrompt')}</DialogTitle>
          </DialogHeader>
          <PromptGeneratorWizard />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPrompts;
