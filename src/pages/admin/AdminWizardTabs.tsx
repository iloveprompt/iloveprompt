import React from 'react';
import WizardListCrud from './WizardListCrud';
import objectivesData from '../wizard/data/objectivesData.json';
import businessObjectivesData from '../wizard/data/businessObjectivesData.json';
import featuresData from '../wizard/data/featuresData.json';
import uxuiData from '../wizard/data/uxuiData.json';
import stackData from '../wizard/data/stackData.json';
import securityData from '../wizard/data/securityData.json';
import scalabilityData from '../wizard/data/scalabilityData.json';
import restrictionsData from '../wizard/data/restrictionsData.json';
import integrationsData from '../wizard/data/integrationsData.json';
import codeStructureData from '../wizard/data/codeStructureData.json';
import nonFunctionalRequirementsData from '../wizard/data/nonFunctionalRequirementsData.json';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const wizardTabs = [
  { value: 'objectives', label: 'Objetivos', data: objectivesData },
  { value: 'businessObjectives', label: 'Objetivos de Negócio', data: businessObjectivesData },
  { value: 'features', label: 'Funcionalidades', data: featuresData },
  { value: 'uxui', label: 'Opções de UX/UI', data: uxuiData },
  { value: 'stack', label: 'Stack de Tecnologias', data: stackData },
  { value: 'security', label: 'Opções de Segurança', data: securityData },
  { value: 'scalability', label: 'Escalabilidade', data: scalabilityData },
  { value: 'restrictions', label: 'Restrições', data: restrictionsData },
  { value: 'integrations', label: 'Integrações', data: integrationsData },
  { value: 'codeStructure', label: 'Estrutura de Código', data: codeStructureData },
  { value: 'nonFunctionalRequirements', label: 'Requisitos Não-Funcionais', data: nonFunctionalRequirementsData },
];

const AdminWizardTabs: React.FC = () => {
  return (
    <Tabs defaultValue={wizardTabs[0].value} className="space-y-4">
      <TabsList className="overflow-x-auto">
        {wizardTabs.map(tab => (
          <TabsTrigger key={tab.value} value={tab.value} className="min-w-[140px]">
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {wizardTabs.map(tab => (
        <TabsContent key={tab.value} value={tab.value} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{tab.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <WizardListCrud
                listName={tab.value}
                listLabel={tab.label}
                initialData={tab.data}
              />
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default AdminWizardTabs; 