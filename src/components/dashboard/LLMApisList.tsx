import { useLLMApis } from '@/hooks/useLLMApis';
import { useLanguage } from '@/i18n/LanguageContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

export const LLMApisList = () => {
  const { apis, loading, error, refreshApis } = useLLMApis();
  const { t } = useLanguage();

  console.log('LLMApisList render - APIs:', apis, 'Loading:', loading, 'Error:', error); // Debug log

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (error) {
    console.error('LLMApisList error:', error); // Debug log
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {t('errors.title')}
          </CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => refreshApis()} variant="outline">
            {t('actions.tryAgain')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!apis || apis.length === 0) {
    console.log('LLMApisList - No APIs found'); // Debug log
    return (
      <Card className="border-muted">
        <CardHeader>
          <CardTitle>{t('dashboard.noApisTitle')}</CardTitle>
          <CardDescription>{t('dashboard.noApisDesc')}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  console.log('LLMApisList - Rendering APIs list:', apis); // Debug log

  const getStatusIcon = (status: 'untested' | 'success' | 'failure') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failure':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusText = (status: 'untested' | 'success' | 'failure') => {
    switch (status) {
      case 'success':
        return t('status.success');
      case 'failure':
        return t('status.failure');
      default:
        return t('status.untested');
    }
  };

  return (
    <div className="space-y-4">
      {apis.map((api) => (
        <Card key={api.id} className={api.is_active ? 'border-primary/50' : 'border-muted'}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="capitalize">{api.provider}</CardTitle>
                <Badge variant={api.is_active ? 'default' : 'secondary'}>
                  {api.is_active ? t('status.active') : t('status.inactive')}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(api.test_status)}
                <span className="text-sm text-muted-foreground">
                  {getStatusText(api.test_status)}
                </span>
              </div>
            </div>
            <CardDescription>
              {api.models?.length
                ? t('dashboard.apiModels', { count: api.models.length })
                : t('dashboard.noModels')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {t('dashboard.lastTested')}:{' '}
                  {api.last_tested_at
                    ? new Date(api.last_tested_at).toLocaleDateString()
                    : t('dashboard.never')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/settings'}>
                  {t('actions.manage')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 