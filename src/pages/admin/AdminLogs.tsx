
import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Download, RefreshCcw } from 'lucide-react';

const AdminLogs = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [logType, setLogType] = useState('all');

  // Mock data for logs
  const logs = [
    {
      id: 1,
      timestamp: '2023-10-01 08:15:23',
      type: 'info',
      user: 'john.doe@example.com',
      action: 'User login',
      details: 'Successful login from IP 192.168.1.1'
    },
    {
      id: 2,
      timestamp: '2023-10-01 09:23:45',
      type: 'warning',
      user: 'jane.smith@example.com',
      action: 'Failed login attempt',
      details: 'Multiple failed attempts from IP 192.168.1.2'
    },
    {
      id: 3,
      timestamp: '2023-10-01 10:34:12',
      type: 'error',
      user: 'system',
      action: 'Database error',
      details: 'Connection timeout on query execution'
    },
    {
      id: 4,
      timestamp: '2023-10-01 11:42:56',
      type: 'info',
      user: 'robert.johnson@example.com',
      action: 'Prompt created',
      details: 'New prompt "E-commerce Website" created'
    },
    {
      id: 5,
      timestamp: '2023-10-01 12:50:37',
      type: 'info',
      user: 'ander_dorneles@hotmail.com',
      action: 'Settings updated',
      details: 'System settings changed by administrator'
    }
  ];

  // Filter logs based on search term and log type
  const filteredLogs = logs.filter(log => 
    (log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
     log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
     log.details.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (logType === 'all' || log.type === logType)
  );

  const getLogTypeBadge = (type: string) => {
    switch(type) {
      case 'info':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Info</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Error</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('admin.systemLogs')}</h1>
          <p className="text-gray-500">
            {t('admin.logs')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> {t('dashboard.exportLogs')}
          </Button>
          <Button variant="outline">
            <RefreshCcw className="mr-2 h-4 w-4" /> {t('dashboard.refresh')}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <CardTitle>{t('admin.logs')}</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder={t('admin.search')}
                  className="pl-8 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={logType} onValueChange={setLogType}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder={t('admin.filter')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('dashboard.allTypes')}</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('dashboard.timestamp')}</TableHead>
                <TableHead>{t('admin.type')}</TableHead>
                <TableHead>{t('admin.user')}</TableHead>
                <TableHead>{t('dashboard.action')}</TableHead>
                <TableHead>{t('dashboard.details')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                  <TableCell>{getLogTypeBadge(log.type)}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell className="max-w-md truncate">{log.details}</TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                    {t('dashboard.noLogsFound')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogs;
