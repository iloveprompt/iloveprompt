
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/i18n/LanguageContext';
import {
  fetchDocumentTemplates,
  createDocumentTemplate,
  updateDocumentTemplate,
  deleteDocumentTemplate,
  setDefaultDocumentTemplate,
  DocumentType,
  DocumentTemplate,
  NewDocumentTemplate
} from '@/services/documentationService';

const DOCUMENT_TYPES: DocumentType[] = ['prd', 'readme', 'roadmap', 'phases', 'flow'];

const DocumentTemplatesManager: React.FC<{ userId?: string }> = ({ userId }) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [type, setType] = useState<DocumentType>('prd');
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [editing, setEditing] = useState<DocumentTemplate | null>(null);
  const [newTemplate, setNewTemplate] = useState<Partial<NewDocumentTemplate>>({ type: 'prd', name: '', content: '' });
  const [loading, setLoading] = useState(false);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await fetchDocumentTemplates(type, userId);
      setTemplates(data);
    } catch (err: any) {
      toast({ title: t('documentTemplatesManager.errorFetch'), description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadTemplates(); /* eslint-disable-next-line */ }, [type, userId]);

  const handleCreate = async () => {
    if (!newTemplate.name || !newTemplate.content) return;
    setLoading(true);
    try {
      await createDocumentTemplate({
        ...newTemplate,
        type,
        user_id: userId || null,
        is_default: false
      } as NewDocumentTemplate);
      setNewTemplate({ type, name: '', content: '' });
      loadTemplates();
      toast({ title: t('documentTemplatesManager.created'), variant: 'default' });
    } catch (err: any) {
      toast({ title: t('documentTemplatesManager.errorCreate'), description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editing) return;
    setLoading(true);
    try {
      await updateDocumentTemplate(editing.id, editing);
      setEditing(null);
      loadTemplates();
      toast({ title: t('documentTemplatesManager.updated'), variant: 'default' });
    } catch (err: any) {
      toast({ title: t('documentTemplatesManager.errorUpdate'), description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteDocumentTemplate(id);
      loadTemplates();
      toast({ title: t('documentTemplatesManager.deleted'), variant: 'default' });
    } catch (err: any) {
      toast({ title: t('documentTemplatesManager.errorDelete'), description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    setLoading(true);
    try {
      await setDefaultDocumentTemplate(id, type, userId);
      loadTemplates();
      toast({ title: t('documentTemplatesManager.setDefault'), variant: 'default' });
    } catch (err: any) {
      toast({ title: t('documentTemplatesManager.errorSetDefault'), description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('documentTemplatesManager.title')}</CardTitle>
        <div className="flex gap-2 mt-2">
          {DOCUMENT_TYPES.map((tType) => (
            <Button key={tType} variant={type === tType ? 'default' : 'outline'} onClick={() => setType(tType)} size="sm">{t(`documentTemplatesManager.type.${tType}`)}</Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="font-semibold mb-2">{t('documentTemplatesManager.newTemplate')}</h4>
          <Input
            placeholder={t('documentTemplatesManager.namePlaceholder')}
            value={newTemplate.name || ''}
            onChange={e => setNewTemplate(nt => ({ ...nt, name: e.target.value }))}
            className="mb-2"
          />
          <Textarea
            placeholder={t('documentTemplatesManager.contentPlaceholder')}
            value={newTemplate.content || ''}
            onChange={e => setNewTemplate(nt => ({ ...nt, content: e.target.value }))}
            rows={6}
          />
          <Button onClick={handleCreate} className="mt-2" size="sm" disabled={loading}>{t('documentTemplatesManager.create')}</Button>
        </div>
        <div>
          <h4 className="font-semibold mb-2">{t('documentTemplatesManager.existingTemplates')}</h4>
          {templates.map(tpl => (
            <div key={tpl.id} className={`border rounded p-2 mb-2 ${tpl.is_default ? 'border-blue-500' : ''}`}>
              {editing && editing.id === tpl.id ? (
                <>
                  <Input
                    value={editing.name}
                    onChange={e => setEditing(ed => ed ? { ...ed, name: e.target.value } : ed)}
                    className="mb-1"
                  />
                  <Textarea
                    value={editing.content}
                    onChange={e => setEditing(ed => ed ? { ...ed, content: e.target.value } : ed)}
                    rows={4}
                  />
                  <Button onClick={handleUpdate} size="sm" className="mr-2" disabled={loading}>{t('documentTemplatesManager.save')}</Button>
                  <Button onClick={() => setEditing(null)} size="sm" variant="outline">{t('documentTemplatesManager.cancel')}</Button>
                </>
              ) : (
                <>
                  <div className="font-semibold">{tpl.name} {tpl.is_default && <span className="text-blue-500">({t('documentTemplatesManager.default')})</span>}</div>
                  <pre className="text-xs bg-muted/50 p-1 rounded mb-1 whitespace-pre-wrap">{tpl.content}</pre>
                  <Button onClick={() => setEditing(tpl)} size="sm" className="mr-2">{t('documentTemplatesManager.edit')}</Button>
                  <Button onClick={() => handleDelete(tpl.id)} size="sm" variant="destructive" className="mr-2">{t('documentTemplatesManager.delete')}</Button>
                  {!tpl.is_default && <Button onClick={() => handleSetDefault(tpl.id)} size="sm" variant="secondary">{t('documentTemplatesManager.setDefaultBtn')}</Button>}
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentTemplatesManager; 
