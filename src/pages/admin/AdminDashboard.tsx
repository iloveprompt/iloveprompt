import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import DocumentTemplatesManager from '@/components/admin/DocumentTemplatesManager';

export default function AdminDashboard() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Gestão de Templates de Documentação</CardTitle>
      </CardHeader>
      <CardContent>
        <DocumentTemplatesManager />
      </CardContent>
    </Card>
  );
} 