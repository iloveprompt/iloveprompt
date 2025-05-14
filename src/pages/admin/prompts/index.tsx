import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Download, Target, Settings, Code, Layout, Shield, Scale, Ban, Link, Brain, Zap, Database, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Checkbox } from "@/components/ui/checkbox";
import { WizardItem } from '@/types/supabase';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Papa from 'papaparse';
import { saveAs } from 'file-saver';

// Importando os dados
import objectivesData from '@/pages/wizard/data/objectivesData.json';
import featuresData from '@/pages/wizard/data/featuresData.json';
import uxuiData from '@/pages/wizard/data/uxuiData.json';
import stackData from '@/pages/wizard/data/stackData.json';
import securityData from '@/pages/wizard/data/securityData.json';
import scalabilityData from '@/pages/wizard/data/scalabilityData.json';
import restrictionsData from '@/pages/wizard/data/restrictionsData.json';
import integrationsData from '@/pages/wizard/data/integrationsData.json';
import systemTypesData from '@/pages/wizard/data/systemTypesData.json';
import businessObjectivesData from '@/pages/wizard/data/businessObjectivesData.json';
import nonFunctionalRequirementsData from '@/pages/wizard/data/nonFunctionalRequirementsData.json';

const formSchema = z.object({
  id: z.string(),
  label: z.string().min(3, "Label deve ter no mínimo 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
  category: z.string().optional(),
  value: z.string().optional(),
  disabled: z.boolean().optional(),
});

const ITEMS_PER_PAGE = 10;

const tabStyles = {
  base: "flex flex-col items-center justify-center p-1 md:p-2 text-center text-xs md:text-sm h-full data-[state=active]:font-bold hover:bg-muted/50 rounded-md w-full",
  default: "text-muted-foreground",
  active: "text-primary font-bold",
  icon: "mb-1 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center border-2",
  wrapper: "relative flex w-full bg-white rounded-lg shadow-sm p-4",
  container: "flex-1 overflow-hidden mx-12 relative",
  scroll: "flex items-center gap-4 transition-transform duration-300 ease-out",
  navButton: "absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg hover:bg-gray-50 text-gray-600 z-10 border border-gray-200",
  connector: "flex-none self-center h-0.5 min-w-[24px] flex-grow bg-border",
  iconWrapper: "relative flex items-center justify-center min-w-[80px]"
};

const tabs = [
  { id: 'objetivos', label: 'Objetivos', icon: Target, data: objectivesData as WizardItem[] },
  { id: 'funcionalidades', label: 'Funcionalidades', icon: Settings, data: featuresData as WizardItem[] },
  { id: 'uxui', label: 'UX/UI', icon: Layout, data: uxuiData as WizardItem[] },
  { id: 'stack', label: 'Stack', icon: Code, data: stackData as WizardItem[] },
  { id: 'seguranca', label: 'Segurança', icon: Shield, data: securityData as WizardItem[] },
  { id: 'escalabilidade', label: 'Escalabilidade', icon: Scale, data: scalabilityData as WizardItem[] },
  { id: 'restricoes', label: 'Restrições', icon: Ban, data: restrictionsData as WizardItem[] },
  { id: 'integracoes', label: 'Integrações', icon: Link, data: integrationsData as WizardItem[] },
  { id: 'tipos_sistema', label: 'Tipos Sistema', icon: Database, data: systemTypesData as WizardItem[] },
  { id: 'objetivos_negocio', label: 'Obj. Negócio', icon: Brain, data: businessObjectivesData as WizardItem[] },
  { id: 'requisitos_nao_funcionais', label: 'Req. Não Func.', icon: Zap, data: nonFunctionalRequirementsData as WizardItem[] },
];

const WizardItems = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WizardItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'disabled'>('all');
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '',
      label: '',
      description: '',
      category: '',
      value: '',
      disabled: false,
    },
  });

  const currentTabData = tabs.find(tab => tab.id === activeTab)?.data || [];
  
  const filteredData = useMemo(() => {
    return currentTabData.filter(item => {
      const matchesSearch = item.label.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && !item.disabled) ||
        (statusFilter === 'disabled' && item.disabled);
      return matchesSearch && matchesStatus;
    });
  }, [currentTabData, searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleExport = async () => {
    try {
      setIsLoading(true);
      const dataToExport = currentTabData.map(item => ({
        id: item.id,
        label: item.label,
        description: item.description,
        status: item.disabled ? 'Inativo' : 'Ativo'
      }));
      
      const csv = Papa.unparse(dataToExport);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `prompts_${activeTab}_${new Date().toISOString()}.csv`);
      
      toast({
        title: "Sucesso!",
        description: "Dados exportados com sucesso",
        variant: "success"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível exportar os dados",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (item: WizardItem) => {
    setSelectedItem(item);
    form.reset(item);
    setIsEditDialogOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      // Aqui você implementaria a lógica para salvar as alterações
      console.log('Form submitted:', values);
      
      toast({
        title: "Sucesso!",
        description: "Item atualizado com sucesso",
        variant: "success"
      });
      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o item",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlide = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    const slideAmount = 200;
    const maxScroll = container.scrollWidth - container.clientWidth;

    console.log('scrollWidth:', container.scrollWidth, 'clientWidth:', container.clientWidth, 'maxScroll:', maxScroll, 'translateX:', translateX);

    let newTranslateX;
    if (direction === 'left') {
      newTranslateX = Math.min(0, translateX + slideAmount);
    } else {
      newTranslateX = Math.max(-maxScroll, translateX - slideAmount);
    }

    setTranslateX(newTranslateX);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const maxScroll = container.scrollWidth - container.clientWidth;
    setCanScrollLeft(translateX < 0);
    setCanScrollRight(translateX > -maxScroll);
  }, [translateX]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const maxScroll = container.scrollWidth - container.clientWidth;
    setCanScrollLeft(translateX < 0);
    setCanScrollRight(translateX > -maxScroll);
  }, [tabs, activeTab]);

  // Função para limpar props inválidas
  const cleanProps = (props: any) => {
    const { 'data-lov-id': _, ...cleanedProps } = props;
    return cleanedProps;
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold">Itens do Wizard</h1>
          <p className="text-muted-foreground">Gerenciar itens do wizard gerador de prompts</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Buscar itens..." 
                className="pl-9 w-[280px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select 
              value={statusFilter} 
              onValueChange={(value: 'all' | 'active' | 'disabled') => setStatusFilter(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="disabled">Inativos</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleExport}
            disabled={isLoading}
            aria-label="Exportar dados"
          >
            <Download className="w-4 h-4 mr-2" aria-hidden="true" />
            Exportar
          </Button>
          <Button
            onClick={() => setIsEditDialogOpen(true)}
            disabled={isLoading}
            aria-label="Criar novo item"
          >
            <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
            Novo Item
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 bg-white rounded-lg shadow-sm p-4">
          {tabs.map((tab) => (
            <div key={tab.id} className="flex flex-col items-center group">
              <button
                onClick={() => {
                  setActiveTab(tab.id);
                  setCurrentPage(1);
                }}
                className={`flex flex-col items-center justify-center p-2 text-center text-xs md:text-sm h-full font-medium hover:bg-muted/50 rounded-md w-full ${activeTab === tab.id ? 'bg-primary text-white' : 'text-muted-foreground'}`}
              >
                <div className={`mb-1 w-7 h-7 rounded-full flex items-center justify-center border-2 ${activeTab === tab.id ? 'border-primary bg-primary text-white' : 'border-border bg-background text-muted-foreground'}`}>
                  <tab.icon className="w-4 h-4" />
                </div>
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      <div className="mt-6">
        <Collapsible
          open={isStatsOpen}
          onOpenChange={setIsStatsOpen}
          className="mb-6"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center justify-between w-full p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Visão Geral</h3>
                <p className="text-muted-foreground">Estatísticas dos itens</p>
              </div>
              {isStatsOpen ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Visão Geral</CardTitle>
                  <CardDescription>Estatísticas dos itens</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Total de itens</span>
                      <Badge>{currentTabData.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Ativos</span>
                      <Badge variant="success">{currentTabData.filter(item => !item.disabled).length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.label}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <Badge variant={item.disabled ? "secondary" : "success"}>
                      {item.disabled ? "Inativo" : "Ativo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                      Editar
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      Remover
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Paginação */}
          <div className="flex items-center justify-between px-4 py-3 border-t">
            <div className="text-sm text-muted-foreground">
              Mostrando {startIndex + 1} até {Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length)} de {filteredData.length} itens
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
              >
                Próxima
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedItem ? 'Editar Item' : 'Novo Item'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Label</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        disabled={isLoading}
                        aria-label="Label do item"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        disabled={isLoading}
                        aria-label="Descrição do item"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="disabled"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                        aria-label="Status do item"
                      />
                    </FormControl>
                    <FormLabel>Inativo</FormLabel>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : 'Salvar'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WizardItems; 