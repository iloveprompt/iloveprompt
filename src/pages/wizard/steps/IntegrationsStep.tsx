import React, { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface IntegrationsStepProps {
  formData: {
    selectedIntegrations: string[];
  };
  updateFormData: (data: Partial<IntegrationsStepProps['formData']>) => void;
}

const integrationCategories = [
  {
    id: 'payments',
    title: 'Pagamentos e Financeiro',
    options: [
      'Stripe', 
      'PayPal', 
      'Adyen', 
      'Mercado Pago', 
      'Cielo', 
      'APIs para transferências', 
      'APIs para pagamentos via PIX',
      'Serviços de Cobrança',
      'APIs de Criptomoedas',
      'Serviços de Análise de Crédito'
    ]
  },
  {
    id: 'marketing',
    title: 'Marketing e Vendas',
    options: [
      'Salesforce', 
      'HubSpot', 
      'Pipedrive',
      'Mailchimp', 
      'SendGrid', 
      'Brevo',
      'Facebook', 
      'Instagram', 
      'Twitter', 
      'LinkedIn',
      'Google Ads', 
      'Facebook Ads',
      'Google Analytics', 
      'Semrush',
      'Shopify', 
      'WooCommerce', 
      'Magento',
      'Programas de Fidelidade'
    ]
  },
  {
    id: 'communication',
    title: 'Comunicação e Notificações',
    options: [
      'Twilio', 
      'Vonage',
      'SendGrid', 
      'Mailgun',
      'Firebase Cloud Messaging (FCM)', 
      'Apple Push Notification service (APNs)',
      'Chatbots e Assistentes Virtuais',
      'Zoom', 
      'Google Meet'
    ]
  },
  {
    id: 'data',
    title: 'Dados e Armazenamento',
    options: [
      'AWS RDS', 
      'Google Cloud SQL', 
      'Azure SQL Database',
      'AWS S3', 
      'Google Cloud Storage', 
      'Azure Blob Storage',
      'Elasticsearch', 
      'Algolia',
      'Google BigQuery', 
      'AWS Redshift',
      'Google Maps Platform', 
      'Mapbox'
    ]
  },
  {
    id: 'auth',
    title: 'Autenticação e Segurança',
    options: [
      'OAuth 2.0 e OpenID Connect',
      'Auth0', 
      'Okta',
      'APIs de Detecção de Fraude',
      'Google reCAPTCHA'
    ]
  },
  {
    id: 'productivity',
    title: 'Produtividade e Colaboração',
    options: [
      'Asana', 
      'Trello', 
      'Jira',
      'Google Drive', 
      'Dropbox', 
      'OneDrive',
      'Google Calendar', 
      'Outlook Calendar'
    ]
  },
  {
    id: 'ai',
    title: 'Inteligência Artificial e Machine Learning',
    options: [
      'Google Cloud Natural Language API', 
      'OpenAI',
      'Google Cloud Vision API', 
      'AWS Rekognition',
      'TensorFlow', 
      'PyTorch'
    ]
  },
  {
    id: 'iot',
    title: 'Internet das Coisas (IoT)',
    options: [
      'AWS IoT Core', 
      'Google Cloud IoT Platform',
      'APIs de Dispositivos Específicos'
    ]
  },
  {
    id: 'internal',
    title: 'APIs Internas (Microserviços)',
    options: [
      'APIs de microserviços'
    ]
  },
  {
    id: 'specific',
    title: 'APIs de Terceiros para Funções Específicas',
    options: [
      'APIs de previsão do tempo',
      'APIs de tradução de idiomas',
      'APIs de notícias',
      'APIs de informações de tráfego',
      'APIs de cotações de moedas e ações'
    ]
  }
];

const IntegrationsStep: React.FC<IntegrationsStepProps> = ({ formData, updateFormData }) => {
  const { t } = useLanguage();
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [otherIntegration, setOtherIntegration] = useState<string>('');
  
  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };
  
  const handleToggleIntegration = (integration: string) => {
    if (formData.selectedIntegrations.includes(integration)) {
      updateFormData({
        selectedIntegrations: formData.selectedIntegrations.filter(i => i !== integration)
      });
    } else {
      updateFormData({
        selectedIntegrations: [...formData.selectedIntegrations, integration]
      });
    }
  };
  
  const handleSelectAllInCategory = (options: string[]) => {
    // Get current selections
    const currentSelections = new Set(formData.selectedIntegrations);
    
    // Check if all options in this category are already selected
    const allSelected = options.every(option => currentSelections.has(option));
    
    if (allSelected) {
      // Deselect all options in this category
      updateFormData({
        selectedIntegrations: formData.selectedIntegrations.filter(
          item => !options.includes(item)
        )
      });
    } else {
      // Select all options in this category
      const newSelections = [...formData.selectedIntegrations];
      
      options.forEach(option => {
        if (!currentSelections.has(option)) {
          newSelections.push(option);
        }
      });
      
      updateFormData({
        selectedIntegrations: newSelections
      });
    }
  };
  
  const handleSelectAll = () => {
    // Get all options from all categories
    const allOptions = integrationCategories.flatMap(category => category.options);
    
    // Check if all are already selected
    if (formData.selectedIntegrations.length === allOptions.length) {
      // Deselect all
      updateFormData({
        selectedIntegrations: []
      });
    } else {
      // Select all
      updateFormData({
        selectedIntegrations: [...allOptions]
      });
    }
  };
  
  const handleAddOther = () => {
    if (otherIntegration.trim()) {
      updateFormData({
        selectedIntegrations: [...formData.selectedIntegrations, `Outro: ${otherIntegration.trim()}`]
      });
      setOtherIntegration('');
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('promptGenerator.integrations.title')}</CardTitle>
          <CardDescription>
            {t('promptGenerator.integrations.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleToggleOptions} 
            className="w-full justify-between"
          >
            {showOptions ? t('promptGenerator.integrations.hideOptions') : t('promptGenerator.integrations.showOptions')}
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
              {formData.selectedIntegrations.length} {t('promptGenerator.integrations.selected')}
            </span>
          </Button>
          
          {showOptions && (
            <div className="mt-4 border rounded-md p-4 bg-gray-50 space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">{t('promptGenerator.integrations.availableIntegrations')}</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSelectAll}
                >
                  {formData.selectedIntegrations.length === integrationCategories.flatMap(c => c.options).length
                    ? t('promptGenerator.common.unselectAll')
                    : t('promptGenerator.common.selectAll')}
                </Button>
              </div>
              
              <div className="space-y-6">
                {integrationCategories.map(category => (
                  <div key={category.id} className="pb-4 border-b border-gray-200 last:border-0">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-md">{category.title}</h4>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleSelectAllInCategory(category.options)}
                      >
                        {category.options.every(option => formData.selectedIntegrations.includes(option))
                          ? t('promptGenerator.common.unselectAll')
                          : t('promptGenerator.common.selectAll')}
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {category.options.map(option => (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`integration-${option}`}
                            checked={formData.selectedIntegrations.includes(option)}
                            onCheckedChange={() => handleToggleIntegration(option)}
                          />
                          <Label htmlFor={`integration-${option}`}>{option}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {/* Other (custom) integration */}
                <div className="pt-2">
                  <h4 className="font-semibold text-md mb-3">
                    {t('promptGenerator.integrations.otherIntegration')}
                  </h4>
                  <div className="flex space-x-2">
                    <Input 
                      placeholder={t('promptGenerator.integrations.otherPlaceholder')}
                      value={otherIntegration}
                      onChange={(e) => setOtherIntegration(e.target.value)}
                    />
                    <Button onClick={handleAddOther}>
                      {t('promptGenerator.common.add')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {formData.selectedIntegrations.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">{t('promptGenerator.integrations.selectedIntegrations')}</h3>
              <div className="flex flex-wrap gap-2">
                {formData.selectedIntegrations.map((integration) => (
                  <div key={integration} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md flex items-center text-sm">
                    <span>{integration}</span>
                    <button 
                      className="ml-2 text-blue-500 hover:text-blue-700"
                      onClick={() => handleToggleIntegration(integration)}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsStep;
