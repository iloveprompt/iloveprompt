
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export type WizardItem = {
  id: number;
  key: string;
  active: boolean;
  translations: {
    en: string;
    pt: string;
  };
  [key: string]: any;
};

interface ItemManagerProps {
  title: string;
  items: WizardItem[];
  onAddItem?: (item: Partial<WizardItem>) => void;
  onUpdateItem?: (id: number, item: Partial<WizardItem>) => void;
  onDeleteItem?: (id: number) => void;
  additionalFields?: React.ReactNode;
}

const ItemManager: React.FC<ItemManagerProps> = ({
  title,
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  additionalFields
}) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Partial<WizardItem> | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<WizardItem>>({
    key: '',
    active: true,
    translations: {
      en: '',
      pt: ''
    }
  });

  // Filter items based on search term
  const filteredItems = items.filter(item => 
    item.translations[language].toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (item?: WizardItem) => {
    if (item) {
      setFormData({
        ...item
      });
      setIsEditing(true);
    } else {
      setFormData({
        key: '',
        active: true,
        translations: {
          en: '',
          pt: ''
        }
      });
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTranslationChange = (lang: 'en' | 'pt', value: string) => {
    setFormData(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [lang]: value
      }
    }));
  };

  const handleSave = () => {
    if (isEditing && formData.id !== undefined) {
      onUpdateItem?.(formData.id, formData);
      toast({
        title: t('dashboard.itemUpdated'),
        description: formData.translations[language]
      });
    } else {
      onAddItem?.(formData);
      toast({
        title: t('dashboard.itemSaved'),
        description: formData.translations[language]
      });
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    onDeleteItem?.(id);
    toast({
      title: t('dashboard.itemDeleted'),
      variant: "destructive"
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{title}</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder={t('dashboard.searchItems')}
              className="pl-8 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" /> {t('dashboard.addItem')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('dashboard.itemKey')}</TableHead>
              <TableHead>{t('dashboard.itemName')}</TableHead>
              <TableHead>{t('dashboard.itemStatus')}</TableHead>
              <TableHead className="text-right">{t('dashboard.itemActions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-sm">{item.key}</TableCell>
                  <TableCell>{item.translations[language]}</TableCell>
                  <TableCell>
                    {item.active ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                        {t('dashboard.active')}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">
                        {t('dashboard.inactive')}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleOpenDialog(item)}>
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
                            <AlertDialogTitle>{t('dashboard.confirmDelete')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('admin.deleteConfirmation')}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => handleDelete(item.id)}
                            >
                              {t('dashboard.deleteItem')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                  {t('dashboard.noItemsFound')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* Add/Edit Item Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? t('dashboard.editItem') : t('dashboard.addItem')}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="key" className="text-right">
                {t('dashboard.itemKey')}
              </Label>
              <Input
                id="key"
                value={formData.key}
                onChange={(e) => handleInputChange('key', e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <Tabs defaultValue="en" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="pt">Português</TabsTrigger>
              </TabsList>
              <div className="mt-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name-en" className="text-right">
                    {t('dashboard.itemNameEn')}
                  </Label>
                  <Input
                    id="name-en"
                    value={formData.translations?.en || ''}
                    onChange={(e) => handleTranslationChange('en', e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="mt-4 grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name-pt" className="text-right">
                    {t('dashboard.itemNamePt')}
                  </Label>
                  <Input
                    id="name-pt"
                    value={formData.translations?.pt || ''}
                    onChange={(e) => handleTranslationChange('pt', e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
            </Tabs>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                {t('dashboard.itemStatus')}
              </Label>
              <div className="flex items-center space-x-2 col-span-3">
                <Switch
                  id="status"
                  checked={formData.active}
                  onCheckedChange={(checked) => handleInputChange('active', checked)}
                />
                <Label htmlFor="status">
                  {formData.active ? t('dashboard.active') : t('dashboard.inactive')}
                </Label>
              </div>
            </div>

            {additionalFields}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              {t('dashboard.cancelEdit')}
            </Button>
            <Button onClick={handleSave}>
              {t('dashboard.saveItem')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ItemManager;
