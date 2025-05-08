
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent
} from "@/components/ui/collapsible";
import { Check, Copy, ChevronDown, ChevronUp, Edit, Info } from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "@/hooks/use-toast";
import { ScrollToTopOnMount } from '@/components/ScrollToTopOnMount';

// System types
const systemTypes = [
  { id: 'microsaas', label: 'MicroSaaS' },
  { id: 'saas', label: 'SaaS' },
  { id: 'erp', label: 'ERP (Enterprise Resource Planning)' },
  { id: 'crm', label: 'CRM (Customer Relationship Management)' },
  { id: 'ecommerce', label: 'Plataforma de E-commerce' },
  { id: 'cms', label: 'CMS (Gerenciador de Conteúdo)' },
  { id: 'api', label: 'API Backend' },
  { id: 'mobile', label: 'Aplicativo Mobile' },
  { id: 'scheduling', label: 'Sistema de Agendamento' },
  { id: 'helpdesk', label: 'Sistema de Suporte/Helpdesk' },
  { id: 'educational', label: 'Plataforma Educacional' },
  { id: 'streaming', label: 'Plataforma de Streaming' },
  { id: 'other', label: 'Outro (Especificar)' }
];

// Project objective suggestions
const objectiveSuggestions = [
  'Sistema de login com redes sociais',
  'Plataforma com landing page e dashboard',
  'Aplicativo com notificações push e modo offline',
  'Backend com autenticação JWT',
  'Ferramenta de agendamento com lembretes',
  'Plataforma de assinatura recorrente',
  'Sistema com dashboards interativos'
];

// Features by system type
const featuresBySystemType = {
  'ecommerce': [
    { id: 'checkout', label: 'Checkout personalizado' },
    { id: 'payments', label: 'Integração com gateways de pagamento' },
    { id: 'inventory', label: 'Gerenciamento de estoque' },
    { id: 'shipping', label: 'Cálculo automático de frete' },
    { id: 'abandoned', label: 'Recuperação de carrinho abandonado' },
    { id: 'promotions', label: 'Cupons e promoções' }
  ],
  'api': [
    { id: 'jwt', label: 'Autenticação JWT ou OAuth2' },
    { id: 'multitenancy', label: 'Multi-tenancy' },
    { id: 'docs', label: 'Documentação automática (Swagger/OpenAPI)' },
    { id: 'versioning', label: 'Versionamento de API' },
    { id: 'webhooks', label: 'Webhooks e eventos' }
  ],
  'crm': [
    { id: 'pipeline', label: 'Pipeline de vendas' },
    { id: 'segmentation', label: 'Segmentação de clientes' },
    { id: 'integration', label: 'Integração com e-mail e WhatsApp' },
    { id: 'dashboard', label: 'Dashboard de performance' },
    { id: 'tasks', label: 'Sistema de tarefas e lembretes' }
  ],
  'microsaas': [
    { id: 'subscription', label: 'Sistema de assinaturas' },
    { id: 'integration', label: 'Integração com APIs' },
    { id: 'analytics', label: 'Analytics customizados' },
    { id: 'onboarding', label: 'Processo de onboarding' },
    { id: 'saas-dashboard', label: 'Dashboard de métricas SaaS' }
  ],
  'saas': [
    { id: 'multitenancy', label: 'Multi-tenancy' },
    { id: 'billing', label: 'Sistema de cobrança complexo' },
    { id: 'teams', label: 'Gerenciamento de equipes' },
    { id: 'api', label: 'API para desenvolvedores' },
    { id: 'white-label', label: 'Opções de white-label' },
    { id: 'sso', label: 'SSO e autenticação empresarial' }
  ],
  'erp': [
    { id: 'financials', label: 'Controle financeiro completo' },
    { id: 'inventory', label: 'Gestão de estoque e compras' },
    { id: 'hr', label: 'Módulo de RH e folha de pagamento' },
    { id: 'crm-module', label: 'Módulo CRM integrado' },
    { id: 'reports', label: 'Relatórios gerenciais avançados' },
    { id: 'workflows', label: 'Automação de workflows' }
  ],
  'cms': [
    { id: 'wysiwyg', label: 'Editor WYSIWYG avançado' },
    { id: 'media', label: 'Biblioteca de mídia' },
    { id: 'versions', label: 'Versionamento de conteúdo' },
    { id: 'workflow', label: 'Workflow de aprovação' },
    { id: 'seo', label: 'Ferramentas de SEO integradas' }
  ],
  'mobile': [
    { id: 'push', label: 'Notificações push' },
    { id: 'offline', label: 'Modo offline' },
    { id: 'native', label: 'Acesso a recursos nativos' },
    { id: 'biometric', label: 'Autenticação biométrica' },
    { id: 'app-store', label: 'Preparação para app stores' }
  ],
  'scheduling': [
    { id: 'calendar', label: 'Visualização de calendário' },
    { id: 'bookings', label: 'Sistema de reservas' },
    { id: 'reminders', label: 'Lembretes automáticos' },
    { id: 'availability', label: 'Configuração de disponibilidade' },
    { id: 'resources', label: 'Alocação de recursos' }
  ],
  'helpdesk': [
    { id: 'tickets', label: 'Sistema de tickets' },
    { id: 'knowledge', label: 'Base de conhecimento' },
    { id: 'chat', label: 'Chat ao vivo' },
    { id: 'satisfaction', label: 'Pesquisa de satisfação' },
    { id: 'sla', label: 'SLAs e métricas de atendimento' }
  ],
  'educational': [
    { id: 'courses', label: 'Gestão de cursos' },
    { id: 'progress', label: 'Acompanhamento de progresso' },
    { id: 'quizzes', label: 'Quizzes e avaliações' },
    { id: 'certificates', label: 'Emissão de certificados' },
    { id: 'forums', label: 'Fóruns de discussão' }
  ],
  'streaming': [
    { id: 'video-player', label: 'Player de vídeo customizável' },
    { id: 'transcoding', label: 'Transcodificação de vídeo' },
    { id: 'recommendations', label: 'Sistema de recomendações' },
    { id: 'drm', label: 'Proteção de conteúdo (DRM)' },
    { id: 'analytics', label: 'Analytics de visualização' }
  ],
  'other': []
};

// Common features
const commonFeatures = [
  { id: 'upload', label: 'Upload de arquivos e imagens' },
  { id: 'notifications', label: 'Notificações: Push | Email | SMS' },
  { id: 'search', label: 'Filtros avançados + busca com autocomplete' },
  { id: 'dashboard', label: 'Dashboards com gráficos interativos' },
  { id: 'scheduling', label: 'Agendamentos e lembretes automáticos' },
  { id: 'export', label: 'Exportação: CSV | PDF | Excel' },
  { id: 'roles', label: 'Controle de permissões por papéis' },
  { id: 'api-integration', label: 'Integração com APIs externas' },
  { id: 'multilanguage', label: 'Suporte a múltiplos idiomas' },
  { id: 'accessibility', label: 'Acessibilidade (WCAG)' },
  { id: 'theme', label: 'Tema escuro/claro' },
  { id: 'landing', label: 'Landing page customizável' },
  { id: 'other-feature', label: 'Outro (Especificar)' }
];

// Color palettes with preview
const colorPalettes = [
  { id: 'blue', label: 'Azul', value: '#0057D9' },
  { id: 'green', label: 'Verde', value: '#28A745' },
  { id: 'red', label: 'Vermelho', value: '#DC3545' },
  { id: 'purple', label: 'Roxo', value: '#6F42C1' },
  { id: 'orange', label: 'Laranja', value: '#FD7E14' },
  { id: 'black', label: 'Preto', value: '#000000' },
  { id: 'white', label: 'Branco', value: '#FFFFFF' },
  { id: 'gray', label: 'Cinza', value: '#6C757D' },
  { id: 'custom', label: 'Personalizada', value: '' }
];

// Visual styles
const visualStyles = [
  { id: 'minimalist', label: 'Minimalista' },
  { id: 'modern', label: 'Moderna com sombras' },
  { id: 'material', label: 'Flat/Material Design' },
  { id: 'ios', label: 'Inspirada em iOS' },
  { id: 'android', label: 'Inspirada em Android' },
  { id: 'other-style', label: 'Outro (Especificar)' }
];

// Menu types
const menuTypes = [
  { id: 'top-fixed', label: 'Superior fixo' },
  { id: 'side-fixed', label: 'Lateral fixo' },
  { id: 'hamburger', label: 'Menu hamburguer (mobile)' },
  { id: 'tabs', label: 'Abas horizontais' },
  { id: 'custom-menu', label: 'Personalizado' },
  { id: 'other-menu', label: 'Outro (Especificar)' }
];

// Landing page options
const landingPageOptions = {
  structure: [
    { id: 'hero', label: 'Hero' },
    { id: 'benefits', label: 'Benefícios' },
    { id: 'testimonials', label: 'Depoimentos' },
    { id: 'cta', label: 'CTA' }
  ],
  elements: [
    { id: 'video', label: 'Vídeo' },
    { id: 'form', label: 'Formulário' },
    { id: 'animations', label: 'Animações' }
  ],
  style: [
    { id: 'modern', label: 'Moderno' },
    { id: 'minimalist', label: 'Minimalista' },
    { id: 'corporate', label: 'Corporativo' },
    { id: 'creative', label: 'Criativo' },
    { id: 'other-landing-style', label: 'Outro (Especificar)' }
  ]
};

// Authentication options
const authOptions = [
  { id: 'email', label: 'Email + Senha' },
  { id: 'google', label: 'Google' },
  { id: 'facebook', label: 'Facebook' },
  { id: 'github', label: 'GitHub' },
  { id: 'apple', label: 'Apple' },
  { id: '2fa', label: 'Autenticação em 2 etapas (2FA)' },
  { id: 'other-auth', label: 'Outro (Especificar)' }
];

// Dashboard options
const dashboardOptions = [
  { id: 'customizable', label: 'Personalizável' },
  { id: 'charts', label: 'Gráficos e estatísticas' },
  { id: 'history', label: 'Histórico de atividades' },
  { id: 'theme', label: 'Tema claro/escuro e responsivo' },
  { id: 'other-dashboard', label: 'Outro (Especificar)' }
];

// Tech stack options
const techStackOptions = {
  frontend: [
    { id: 'react', label: 'React' },
    { id: 'vue', label: 'Vue' },
    { id: 'angular', label: 'Angular' },
    { id: 'svelte', label: 'Svelte' },
    { id: 'nextjs', label: 'Next.js' },
    { id: 'nuxtjs', label: 'Nuxt.js' },
    { id: 'other-frontend', label: 'Outro (Especificar)' }
  ],
  backend: [
    { id: 'nodejs', label: 'Node.js' },
    { id: 'django', label: 'Django' },
    { id: 'fastapi', label: 'FastAPI' },
    { id: 'spring', label: 'Spring' },
    { id: 'laravel', label: 'Laravel' },
    { id: 'rails', label: 'Ruby on Rails' },
    { id: 'other-backend', label: 'Outro (Especificar)' }
  ],
  fullstack: [
    { id: 'nextjs', label: 'Next.js' },
    { id: 'nuxtjs', label: 'Nuxt.js' },
    { id: 'meteor', label: 'Meteor' },
    { id: 'remix', label: 'Remix' },
    { id: 'other-fullstack', label: 'Outro (Especificar)' }
  ],
  database: [
    { id: 'postgresql', label: 'PostgreSQL' },
    { id: 'mysql', label: 'MySQL' },
    { id: 'mongodb', label: 'MongoDB' },
    { id: 'firebase', label: 'Firebase' },
    { id: 'supabase', label: 'Supabase' },
    { id: 'redis', label: 'Redis' },
    { id: 'other-database', label: 'Outro (Especificar)' }
  ],
  orm: [
    { id: 'prisma', label: 'Prisma' },
    { id: 'sequelize', label: 'Sequelize' },
    { id: 'typeorm', label: 'TypeORM' },
    { id: 'mongoose', label: 'Mongoose' },
    { id: 'django-orm', label: 'Django ORM' },
    { id: 'sqlalchemy', label: 'SQLAlchemy' },
    { id: 'other-orm', label: 'Outro (Especificar)' }
  ],
  deployment: [
    { id: 'vercel', label: 'Vercel' },
    { id: 'netlify', label: 'Netlify' },
    { id: 'heroku', label: 'Heroku' },
    { id: 'railway', label: 'Railway' },
    { id: 'aws', label: 'AWS' },
    { id: 'gcp', label: 'Google Cloud' },
    { id: 'digitalocean', label: 'DigitalOcean' },
    { id: 'docker', label: 'Docker / Kubernetes' },
    { id: 'other-deployment', label: 'Outro (Especificar)' }
  ]
};

// Security options
const securityOptions = [
  { id: 'protection', label: 'Proteção contra SQL Injection, XSS, CSRF' },
  { id: 'auth', label: 'Autenticação: JWT, OAuth2, 2FA' },
  { id: 'https', label: 'HTTPS (SSL/TLS), CSP, Helmet.js' },
  { id: 'logs', label: 'Logs de auditoria, Rate limiting' },
  { id: 'api-security', label: 'Segurança para APIs públicas/privadas' },
  { id: 'other-security', label: 'Outro (Especificar)' }
];

// Code structure options
const codeStructureOptions = {
  folders: [
    { id: 'by-function', label: 'Por função (controllers/models/services)' },
    { id: 'by-domain', label: 'Por domínio (feature-based)' },
    { id: 'front-back', label: 'Separação front/back' },
    { id: 'modular', label: 'Modular com injeção de dependência' },
    { id: 'other-folders', label: 'Outro (Especificar)' }
  ],
  architecture: [
    { id: 'mvc', label: 'MVC' },
    { id: 'mvvm', label: 'MVVM' },
    { id: 'clean', label: 'Clean Architecture' },
    { id: 'ddd', label: 'DDD' },
    { id: 'hexagonal', label: 'Hexagonal' },
    { id: 'other-arch', label: 'Outro (Especificar)' }
  ],
  bestPractices: [
    { id: 'stateless', label: 'Stateless' },
    { id: 'low-coupling', label: 'Baixo acoplamento' },
    { id: 'tests', label: 'Testes: Unitários | Integração | E2E' },
    { id: 'components', label: 'Componentes reutilizáveis com interface única' },
    { id: 'other-practices', label: 'Outro (Especificar)' }
  ]
};

// Scalability options
const scalabilityOptions = [
  { id: 'redis', label: 'Redis, CDN, Load Balancer' },
  { id: 'cache', label: 'Cache dinâmico, Filas (RabbitMQ, Kafka)' },
  { id: 'auto-scaling', label: 'Auto Scaling, Monitoramento, Alta disponibilidade' },
  { id: 'other-scalability', label: 'Outro (Especificar)' }
];

// Performance options
const performanceOptions = [
  { id: 'lazy', label: 'Lazy loading, Code splitting' },
  { id: 'minify', label: 'Minificação, Gzip/Brotli' },
  { id: 'ssr', label: 'SSR/SSG (Next.js/Nuxt.js)' },
  { id: 'optimize', label: 'Otimização de imagens e JS/CSS' },
  { id: 'other-perf', label: 'Outro (Especificar)' }
];

// Code restrictions
const codeRestrictionsOptions = [
  { id: 'eval', label: 'eval()' },
  { id: 'global-vars', label: 'Variáveis globais' },
  { id: 'callback-hell', label: 'Callback Hell' },
  { id: 'unmaintained', label: 'Bibliotecas sem manutenção' },
  { id: 'important', label: 'Uso excessivo de !important' },
  { id: 'paid-deps', label: 'Dependências pagas/proprietárias' },
  { id: 'other-restriction', label: 'Outro (Especificar)' }
];

type PromptFormValues = {
  // System Type
  systemType: string;
  otherSystemType?: string;
  
  // Objectives
  projectObjective: string;
  commonFeatures: string[];
  otherCommonFeature?: string;
  dynamicFeatures: string[];
  otherDynamicFeature?: string;
  
  // UX/UI
  colorPalette: string[];
  customColor?: string;
  visualStyle: string;
  otherVisualStyle?: string;
  menuType: string;
  otherMenuType?: string;
  
  // Landing
  hasLandingPage: boolean;
  landingStructure?: string[];
  landingElements?: string[];
  landingStyle?: string;
  otherLandingStyle?: string;
  
  // Authentication
  authOptions: string[];
  otherAuthOption?: string;
  
  // Dashboard
  hasDashboard: boolean;
  dashboardOptions?: string[];
  otherDashboardOption?: string;
  
  // Tech Stack
  separateBackend: boolean;
  frontend?: string[];
  otherFrontend?: string;
  backend?: string[];
  otherBackend?: string;
  fullstack?: string;
  otherFullstack?: string;
  database: string;
  otherDatabase?: string;
  orm: string[];
  otherOrm?: string;
  deployment: string;
  otherDeployment?: string;
  
  // Security
  securityOptions: string[];
  otherSecurityOption?: string;
  
  // Code Structure
  folderStructure: string[];
  otherFolderStructure?: string;
  architecture: string[];
  otherArchitecture?: string;
  bestPractices: string[];
  otherBestPractice?: string;
  
  // Scalability
  needsScalability: boolean;
  scalabilityOptions?: string[];
  otherScalabilityOption?: string;
  
  // Performance
  performanceOptions: string[];
  otherPerformanceOption?: string;
  
  // Code Restrictions
  codeRestrictions: string[];
  otherCodeRestriction?: string;
};

const PromptGenerator = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("system-type");
  const [promptGenerated, setPromptGenerated] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [promptHistory, setPromptHistory] = useState<Array<{
    id: string;
    title: string;
    systemType: string;
    createdAt: Date;
    prompt: string;
  }>>([]);
  const [copied, setCopied] = useState(false);

  const form = useForm<PromptFormValues>({
    defaultValues: {
      systemType: '',
      projectObjective: '',
      commonFeatures: [],
      dynamicFeatures: [],
      colorPalette: [],
      visualStyle: '',
      menuType: '',
      hasLandingPage: false,
      authOptions: [],
      hasDashboard: false,
      separateBackend: true,
      frontend: [],
      backend: [],
      database: '',
      orm: [],
      deployment: '',
      securityOptions: [],
      folderStructure: [],
      architecture: [],
      bestPractices: [],
      needsScalability: false,
      performanceOptions: [],
      codeRestrictions: []
    }
  });
  
  const watchSystemType = form.watch('systemType');
  const watchHasLanding = form.watch('hasLandingPage');
  const watchHasDashboard = form.watch('hasDashboard');
  const watchSeparateBackend = form.watch('separateBackend');
  const watchNeedsScalability = form.watch('needsScalability');
  
  const onSubmit = (data: PromptFormValues) => {
    console.log("Form data:", data);
    
    // Generate prompt based on form data
    const prompt = generatePrompt(data);
    setGeneratedPrompt(prompt);
    setPromptGenerated(true);
    
    // Save to history if user is logged in
    if (user) {
      const newPromptItem = {
        id: Date.now().toString(),
        title: data.projectObjective.substring(0, 50) + (data.projectObjective.length > 50 ? '...' : ''),
        systemType: data.systemType === 'other' ? (data.otherSystemType || 'Outro') : 
          systemTypes.find(type => type.id === data.systemType)?.label || data.systemType,
        createdAt: new Date(),
        prompt: prompt
      };
      
      setPromptHistory(prev => [newPromptItem, ...prev]);
      
      toast({
        title: "Prompt salvo no histórico",
        description: "Você pode acessá-lo na aba de histórico.",
      });
    }
  };
  
  const generatePrompt = (data: PromptFormValues) => {
    let prompt = `# Requisição para Desenvolvimento de Sistema\n\n`;
    
    // System Type
    const systemTypeLabel = data.systemType === 'other' 
      ? data.otherSystemType 
      : systemTypes.find(type => type.id === data.systemType)?.label;
    
    prompt += `## Tipo de Sistema\n${systemTypeLabel}\n\n`;
    
    // Objective and Features
    prompt += `## Objetivo do Projeto\n${data.projectObjective}\n\n`;
    
    // Common Features
    if (data.commonFeatures.length > 0) {
      prompt += `## Funcionalidades Gerais\n`;
      data.commonFeatures.forEach(feature => {
        const featureLabel = feature === 'other-feature' 
          ? data.otherCommonFeature 
          : commonFeatures.find(f => f.id === feature)?.label;
        prompt += `- ${featureLabel}\n`;
      });
      prompt += '\n';
    }
    
    // Dynamic Features
    if (data.dynamicFeatures.length > 0) {
      prompt += `## Funcionalidades Específicas para ${systemTypeLabel}\n`;
      data.dynamicFeatures.forEach(feature => {
        const featureList = featuresBySystemType[data.systemType as keyof typeof featuresBySystemType] || [];
        const featureLabel = feature === 'other-dynamic' 
          ? data.otherDynamicFeature 
          : featureList.find(f => f.id === feature)?.label;
        prompt += `- ${featureLabel}\n`;
      });
      prompt += '\n';
    }
    
    // UX/UI
    prompt += `## UX/UI e Design\n`;
    
    // Colors
    if (data.colorPalette.length > 0) {
      prompt += `### Paleta de Cores\n`;
      data.colorPalette.forEach(color => {
        const colorObj = colorPalettes.find(c => c.id === color);
        const colorLabel = color === 'custom' ? `${data.customColor} (Personalizada)` : `${colorObj?.label} (${colorObj?.value})`;
        prompt += `- ${colorLabel}\n`;
      });
    }
    
    // Visual Style
    const visualStyleLabel = data.visualStyle === 'other-style' 
      ? data.otherVisualStyle 
      : visualStyles.find(s => s.id === data.visualStyle)?.label;
    prompt += `\n### Estilo Visual\n${visualStyleLabel}\n\n`;
    
    // Menu Type
    const menuTypeLabel = data.menuType === 'other-menu' 
      ? data.otherMenuType 
      : menuTypes.find(m => m.id === data.menuType)?.label;
    prompt += `### Tipo de Menu\n${menuTypeLabel}\n\n`;
    
    // Landing Page
    if (data.hasLandingPage) {
      prompt += `### Landing Page\nSim\n`;
      
      if (data.landingStructure && data.landingStructure.length > 0) {
        prompt += `- Estrutura: ${data.landingStructure.map(s => 
          landingPageOptions.structure.find(o => o.id === s)?.label).join(' | ')}\n`;
      }
      
      if (data.landingElements && data.landingElements.length > 0) {
        prompt += `- Elementos: ${data.landingElements.map(e => 
          landingPageOptions.elements.find(o => o.id === e)?.label).join(', ')}\n`;
      }
      
      if (data.landingStyle) {
        const styleLabel = data.landingStyle === 'other-landing-style'
          ? data.otherLandingStyle
          : landingPageOptions.style.find(s => s.id === data.landingStyle)?.label;
        prompt += `- Estilo: ${styleLabel}\n`;
      }
      
      prompt += '\n';
    }
    
    // Authentication
    if (data.authOptions.length > 0) {
      prompt += `### Login e Autenticação\n`;
      data.authOptions.forEach(auth => {
        const authLabel = auth === 'other-auth' 
          ? data.otherAuthOption 
          : authOptions.find(a => a.id === auth)?.label;
        prompt += `- ${authLabel}\n`;
      });
      prompt += '\n';
    }
    
    // Dashboard
    if (data.hasDashboard && data.dashboardOptions) {
      prompt += `### Dashboard para Usuários Logados\nSim\n`;
      data.dashboardOptions.forEach(option => {
        const optionLabel = option === 'other-dashboard' 
          ? data.otherDashboardOption 
          : dashboardOptions.find(d => d.id === option)?.label;
        prompt += `- ${optionLabel}\n`;
      });
      prompt += '\n';
    }
    
    // Tech Stack
    prompt += `## Stack Tecnológica\n`;
    
    // Frontend / Backend separation
    prompt += `### Separação de Frontend e Backend\n${data.separateBackend ? 'Sim' : 'Não'}\n\n`;
    
    if (data.separateBackend) {
      // Frontend
      if (data.frontend && data.frontend.length > 0) {
        prompt += `#### Frontend\n`;
        data.frontend.forEach(tech => {
          const techLabel = tech === 'other-frontend' 
            ? data.otherFrontend 
            : techStackOptions.frontend.find(t => t.id === tech)?.label;
          prompt += `- ${techLabel}\n`;
        });
      }
      
      // Backend
      if (data.backend && data.backend.length > 0) {
        prompt += `\n#### Backend\n`;
        data.backend.forEach(tech => {
          const techLabel = tech === 'other-backend' 
            ? data.otherBackend 
            : techStackOptions.backend.find(t => t.id === tech)?.label;
          prompt += `- ${techLabel}\n`;
        });
      }
    } else if (data.fullstack) {
      // Fullstack
      const fullstackLabel = data.fullstack === 'other-fullstack'
        ? data.otherFullstack
        : techStackOptions.fullstack.find(t => t.id === data.fullstack)?.label;
      prompt += `#### Fullstack Integrado\n- ${fullstackLabel}\n`;
    }
    
    // Database
    const dbLabel = data.database === 'other-database'
      ? data.otherDatabase
      : techStackOptions.database.find(d => d.id === data.database)?.label;
    prompt += `\n### Banco de Dados\n- ${dbLabel}\n\n`;
    
    // ORM
    if (data.orm.length > 0) {
      prompt += `### ORM/ODM\n`;
      data.orm.forEach(orm => {
        const ormLabel = orm === 'other-orm'
          ? data.otherOrm
          : techStackOptions.orm.find(o => o.id === orm)?.label;
        prompt += `- ${ormLabel}\n`;
      });
      prompt += '\n';
    }
    
    // Deployment
    const deployLabel = data.deployment === 'other-deployment'
      ? data.otherDeployment
      : techStackOptions.deployment.find(d => d.id === data.deployment)?.label;
    prompt += `### Deploy / Infraestrutura\n- ${deployLabel}\n\n`;
    
    // Security
    if (data.securityOptions.length > 0) {
      prompt += `## Segurança\n`;
      data.securityOptions.forEach(security => {
        const securityLabel = security === 'other-security'
          ? data.otherSecurityOption
          : securityOptions.find(s => s.id === security)?.label;
        prompt += `- ${securityLabel}\n`;
      });
      prompt += '\n';
    }
    
    // Code Structure
    prompt += `## Estrutura de Código\n`;
    
    // Folder Structure
    if (data.folderStructure.length > 0) {
      prompt += `### Organização de Pastas\n`;
      data.folderStructure.forEach(folder => {
        const folderLabel = folder === 'other-folders'
          ? data.otherFolderStructure
          : codeStructureOptions.folders.find(f => f.id === folder)?.label;
        prompt += `- ${folderLabel}\n`;
      });
      prompt += '\n';
    }
    
    // Architecture
    if (data.architecture.length > 0) {
      prompt += `### Padrão Arquitetural\n`;
      data.architecture.forEach(arch => {
        const archLabel = arch === 'other-arch'
          ? data.otherArchitecture
          : codeStructureOptions.architecture.find(a => a.id === arch)?.label;
        prompt += `- ${archLabel}\n`;
      });
      prompt += '\n';
    }
    
    // Best Practices
    if (data.bestPractices.length > 0) {
      prompt += `### Boas Práticas\n`;
      data.bestPractices.forEach(practice => {
        const practiceLabel = practice === 'other-practices'
          ? data.otherBestPractice
          : codeStructureOptions.bestPractices.find(p => p.id === practice)?.label;
        prompt += `- ${practiceLabel}\n`;
      });
      prompt += '\n';
    }
    
    // Scalability
    if (data.needsScalability && data.scalabilityOptions) {
      prompt += `## Escalabilidade\nSim\n`;
      data.scalabilityOptions.forEach(option => {
        const optionLabel = option === 'other-scalability'
          ? data.otherScalabilityOption
          : scalabilityOptions.find(s => s.id === option)?.label;
        prompt += `- ${optionLabel}\n`;
      });
      prompt += '\n';
    }
    
    // Performance
    if (data.performanceOptions.length > 0) {
      prompt += `## Performance\n`;
      data.performanceOptions.forEach(perf => {
        const perfLabel = perf === 'other-perf'
          ? data.otherPerformanceOption
          : performanceOptions.find(p => p.id === perf)?.label;
        prompt += `- ${perfLabel}\n`;
      });
      prompt += '\n';
    }
    
    // Code Restrictions
    if (data.codeRestrictions.length > 0) {
      prompt += `## Restrições Técnicas\n### Evitar no Código\n`;
      data.codeRestrictions.forEach(restriction => {
        const restrictionLabel = restriction === 'other-restriction'
          ? data.otherCodeRestriction
          : codeRestrictionsOptions.find(r => r.id === restriction)?.label;
        prompt += `- ${restrictionLabel}\n`;
      });
      prompt += '\n';
    }
    
    prompt += `## Observações Adicionais\nFavor desenvolver código limpo, bem documentado e seguindo as melhores práticas atuais de desenvolvimento.`;
    
    return prompt;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "Prompt copiado para a área de transferência.",
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };
  
  const nextTab = () => {
    const tabs = [
      "system-type", 
      "objectives", 
      "ux-ui", 
      "tech-stack", 
      "security", 
      "code-structure", 
      "scalability", 
      "restrictions", 
      "generate"
    ];
    
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
      window.scrollTo(0, 0);
    } else {
      form.handleSubmit(onSubmit)();
    }
  };
  
  const prevTab = () => {
    const tabs = [
      "system-type", 
      "objectives", 
      "ux-ui", 
      "tech-stack", 
      "security", 
      "code-structure", 
      "scalability", 
      "restrictions", 
      "generate"
    ];
    
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
      window.scrollTo(0, 0);
    }
  };

  const resetForm = () => {
    setPromptGenerated(false);
    setActiveTab("system-type");
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <ScrollToTopOnMount />
      <Navbar />
      
      <div className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">Gerador de Prompts</h1>
          <p className="text-gray-600 text-center mb-8">
            Crie prompts otimizados para desenvolvimento de software com IA.
          </p>
          
          {!promptGenerated ? (
            <Card className="shadow-lg border-gray-200">
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                      <div className="mb-6 overflow-x-auto">
                        <TabsList className="grid grid-cols-9 w-full">
                          <TabsTrigger value="system-type">Tipo</TabsTrigger>
                          <TabsTrigger value="objectives">Objetivo</TabsTrigger>
                          <TabsTrigger value="ux-ui">UX/UI</TabsTrigger>
                          <TabsTrigger value="tech-stack">Stack</TabsTrigger>
                          <TabsTrigger value="security">Segurança</TabsTrigger>
                          <TabsTrigger value="code-structure">Estrutura</TabsTrigger>
                          <TabsTrigger value="scalability">Performance</TabsTrigger>
                          <TabsTrigger value="restrictions">Restrições</TabsTrigger>
                          <TabsTrigger value="generate">Gerar</TabsTrigger>
                        </TabsList>
                      </div>
                    
                      {/* Tab 1: System Type */}
                      <TabsContent value="system-type" className="space-y-6">
                        <div className="space-y-6">
                          <h2 className="text-2xl font-semibold">Tipo de Sistema</h2>
                          <FormField
                            control={form.control}
                            name="systemType"
                            render={({ field }) => (
                              <FormItem className="space-y-4">
                                <FormLabel>Selecione o tipo de sistema que deseja criar</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                                  >
                                    {systemTypes.map((type) => (
                                      <div key={type.id}>
                                        <RadioGroupItem
                                          value={type.id}
                                          id={`system-${type.id}`}
                                          className="peer sr-only"
                                        />
                                        <FormLabel
                                          htmlFor={`system-${type.id}`}
                                          className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                        >
                                          {type.label}
                                          {field.value === type.id && (
                                            <Check className="h-4 w-4 text-primary" />
                                          )}
                                        </FormLabel>
                                      </div>
                                    ))}
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {watchSystemType === 'other' && (
                            <FormField
                              control={form.control}
                              name="otherSystemType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Especifique o tipo de sistema</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Nome do tipo de sistema" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                        
                        <div className="flex justify-end">
                          <Button type="button" onClick={nextTab} className="bg-brand-600">
                            Próximo: Objetivo
                          </Button>
                        </div>
                      </TabsContent>
                    
                      {/* Tab 2: Objectives */}
                      <TabsContent value="objectives" className="space-y-6">
                        <div className="space-y-6">
                          <h2 className="text-2xl font-semibold">Objetivo e Funcionalidades</h2>
                          
                          <FormField
                            control={form.control}
                            name="projectObjective"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Qual é o objetivo do seu projeto?</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Descreva o objetivo principal do seu projeto..."
                                    className="min-h-[120px]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Seja específico sobre o que você está tentando alcançar.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="bg-gray-50 p-4 rounded-md mb-4">
                            <h3 className="text-sm font-medium mb-2">Sugestões de objetivos:</h3>
                            <div className="flex flex-wrap gap-2">
                              {objectiveSuggestions.map((suggestion, index) => (
                                <Badge 
                                  key={index}
                                  variant="outline"
                                  className="cursor-pointer hover:bg-gray-100"
                                  onClick={() => form.setValue('projectObjective', suggestion)}
                                >
                                  {suggestion}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <FormField
                            control={form.control}
                            name="commonFeatures"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel>Funcionalidades Gerais</FormLabel>
                                  <FormDescription>
                                    Selecione as funcionalidades gerais que seu sistema deve ter.
                                  </FormDescription>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {commonFeatures.map((feature) => (
                                    <FormField
                                      key={feature.id}
                                      control={form.control}
                                      name="commonFeatures"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={feature.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(feature.id)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...field.value, feature.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) => value !== feature.id
                                                        )
                                                      )
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                              {feature.label}
                                            </FormLabel>
                                          </FormItem>
                                        )
                                      }}
                                    />
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {form.watch('commonFeatures')?.includes('other-feature') && (
                            <FormField
                              control={form.control}
                              name="otherCommonFeature"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Especifique a funcionalidade adicional</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Descreva a funcionalidade" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          {watchSystemType && featuresBySystemType[watchSystemType as keyof typeof featuresBySystemType]?.length > 0 && (
                            <FormField
                              control={form.control}
                              name="dynamicFeatures"
                              render={() => (
                                <FormItem>
                                  <div className="mb-4">
                                    <FormLabel>Funcionalidades Específicas para {
                                      systemTypes.find(type => type.id === watchSystemType)?.label
                                    }</FormLabel>
                                    <FormDescription>
                                      Selecione as funcionalidades específicas para este tipo de sistema.
                                    </FormDescription>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {featuresBySystemType[watchSystemType as keyof typeof featuresBySystemType]?.map((feature) => (
                                      <FormField
                                        key={feature.id}
                                        control={form.control}
                                        name="dynamicFeatures"
                                        render={({ field }) => {
                                          return (
                                            <FormItem
                                              key={feature.id}
                                              className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                              <FormControl>
                                                <Checkbox
                                                  checked={field.value?.includes(feature.id)}
                                                  onCheckedChange={(checked) => {
                                                    return checked
                                                      ? field.onChange([...field.value, feature.id])
                                                      : field.onChange(
                                                          field.value?.filter(
                                                            (value) => value !== feature.id
                                                          )
                                                        )
                                                  }}
                                                />
                                              </FormControl>
                                              <FormLabel className="font-normal">
                                                {feature.label}
                                              </FormLabel>
                                            </FormItem>
                                          )
                                        }}
                                      />
                                    ))}
                                    <FormField
                                      control={form.control}
                                      name="dynamicFeatures"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes('other-dynamic')}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...field.value, 'other-dynamic'])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) => value !== 'other-dynamic'
                                                        )
                                                      )
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                              Outro (Especificar)
                                            </FormLabel>
                                          </FormItem>
                                        )
                                      }}
                                    />
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          {form.watch('dynamicFeatures')?.includes('other-dynamic') && (
                            <FormField
                              control={form.control}
                              name="otherDynamicFeature"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Especifique a funcionalidade específica adicional</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Descreva a funcionalidade" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                        
                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={prevTab}>
                            Anterior
                          </Button>
                          <Button type="button" onClick={nextTab} className="bg-brand-600">
                            Próximo: UX/UI
                          </Button>
                        </div>
                      </TabsContent>
                    
                      {/* Tab 3: UX/UI */}
                      <TabsContent value="ux-ui" className="space-y-6">
                        <div className="space-y-6">
                          <h2 className="text-2xl font-semibold">UX/UI e Design</h2>
                          
                          <FormField
                            control={form.control}
                            name="colorPalette"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel>Paleta de Cores</FormLabel>
                                  <FormDescription>
                                    Selecione as cores que deseja usar em seu projeto.
                                  </FormDescription>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  {colorPalettes.map((color) => (
                                    <FormField
                                      key={color.id}
                                      control={form.control}
                                      name="colorPalette"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={color.id}
                                            className="flex flex-col items-center space-y-2"
                                          >
                                            <FormControl>
                                              <div className="relative">
                                                <Checkbox
                                                  checked={field.value?.includes(color.id)}
                                                  onCheckedChange={(checked) => {
                                                    return checked
                                                      ? field.onChange([...field.value, color.id])
                                                      : field.onChange(
                                                          field.value?.filter(
                                                            (value) => value !== color.id
                                                          )
                                                        )
                                                  }}
                                                  className="absolute top-1 left-1 z-10"
                                                />
                                                <div 
                                                  className="h-12 w-12 rounded-full border shadow-sm flex items-center justify-center"
                                                  style={{
                                                    backgroundColor: color.value,
                                                    color: ['white', '#FFFFFF'].includes(color.value) ? '#000' : '#fff'
                                                  }}
                                                >
                                                </div>
                                              </div>
                                            </FormControl>
                                            <FormLabel className="font-normal text-sm text-center">
                                              {color.label}
                                            </FormLabel>
                                          </FormItem>
                                        )
                                      }}
                                    />
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {form.watch('colorPalette')?.includes('custom') && (
                            <FormField
                              control={form.control}
                              name="customColor"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cor personalizada (formato hexadecimal)</FormLabel>
                                  <FormControl>
                                    <div className="flex items-center gap-3">
                                      <Input placeholder="#RRGGBB" {...field} />
                                      {field.value && (
                                        <div 
                                          className="h-8 w-8 rounded-full border"
                                          style={{ backgroundColor: field.value }}
                                        ></div>
                                      )}
                                    </div>
                                  </FormControl>
                                  <FormDescription>
                                    Exemplo: #FF5500 para laranja
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          <FormField
                            control={form.control}
                            name="visualStyle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Estilo Visual</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="grid grid-cols-2 md:grid-cols-3 gap-3"
                                  >
                                    {visualStyles.map((style) => (
                                      <div key={style.id} className="flex items-center space-x-2">
                                        <RadioGroupItem value={style.id} id={`style-${style.id}`} />
                                        <FormLabel htmlFor={`style-${style.id}`} className="font-normal">
                                          {style.label}
                                        </FormLabel>
                                      </div>
                                    ))}
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {form.watch('visualStyle') === 'other-style' && (
                            <FormField
                              control={form.control}
                              name="otherVisualStyle"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Especifique o estilo visual</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Descreva o estilo visual" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          <FormField
                            control={form.control}
                            name="menuType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Tipo de Menu</FormLabel>
                                <FormControl>
                                  <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="grid grid-cols-2 md:grid-cols-3 gap-3"
                                  >
                                    {menuTypes.map((menu) => (
                                      <div key={menu.id} className="flex items-center space-x-2">
                                        <RadioGroupItem value={menu.id} id={`menu-${menu.id}`} />
                                        <FormLabel htmlFor={`menu-${menu.id}`} className="font-normal">
                                          {menu.label}
                                        </FormLabel>
                                      </div>
                                    ))}
                                  </RadioGroup>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {form.watch('menuType') === 'other-menu' && (
                            <FormField
                              control={form.control}
                              name="otherMenuType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Especifique o tipo de menu</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Descreva o tipo de menu" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          <FormField
                            control={form.control}
                            name="hasLandingPage"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Landing Page
                                  </FormLabel>
                                  <FormDescription>
                                    O sistema terá uma landing page?
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          {watchHasLanding && (
                            <div className="space-y-4 p-4 border rounded-lg">
                              <h3 className="font-medium">Configuração da Landing Page</h3>
                              
                              <FormField
                                control={form.control}
                                name="landingStructure"
                                render={() => (
                                  <FormItem>
                                    <div className="mb-2">
                                      <FormLabel>Estrutura</FormLabel>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      {landingPageOptions.structure.map((option) => (
                                        <FormField
                                          key={option.id}
                                          control={form.control}
                                          name="landingStructure"
                                          render={({ field }) => {
                                            return (
                                              <FormItem
                                                key={option.id}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                              >
                                                <FormControl>
                                                  <Checkbox
                                                    checked={field.value?.includes(option.id)}
                                                    onCheckedChange={(checked) => {
                                                      return checked
                                                        ? field.onChange([...(field.value || []), option.id])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                              (value) => value !== option.id
                                                            )
                                                          )
                                                    }}
                                                  />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                  {option.label}
                                                </FormLabel>
                                              </FormItem>
                                            )
                                          }}
                                        />
                                      ))}
                                    </div>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="landingElements"
                                render={() => (
                                  <FormItem>
                                    <div className="mb-2">
                                      <FormLabel>Elementos</FormLabel>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      {landingPageOptions.elements.map((option) => (
                                        <FormField
                                          key={option.id}
                                          control={form.control}
                                          name="landingElements"
                                          render={({ field }) => {
                                            return (
                                              <FormItem
                                                key={option.id}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                              >
                                                <FormControl>
                                                  <Checkbox
                                                    checked={field.value?.includes(option.id)}
                                                    onCheckedChange={(checked) => {
                                                      return checked
                                                        ? field.onChange([...(field.value || []), option.id])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                              (value) => value !== option.id
                                                            )
                                                          )
                                                    }}
                                                  />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                  {option.label}
                                                </FormLabel>
                                              </FormItem>
                                            )
                                          }}
                                        />
                                      ))}
                                    </div>
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="landingStyle"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Estilo</FormLabel>
                                    <FormControl>
                                      <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="grid grid-cols-2 gap-3"
                                      >
                                        {landingPageOptions.style.map((style) => (
                                          <div key={style.id} className="flex items-center space-x-2">
                                            <RadioGroupItem value={style.id} id={`landing-style-${style.id}`} />
                                            <FormLabel htmlFor={`landing-style-${style.id}`} className="font-normal">
                                              {style.label}
                                            </FormLabel>
                                          </div>
                                        ))}
                                      </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              {form.watch('landingStyle') === 'other-landing-style' && (
                                <FormField
                                  control={form.control}
                                  name="otherLandingStyle"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Especifique o estilo da landing page</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Descreva o estilo" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </div>
                          )}
                          
                          <FormField
                            control={form.control}
                            name="authOptions"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel>Login e Autenticação</FormLabel>
                                  <FormDescription>
                                    Selecione as opções de autenticação desejadas.
                                  </FormDescription>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  {authOptions.map((auth) => (
                                    <FormField
                                      key={auth.id}
                                      control={form.control}
                                      name="authOptions"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={auth.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(auth.id)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...field.value, auth.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) => value !== auth.id
                                                        )
                                                      )
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                              {auth.label}
                                            </FormLabel>
                                          </FormItem>
                                        )
                                      }}
                                    />
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {form.watch('authOptions')?.includes('other-auth') && (
                            <FormField
                              control={form.control}
                              name="otherAuthOption"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Especifique a opção de autenticação adicional</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Descreva a opção de autenticação" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          <FormField
                            control={form.control}
                            name="hasDashboard"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Dashboard para Usuários Logados
                                  </FormLabel>
                                  <FormDescription>
                                    O sistema terá um dashboard para usuários logados?
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          {watchHasDashboard && (
                            <FormField
                              control={form.control}
                              name="dashboardOptions"
                              render={() => (
                                <FormItem>
                                  <div className="mb-4">
                                    <FormLabel>Opções de Dashboard</FormLabel>
                                    <FormDescription>
                                      Selecione as características do dashboard.
                                    </FormDescription>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    {dashboardOptions.map((option) => (
                                      <FormField
                                        key={option.id}
                                        control={form.control}
                                        name="dashboardOptions"
                                        render={({ field }) => {
                                          return (
                                            <FormItem
                                              key={option.id}
                                              className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                              <FormControl>
                                                <Checkbox
                                                  checked={field.value?.includes(option.id)}
                                                  onCheckedChange={(checked) => {
                                                    return checked
                                                      ? field.onChange([...(field.value || []), option.id])
                                                      : field.onChange(
                                                          field.value?.filter(
                                                            (value) => value !== option.id
                                                          )
                                                        )
                                                  }}
                                                />
                                              </FormControl>
                                              <FormLabel className="font-normal">
                                                {option.label}
                                              </FormLabel>
                                            </FormItem>
                                          )
                                        }}
                                      />
                                    ))}
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          {form.watch('dashboardOptions')?.includes('other-dashboard') && (
                            <FormField
                              control={form.control}
                              name="otherDashboardOption"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Especifique a opção de dashboard adicional</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Descreva a opção de dashboard" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                        
                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={prevTab}>
                            Anterior
                          </Button>
                          <Button type="button" onClick={nextTab} className="bg-brand-600">
                            Próximo: Stack Tecnológica
                          </Button>
                        </div>
                      </TabsContent>
                    
                      {/* Tab 4: Tech Stack */}
                      <TabsContent value="tech-stack" className="space-y-6">
                        <div className="space-y-6">
                          <h2 className="text-2xl font-semibold">Stack Tecnológica</h2>
                          
                          <FormField
                            control={form.control}
                            name="separateBackend"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Separação de Frontend e Backend
                                  </FormLabel>
                                  <FormDescription>
                                    Deseja separar o frontend do backend em projetos diferentes?
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          {watchSeparateBackend && (
                            <>
                              <FormField
                                control={form.control}
                                name="frontend"
                                render={() => (
                                  <FormItem>
                                    <div className="mb-4">
                                      <FormLabel>Frontend</FormLabel>
                                      <FormDescription>
                                        Selecione as tecnologias de frontend.
                                      </FormDescription>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                      {techStackOptions.frontend.map((tech) => (
                                        <FormField
                                          key={tech.id}
                                          control={form.control}
                                          name="frontend"
                                          render={({ field }) => {
                                            return (
                                              <FormItem
                                                key={tech.id}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                              >
                                                <FormControl>
                                                  <Checkbox
                                                    checked={field.value?.includes(tech.id)}
                                                    onCheckedChange={(checked) => {
                                                      return checked
                                                        ? field.onChange([...(field.value || []), tech.id])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                              (value) => value !== tech.id
                                                            )
                                                          )
                                                    }}
                                                  />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                  {tech.label}
                                                </FormLabel>
                                              </FormItem>
                                            )
                                          }}
                                        />
                                      ))}
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              {form.watch('frontend')?.includes('other-frontend') && (
                                <FormField
                                  control={form.control}
                                  name="otherFrontend"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Especifique a tecnologia de frontend adicional</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Descreva a tecnologia" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                              
                              <FormField
                                control={form.control}
                                name="backend"
                                render={() => (
                                  <FormItem>
                                    <div className="mb-4">
                                      <FormLabel>Backend</FormLabel>
                                      <FormDescription>
                                        Selecione as tecnologias de backend.
                                      </FormDescription>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                      {techStackOptions.backend.map((tech) => (
                                        <FormField
                                          key={tech.id}
                                          control={form.control}
                                          name="backend"
                                          render={({ field }) => {
                                            return (
                                              <FormItem
                                                key={tech.id}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                              >
                                                <FormControl>
                                                  <Checkbox
                                                    checked={field.value?.includes(tech.id)}
                                                    onCheckedChange={(checked) => {
                                                      return checked
                                                        ? field.onChange([...(field.value || []), tech.id])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                              (value) => value !== tech.id
                                                            )
                                                          )
                                                    }}
                                                  />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                  {tech.label}
                                                </FormLabel>
                                              </FormItem>
                                            )
                                          }}
                                        />
                                      ))}
                                    </div>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              {form.watch('backend')?.includes('other-backend') && (
                                <FormField
                                  control={form.control}
                                  name="otherBackend"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Especifique a tecnologia de backend adicional</FormLabel>
                                      <FormControl>
                                        <Input placeholder="Descreva a tecnologia" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              )}
                            </>
                          )}
                          
                          {!watchSeparateBackend && (
                            <FormField
                              control={form.control}
                              name="fullstack"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Fullstack Integrado</FormLabel>
                                  <FormDescription>
                                    Selecione a tecnologia fullstack que deseja utilizar.
                                  </FormDescription>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      value={field.value}
                                      className="grid grid-cols-2 gap-3"
                                    >
                                      {techStackOptions.fullstack.map((tech) => (
                                        <div key={tech.id} className="flex items-center space-x-2">
                                          <RadioGroupItem value={tech.id} id={`fullstack-${tech.id}`} />
                                          <FormLabel htmlFor={`fullstack-${tech.id}`} className="font-normal">
                                            {tech.label}
                                          </FormLabel>
                                        </div>
                                      ))}
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          {form.watch('fullstack') === 'other-fullstack' && (
                            <FormField
                              control={form.control}
                              name="otherFullstack"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Especifique a tecnologia fullstack adicional</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Descreva a tecnologia" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          <FormField
                            control={form.control}
                            name="database"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Banco de Dados</FormLabel>
                                <FormDescription>
                                  Selecione o banco de dados principal para o projeto.
                                </FormDescription>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione um banco de dados" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {techStackOptions.database.map((db) => (
                                      <SelectItem key={db.id} value={db.id}>{db.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {form.watch('database') === 'other-database' && (
                            <FormField
                              control={form.control}
                              name="otherDatabase"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Especifique o banco de dados adicional</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Descreva o banco de dados" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          <FormField
                            control={form.control}
                            name="orm"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel>ORM/ODM</FormLabel>
                                  <FormDescription>
                                    Selecione o ORM ou ODM para acesso ao banco de dados.
                                  </FormDescription>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                  {techStackOptions.orm.map((orm) => (
                                    <FormField
                                      key={orm.id}
                                      control={form.control}
                                      name="orm"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={orm.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(orm.id)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...field.value, orm.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) => value !== orm.id
                                                        )
                                                      )
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                              {orm.label}
                                            </FormLabel>
                                          </FormItem>
                                        )
                                      }}
                                    />
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {form.watch('orm')?.includes('other-orm') && (
                            <FormField
                              control={form.control}
                              name="otherOrm"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Especifique o ORM/ODM adicional</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Descreva o ORM/ODM" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          <FormField
                            control={form.control}
                            name="deployment"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Deploy / Infraestrutura</FormLabel>
                                <FormDescription>
                                  Selecione a plataforma principal para deploy.
                                </FormDescription>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione uma plataforma de deploy" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {techStackOptions.deployment.map((deploy) => (
                                      <SelectItem key={deploy.id} value={deploy.id}>{deploy.label}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {form.watch('deployment') === 'other-deployment' && (
                            <FormField
                              control={form.control}
                              name="otherDeployment"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Especifique a plataforma de deploy adicional</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Descreva a plataforma" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                        
                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={prevTab}>
                            Anterior
                          </Button>
                          <Button type="button" onClick={nextTab} className="bg-brand-600">
                            Próximo: Segurança
                          </Button>
                        </div>
                      </TabsContent>
                    
                      {/* Tab 5: Security */}
                      <TabsContent value="security" className="space-y-6">
                        <div className="space-y-6">
                          <h2 className="text-2xl font-semibold">Segurança</h2>
                          
                          <FormField
                            control={form.control}
                            name="securityOptions"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel>Requisitos de Segurança</FormLabel>
                                  <FormDescription>
                                    Selecione os requisitos de segurança para o sistema.
                                  </FormDescription>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {securityOptions.map((option) => (
                                    <FormField
                                      key={option.id}
                                      control={form.control}
                                      name="securityOptions"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={option.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(option.id)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...field.value, option.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) => value !== option.id
                                                        )
                                                      )
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                              {option.label}
                                            </FormLabel>
                                          </FormItem>
                                        )
                                      }}
                                    />
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {form.watch('securityOptions')?.includes('other-security') && (
                            <FormField
                              control={form.control}
                              name="otherSecurityOption"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Especifique o requisito de segurança adicional</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Descreva o requisito" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                        
                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={prevTab}>
                            Anterior
                          </Button>
                          <Button type="button" onClick={nextTab} className="bg-brand-600">
                            Próximo: Estrutura de Código
                          </Button>
                        </div>
                      </TabsContent>
                    
                      {/* Tab 6: Code Structure */}
                      <TabsContent value="code-structure" className="space-y-6">
                        <div className="space-y-6">
                          <h2 className="text-2xl font-semibold">Estrutura de Código</h2>
                          
                          <FormField
                            control={form.control}
                            name="folderStructure"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel>Organização de Pastas</FormLabel>
                                  <FormDescription>
                                    Selecione como o código deve ser organizado.
                                  </FormDescription>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {codeStructureOptions.folders.map((folder) => (
                                    <FormField
                                      key={folder.id}
                                      control={form.control}
                                      name="folderStructure"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={folder.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(folder.id)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...field.value, folder.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) => value !== folder.id
                                                        )
                                                      )
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                              {folder.label}
                                            </FormLabel>
                                          </FormItem>
                                        )
                                      }}
                                    />
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {form.watch('folderStructure')?.includes('other-folders') && (
                            <FormField
                              control={form.control}
                              name="otherFolderStructure"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Especifique a organização de pastas adicional</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Descreva a organização" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          <FormField
                            control={form.control}
                            name="architecture"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel>Padrão Arquitetural</FormLabel>
                                  <FormDescription>
                                    Selecione os padrões arquiteturais a serem seguidos.
                                  </FormDescription>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {codeStructureOptions.architecture.map((arch) => (
                                    <FormField
                                      key={arch.id}
                                      control={form.control}
                                      name="architecture"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={arch.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(arch.id)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...field.value, arch.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) => value !== arch.id
                                                        )
                                                      )
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                              {arch.label}
                                            </FormLabel>
                                          </FormItem>
                                        )
                                      }}
                                    />
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {form.watch('architecture')?.includes('other-arch') && (
                            <FormField
                              control={form.control}
                              name="otherArchitecture"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Especifique o padrão arquitetural adicional</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Descreva o padrão" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          <FormField
                            control={form.control}
                            name="bestPractices"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel>Boas Práticas</FormLabel>
                                  <FormDescription>
                                    Selecione as boas práticas a serem seguidas.
                                  </FormDescription>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {codeStructureOptions.bestPractices.map((practice) => (
                                    <FormField
                                      key={practice.id}
                                      control={form.control}
                                      name="bestPractices"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={practice.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(practice.id)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...field.value, practice.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) => value !== practice.id
                                                        )
                                                      )
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                              {practice.label}
                                            </FormLabel>
                                          </FormItem>
                                        )
                                      }}
                                    />
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {form.watch('bestPractices')?.includes('other-practices') && (
                            <FormField
                              control={form.control}
                              name="otherBestPractice"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Especifique a boa prática adicional</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Descreva a boa prática" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                        
                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={prevTab}>
                            Anterior
                          </Button>
                          <Button type="button" onClick={nextTab} className="bg-brand-600">
                            Próximo: Escalabilidade e Performance
                          </Button>
                        </div>
                      </TabsContent>
                    
                      {/* Tab 7: Scalability & Performance */}
                      <TabsContent value="scalability" className="space-y-6">
                        <div className="space-y-6">
                          <h2 className="text-2xl font-semibold">Escalabilidade e Performance</h2>
                          
                          <FormField
                            control={form.control}
                            name="needsScalability"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Escalabilidade
                                  </FormLabel>
                                  <FormDescription>
                                    O sistema precisa ser altamente escalável?
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          {watchNeedsScalability && (
                            <FormField
                              control={form.control}
                              name="scalabilityOptions"
                              render={() => (
                                <FormItem>
                                  <div className="mb-4">
                                    <FormLabel>Opções de Escalabilidade</FormLabel>
                                    <FormDescription>
                                      Selecione as tecnologias e técnicas para escalabilidade.
                                    </FormDescription>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {scalabilityOptions.map((option) => (
                                      <FormField
                                        key={option.id}
                                        control={form.control}
                                        name="scalabilityOptions"
                                        render={({ field }) => {
                                          return (
                                            <FormItem
                                              key={option.id}
                                              className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                              <FormControl>
                                                <Checkbox
                                                  checked={field.value?.includes(option.id)}
                                                  onCheckedChange={(checked) => {
                                                    return checked
                                                      ? field.onChange([...(field.value || []), option.id])
                                                      : field.onChange(
                                                          field.value?.filter(
                                                            (value) => value !== option.id
                                                          )
                                                        )
                                                  }}
                                                />
                                              </FormControl>
                                              <FormLabel className="font-normal">
                                                {option.label}
                                              </FormLabel>
                                            </FormItem>
                                          )
                                        }}
                                      />
                                    ))}
                                  </div>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          {form.watch('scalabilityOptions')?.includes('other-scalability') && (
                            <FormField
                              control={form.control}
                              name="otherScalabilityOption"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Especifique a opção de escalabilidade adicional</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Descreva a opção" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                          
                          <FormField
                            control={form.control}
                            name="performanceOptions"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel>Performance</FormLabel>
                                  <FormDescription>
                                    Selecione as técnicas de otimização de performance.
                                  </FormDescription>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {performanceOptions.map((option) => (
                                    <FormField
                                      key={option.id}
                                      control={form.control}
                                      name="performanceOptions"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={option.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(option.id)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...field.value, option.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) => value !== option.id
                                                        )
                                                      )
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                              {option.label}
                                            </FormLabel>
                                          </FormItem>
                                        )
                                      }}
                                    />
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {form.watch('performanceOptions')?.includes('other-perf') && (
                            <FormField
                              control={form.control}
                              name="otherPerformanceOption"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Especifique a técnica de performance adicional</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Descreva a técnica" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                        
                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={prevTab}>
                            Anterior
                          </Button>
                          <Button type="button" onClick={nextTab} className="bg-brand-600">
                            Próximo: Restrições Técnicas
                          </Button>
                        </div>
                      </TabsContent>
                    
                      {/* Tab 8: Restrictions */}
                      <TabsContent value="restrictions" className="space-y-6">
                        <div className="space-y-6">
                          <h2 className="text-2xl font-semibold">Restrições Técnicas</h2>
                          
                          <FormField
                            control={form.control}
                            name="codeRestrictions"
                            render={() => (
                              <FormItem>
                                <div className="mb-4">
                                  <FormLabel>Evitar no Código</FormLabel>
                                  <FormDescription>
                                    Selecione padrões, técnicas ou tecnologias que devem ser evitados.
                                  </FormDescription>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {codeRestrictionsOptions.map((restriction) => (
                                    <FormField
                                      key={restriction.id}
                                      control={form.control}
                                      name="codeRestrictions"
                                      render={({ field }) => {
                                        return (
                                          <FormItem
                                            key={restriction.id}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                          >
                                            <FormControl>
                                              <Checkbox
                                                checked={field.value?.includes(restriction.id)}
                                                onCheckedChange={(checked) => {
                                                  return checked
                                                    ? field.onChange([...field.value, restriction.id])
                                                    : field.onChange(
                                                        field.value?.filter(
                                                          (value) => value !== restriction.id
                                                        )
                                                      )
                                                }}
                                              />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                              {restriction.label}
                                            </FormLabel>
                                          </FormItem>
                                        )
                                      }}
                                    />
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {form.watch('codeRestrictions')?.includes('other-restriction') && (
                            <FormField
                              control={form.control}
                              name="otherCodeRestriction"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Especifique a restrição adicional</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Descreva a restrição" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                        
                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={prevTab}>
                            Anterior
                          </Button>
                          <Button type="button" onClick={nextTab} className="bg-brand-600">
                            Próximo: Gerar Prompt
                          </Button>
                        </div>
                      </TabsContent>
                    
                      {/* Tab 9: Generate */}
                      <TabsContent value="generate" className="space-y-6">
                        <div className="space-y-6">
                          <h2 className="text-2xl font-semibold">Revisão e Geração do Prompt</h2>
                          
                          <div className="space-y-4">
                            <div className="p-4 border rounded-lg bg-gray-50">
                              <h3 className="font-medium mb-2">Resumo das Seleções</h3>
                              <dl className="space-y-2">
                                <div className="flex flex-col sm:flex-row">
                                  <dt className="font-medium text-gray-500 sm:w-1/3">Tipo:</dt>
                                  <dd className="sm:w-2/3">
                                    {watchSystemType ? (
                                      watchSystemType === 'other' ? 
                                        form.watch('otherSystemType') : 
                                        systemTypes.find(t => t.id === watchSystemType)?.label
                                    ) : 'Não selecionado'}
                                  </dd>
                                </div>
                                <div className="flex flex-col sm:flex-row">
                                  <dt className="font-medium text-gray-500 sm:w-1/3">Stack:</dt>
                                  <dd className="sm:w-2/3">
                                    {watchSeparateBackend ? 
                                      `Frontend: ${form.watch('frontend')?.map(id => 
                                        techStackOptions.frontend.find(t => t.id === id)?.label).join(', ') || 'Não selecionado'}, 
                                       Backend: ${form.watch('backend')?.map(id => 
                                        techStackOptions.backend.find(t => t.id === id)?.label).join(', ') || 'Não selecionado'}` : 
                                      `Fullstack: ${form.watch('fullstack') ? 
                                        techStackOptions.fullstack.find(t => t.id === form.watch('fullstack'))?.label : 
                                        'Não selecionado'}`}
                                  </dd>
                                </div>
                                <div className="flex flex-col sm:flex-row">
                                  <dt className="font-medium text-gray-500 sm:w-1/3">Banco de Dados:</dt>
                                  <dd className="sm:w-2/3">
                                    {form.watch('database') ? 
                                      form.watch('database') === 'other-database' ? 
                                        form.watch('otherDatabase') : 
                                        techStackOptions.database.find(d => d.id === form.watch('database'))?.label : 
                                      'Não selecionado'}
                                  </dd>
                                </div>
                              </dl>
                            </div>
                            <p className="text-gray-600">
                              Ao clicar em "Gerar Prompt", todos os detalhes que você selecionou serão 
                              organizados em um formato otimizado para uso com modelos de IA.
                            </p>
                          </div>
                          
                          <div className="flex flex-col gap-4">
                            <FormField
                              control={form.control}
                              name="projectObjective"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Revise seu objetivo principal</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      className="min-h-[120px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <Button type="button" variant="outline" onClick={prevTab}>
                            Anterior
                          </Button>
                          <Button type="submit" className="bg-brand-600">
                            Gerar Prompt
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </form>
                </Form>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="prompt" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="prompt">Prompt Gerado</TabsTrigger>
                <TabsTrigger value="history" disabled={!user}>
                  Histórico {!user && <Info className="h-4 w-4 ml-1" title="Faça login para acessar o histórico" />}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="prompt" className="space-y-6 mt-6">
                <Card className="shadow-lg border-gray-200">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold">Prompt Gerado</h2>
                      <Button 
                        onClick={copyToClipboard}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copiado!" : "Copiar"}
                      </Button>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-md">
                      <ScrollArea className="h-[500px] p-4">
                        <pre className="whitespace-pre-wrap text-sm font-mono">
                          {generatedPrompt}
                        </pre>
                      </ScrollArea>
                    </div>
                    
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                      <Button 
                        onClick={resetForm} 
                        variant="outline"
                        className="flex-1"
                      >
                        Criar Novo Prompt
                      </Button>
                      {!user && (
                        <Button className="flex-1">
                          Faça login para salvar prompts
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history" className="space-y-6 mt-6">
                {user ? (
                  <Card className="shadow-lg border-gray-200">
                    <CardContent className="pt-6">
                      <h2 className="text-xl font-semibold mb-4">Histórico de Prompts</h2>
                      
                      {promptHistory.length > 0 ? (
                        <div className="space-y-4">
                          {promptHistory.map((item) => (
                            <Collapsible key={item.id} className="border rounded-md">
                              <div className="flex justify-between items-center p-4">
                                <div>
                                  <h3 className="font-medium">{item.title}</h3>
                                  <p className="text-sm text-gray-500">
                                    {item.systemType} - {new Date(item.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <CollapsibleTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <ChevronDown className="h-4 w-4" />
                                  </Button>
                                </CollapsibleTrigger>
                              </div>
                              <CollapsibleContent>
                                <div className="border-t p-4">
                                  <ScrollArea className="h-[300px]">
                                    <pre className="whitespace-pre-wrap text-sm font-mono">
                                      {item.prompt}
                                    </pre>
                                  </ScrollArea>
                                  <div className="mt-4 flex justify-end gap-2">
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => {
                                        navigator.clipboard.writeText(item.prompt);
                                        toast({
                                          title: "Copiado!",
                                          description: "Prompt copiado para a área de transferência.",
                                        });
                                      }}
                                    >
                                      <Copy className="h-4 w-4 mr-2" />
                                      Copiar
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => {
                                        setGeneratedPrompt(item.prompt);
                                      }}
                                    >
                                      <Edit className="h-4 w-4 mr-2" />
                                      Editar
                                    </Button>
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <p>Nenhum prompt salvo no histórico.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="shadow-lg border-gray-200">
                    <CardContent className="py-12 text-center">
                      <p className="text-gray-500 mb-4">
                        Faça login para acessar seu histórico de prompts.
                      </p>
                      <Button>Login</Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PromptGenerator;
