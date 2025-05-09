
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/i18n/LanguageContext';
import { Search, FileText, Copy, Star, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const History = () => {
  const { t } = useLanguage();
  
  // Mock prompts history data
  const promptHistory = [
    {
      id: '1',
      title: 'E-commerce Product Description',
      createdAt: new Date('2025-05-08T14:30:00'),
      category: 'Marketing',
      starred: true
    },
    {
      id: '2',
      title: 'Blog Post Draft',
      createdAt: new Date('2025-05-07T10:15:00'),
      category: 'Content',
      starred: false
    },
    {
      id: '3',
      title: 'Email Campaign',
      createdAt: new Date('2025-05-05T16:45:00'),
      category: 'Marketing',
      starred: true
    },
    {
      id: '4',
      title: 'Technical Documentation',
      createdAt: new Date('2025-05-03T09:20:00'),
      category: 'Documentation',
      starred: false
    },
    {
      id: '5',
      title: 'Social Media Post',
      createdAt: new Date('2025-04-30T13:10:00'),
      category: 'Marketing',
      starred: false
    }
  ];

  // Format date helper function
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">{t('history.title')}</h1>
        
        <Button variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          {t('history.exportHistory')}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>{t('history.promptHistory')}</CardTitle>
              <CardDescription>{t('history.viewPastPrompts')}</CardDescription>
            </div>
            
            <div className="w-full sm:w-auto flex gap-2">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  type="search" 
                  placeholder={t('history.searchPrompts')} 
                  className="pl-9 w-full sm:w-[200px] lg:w-[300px]" 
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">{t('history.filter')}</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>{t('history.allPrompts')}</DropdownMenuItem>
                  <DropdownMenuItem>{t('history.starredOnly')}</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>{t('history.marketing')}</DropdownMenuItem>
                  <DropdownMenuItem>{t('history.content')}</DropdownMenuItem>
                  <DropdownMenuItem>{t('history.documentation')}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {promptHistory.map((prompt) => (
              <div key={prompt.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="mb-2 sm:mb-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{prompt.title}</h3>
                    {prompt.starred && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-sm text-gray-500">{formatDate(prompt.createdAt)}</span>
                    <Badge variant="outline">{prompt.category}</Badge>
                  </div>
                </div>
                
                <div className="flex space-x-2 w-full sm:w-auto">
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4 mr-1" />
                    {t('history.copy')}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4 mr-1" />
                    {t('history.edit')}
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-1" />
                    {t('history.delete')}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-6">
            <Button variant="outline">{t('history.loadMore')}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
