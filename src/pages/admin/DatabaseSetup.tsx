
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { initializeDatabase } from '@/services/databaseInitializer';
import { createDatabaseStructure } from '@/services/createDatabaseStructure';
import { extractWizardData, migrateWizardData } from '@/services/migration/wizardMigrationData';
import { ArrowLeft, Database, ServerCog, Check, AlertTriangle, Loader2 } from 'lucide-react';

const DatabaseSetup: React.FC = () => {
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [structureStatus, setStructureStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [structureMessage, setStructureMessage] = useState('');
  const [migrationMessage, setMigrationMessage] = useState('');

  const handleCreateStructure = async () => {
    try {
      setStructureStatus('loading');
      const result = await createDatabaseStructure();
      
      if (result.success) {
        setStructureStatus('success');
        setStructureMessage(result.message);
        toast({
          title: 'Sucesso',
          description: result.message,
        });
      } else {
        setStructureStatus('error');
        setStructureMessage(result.message);
        toast({
          title: 'Erro',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      setStructureStatus('error');
      setStructureMessage('Erro ao criar estrutura do banco de dados.');
      toast({
        title: 'Erro',
        description: 'Erro ao criar estrutura do banco de dados.',
        variant: 'destructive',
      });
    }
  };

  const handleMigrateData = async () => {
    try {
      setMigrationStatus('loading');
      
      // Primeira tentativa de inicialização
      const initResult = await initializeDatabase();
      
      if (initResult.success) {
        setMigrationStatus('success');
        setMigrationMessage(initResult.message);
        toast({
          title: 'Sucesso',
          description: initResult.message,
        });
      } else {
        // Se falhar, tentar migração manual
        const data = extractWizardData();
        const migrationResult = await migrateWizardData(data);
        
        if (migrationResult.success) {
          setMigrationStatus('success');
          setMigrationMessage('Dados migrados com sucesso!');
          toast({
            title: 'Sucesso',
            description: 'Dados migrados com sucesso!',
          });
        } else {
          setMigrationStatus('error');
          setMigrationMessage('Erro ao migrar dados. Verifique a estrutura do banco de dados.');
          toast({
            title: 'Erro',
            description: 'Erro ao migrar dados. Verifique a estrutura do banco de dados.',
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      setMigrationStatus('error');
      setMigrationMessage('Erro ao migrar dados.');
      toast({
        title: 'Erro',
        description: 'Erro ao migrar dados.',
        variant: 'destructive',
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>
              Esta página é reservada para administradores.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Voltar
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Configuração do Banco de Dados
          </h1>
          <p className="text-muted-foreground">
            Inicialização e migração de dados para o Prompt Generator
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Estrutura do Banco de Dados
          </CardTitle>
          <CardDescription>
            Crie as tabelas necessárias para o funcionamento do Prompt Generator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            Este processo criará todas as tabelas necessárias no banco de dados, incluindo:
          </p>
          <ul className="list-disc pl-5 mb-4 text-sm space-y-1">
            <li>Tabela de prompts</li>
            <li>Tabelas para categorias do wizard</li>
            <li>Tabelas para itens, opções e exemplos</li>
            <li>Tabelas de traduções para internacionalização</li>
          </ul>
          {structureStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4 flex items-start">
              <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-green-700 text-sm">{structureMessage}</p>
            </div>
          )}
          {structureStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-red-700 text-sm">{structureMessage}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleCreateStructure}
            disabled={structureStatus === 'loading' || structureStatus === 'success'}
          >
            {structureStatus === 'loading' && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            {structureStatus === 'success' ? 'Estrutura Criada' : 'Criar Estrutura de Tabelas'}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ServerCog className="h-5 w-5 mr-2" />
            Migração de Dados
          </CardTitle>
          <CardDescription>
            Migre os dados existentes do sistema para o banco de dados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4">
            Este processo irá:
          </p>
          <ul className="list-disc pl-5 mb-4 text-sm space-y-1">
            <li>Extrair todos os dados existentes dos componentes</li>
            <li>Formatar os dados para o modelo do banco</li>
            <li>Inserir os dados nas tabelas correspondentes</li>
            <li>Configurar as relações entre os dados</li>
          </ul>
          {migrationStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4 flex items-start">
              <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-green-700 text-sm">{migrationMessage}</p>
            </div>
          )}
          {migrationStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4 flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-red-700 text-sm">{migrationMessage}</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleMigrateData}
            disabled={migrationStatus === 'loading' || migrationStatus === 'success' || structureStatus !== 'success'}
          >
            {migrationStatus === 'loading' && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            {migrationStatus === 'success' ? 'Dados Migrados' : 'Migrar Dados'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DatabaseSetup;
