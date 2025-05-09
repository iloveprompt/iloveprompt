
import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SecurityStepProps {
  formData: {
    selectedSecurity: string[];
  };
  updateFormData: (data: Partial<SecurityStepProps['formData']>) => void;
}

const securityOptions = [
  'Autenticação de usuários',
  'Autorização baseada em funções/permissões',
  'Validação de entrada de dados',
  'Proteção contra injeção SQL',
  'Proteção contra XSS (Cross-Site Scripting)',
  'Proteção contra CSRF (Cross-Site Request Forgery)',
  'Criptografia de dados em repouso',
  'Criptografia de dados em trânsito (HTTPS)',
  'Autenticação de dois fatores (2FA)',
  'Limite de tentativas de login',
  'Monitoramento e logs de segurança',
  'Proteção contra DDoS',
  'Certificação de segurança (ex: ISO 27001)',
  'Conformidade com regulamentos específicos',
  'Backup e recuperação de dados',
  'Política de senhas fortes',
  'Registro de atividades do usuário',
  'Proteção de API (throttling, autenticação)',
  'Sanitização de arquivos enviados'
];

const SecurityStep: React.FC<SecurityStepProps> = ({ formData, updateFormData }) => {
  const { t } = useLanguage();
  
  const handleSecurityToggle = (security: string) => {
    if (formData.selectedSecurity.includes(security)) {
      updateFormData({
        selectedSecurity: formData.selectedSecurity.filter(s => s !== security)
      });
    } else {
      updateFormData({
        selectedSecurity: [...formData.selectedSecurity, security]
      });
    }
  };
  
  const handleSelectAll = () => {
    if (formData.selectedSecurity.length === securityOptions.length) {
      // Deselect all
      updateFormData({ selectedSecurity: [] });
    } else {
      // Select all
      updateFormData({ selectedSecurity: [...securityOptions] });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('promptGenerator.security.title')}</CardTitle>
          <CardDescription>
            {t('promptGenerator.security.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">{t('promptGenerator.security.securityFeatures')}</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleSelectAll}
            >
              {formData.selectedSecurity.length === securityOptions.length ? 
                t('promptGenerator.common.unselectAll') : 
                t('promptGenerator.common.selectAll')}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {securityOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox 
                  id={`security-${option}`}
                  checked={formData.selectedSecurity.includes(option)}
                  onCheckedChange={() => handleSecurityToggle(option)}
                />
                <Label 
                  htmlFor={`security-${option}`}
                  className="cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityStep;
