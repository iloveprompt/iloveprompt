
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckboxItem } from '@/components/CheckboxItem';
import RadioSpecifyItem from '@/components/RadioSpecifyItem';
import { toast } from "@/components/ui/use-toast";
import { useLanguage } from '@/i18n/LanguageContext';
import ColorPicker from '../components/ColorPicker';
import uxuiData from '../data/uxuiData.json';
import AIAssistantPanel from '../components/AIAssistantPanel';

interface UXUIStepProps {
  onNext: () => void;
  onPrev: () => void;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  handleSaveProgress: () => void;
  updateFormData: (data: any) => void;
  markAsFinalized: () => void;
  resetStep: () => void;
  isFinalized: boolean;
}

const UXUIStep: React.FC<UXUIStepProps> = ({
  onNext,
  onPrev,
  formData,
  setFormData,
  handleSaveProgress,
  updateFormData,
  markAsFinalized,
  resetStep,
  isFinalized
}) => {
  const { language } = useLanguage();
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      visualStyle: formData.visualStyle || [],
      menuType: formData.menuType || [],
      auth: formData.auth || [],
      dashboardFeatures: formData.dashboardFeatures || [],
      landingStructure: formData.landingStructure || [],
      landingElements: formData.landingElements || [],
      landingStyle: formData.landingStyle || '',
      primaryColor: formData.primaryColor || '#4F46E5',
      secondaryColor: formData.secondaryColor || '#10B981',
      accentColor: formData.accentColor || '#F59E0B',
      textColor: formData.textColor || '#111827',
      backgroundColor: formData.backgroundColor || '#FFFFFF',
      otherUXUIRequirements: formData.otherUXUIRequirements || '',
    }
  });

  const [isColorPickerOpen, setIsColorPickerOpen] = useState<{
    value: boolean;
    selectedOptions: string[];
  }>({ value: false, selectedOptions: [] });
  
  const [activeColorField, setActiveColorField] = useState<string>('');

  const visualStyleOptions = uxuiData.filter(item => item.category === 'visualStyle');
  const menuTypeOptions = uxuiData.filter(item => item.category === 'menuType');
  const authOptions = uxuiData.filter(item => item.category === 'auth');
  const dashboardFeaturesOptions = uxuiData.filter(item => item.category === 'dashboardFeatures');
  const landingStructureOptions = uxuiData.filter(item => item.category === 'landingStructure');
  const landingElementsOptions = uxuiData.filter(item => item.category === 'landingElements');
  const landingStyleOptions = uxuiData.filter(item => item.category === 'landingStyle');

  const onSubmit = (data: any) => {
    updateFormData({
      visualStyle: data.visualStyle,
      menuType: data.menuType,
      auth: data.auth,
      dashboardFeatures: data.dashboardFeatures,
      landingStructure: data.landingStructure,
      landingElements: data.landingElements,
      landingStyle: data.landingStyle,
      primaryColor: data.primaryColor,
      secondaryColor: data.secondaryColor,
      accentColor: data.accentColor,
      textColor: data.textColor,
      backgroundColor: data.backgroundColor,
      otherUXUIRequirements: data.otherUXUIRequirements,
    });
    
    handleSaveProgress();
    onNext();
  };

  const handleColorPickerOpen = (colorField: string) => {
    setActiveColorField(colorField);
    setIsColorPickerOpen({ value: true, selectedOptions: [] });
  };

  const handleColorSelect = (color: string) => {
    if (activeColorField) {
      setValue(activeColorField as any, color);
      setIsColorPickerOpen({ value: false, selectedOptions: [] });
    }
  };

  const getFaqPrompt = () => {
    const promptTexts = {
      pt: "Como posso melhorar a experiência de usuário da minha aplicação?",
      en: "How can I improve the user experience of my application?",
      es: "¿Cómo puedo mejorar la experiencia de usuario de mi aplicación?"
    };
    
    return promptTexts[language as keyof typeof promptTexts] || promptTexts.en;
  };

  return (
    <div className="wizard-step ux-ui-step">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-6">
            {language === 'pt' ? 'Design UX/UI' : 
             language === 'es' ? 'Diseño UX/UI' : 'UX/UI Design'}
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <section>
              <h3 className="text-xl font-semibold mb-4">
                {language === 'pt' ? 'Estilo Visual' : 
                 language === 'es' ? 'Estilo Visual' : 'Visual Style'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visualStyleOptions.map((option) => (
                  <CheckboxItem
                    key={option.id}
                    id={option.id}
                    label={option.label}
                    checked={watch('visualStyle')?.includes(option.id)}
                    onCheckedChange={(checked) => {
                      const current = watch('visualStyle') || [];
                      setValue('visualStyle', checked 
                        ? [...current, option.id]
                        : current.filter((id: string) => id !== option.id)
                      );
                    }}
                  />
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">
                {language === 'pt' ? 'Tipo de Menu' : 
                 language === 'es' ? 'Tipo de Menú' : 'Menu Type'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuTypeOptions.map((option) => (
                  <CheckboxItem
                    key={option.id}
                    id={option.id}
                    label={option.label}
                    checked={watch('menuType')?.includes(option.id)}
                    onCheckedChange={(checked) => {
                      const current = watch('menuType') || [];
                      setValue('menuType', checked 
                        ? [...current, option.id]
                        : current.filter((id: string) => id !== option.id)
                      );
                    }}
                  />
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">
                {language === 'pt' ? 'Autenticação' : 
                 language === 'es' ? 'Autenticación' : 'Authentication'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {authOptions.map((option) => (
                  <CheckboxItem
                    key={option.id}
                    id={option.id}
                    label={option.label}
                    checked={watch('auth')?.includes(option.id)}
                    onCheckedChange={(checked) => {
                      const current = watch('auth') || [];
                      setValue('auth', checked 
                        ? [...current, option.id]
                        : current.filter((id: string) => id !== option.id)
                      );
                    }}
                  />
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">
                {language === 'pt' ? 'Recursos do Dashboard' : 
                 language === 'es' ? 'Características del Dashboard' : 'Dashboard Features'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dashboardFeaturesOptions.map((option) => (
                  <CheckboxItem
                    key={option.id}
                    id={option.id}
                    label={option.label}
                    checked={watch('dashboardFeatures')?.includes(option.id)}
                    onCheckedChange={(checked) => {
                      const current = watch('dashboardFeatures') || [];
                      setValue('dashboardFeatures', checked 
                        ? [...current, option.id]
                        : current.filter((id: string) => id !== option.id)
                      );
                    }}
                  />
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">
                {language === 'pt' ? 'Estrutura da Landing Page' : 
                 language === 'es' ? 'Estructura de la Landing Page' : 'Landing Page Structure'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {landingStructureOptions.map((option) => (
                  <CheckboxItem
                    key={option.id}
                    id={option.id}
                    label={option.label}
                    checked={watch('landingStructure')?.includes(option.id)}
                    onCheckedChange={(checked) => {
                      const current = watch('landingStructure') || [];
                      setValue('landingStructure', checked 
                        ? [...current, option.id]
                        : current.filter((id: string) => id !== option.id)
                      );
                    }}
                  />
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">
                {language === 'pt' ? 'Elementos da Landing Page' : 
                 language === 'es' ? 'Elementos de la Landing Page' : 'Landing Page Elements'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {landingElementsOptions.map((option) => (
                  <CheckboxItem
                    key={option.id}
                    id={option.id}
                    label={option.label}
                    checked={watch('landingElements')?.includes(option.id)}
                    onCheckedChange={(checked) => {
                      const current = watch('landingElements') || [];
                      setValue('landingElements', checked 
                        ? [...current, option.id]
                        : current.filter((id: string) => id !== option.id)
                      );
                    }}
                  />
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">
                {language === 'pt' ? 'Estilo da Landing Page' : 
                 language === 'es' ? 'Estilo de la Landing Page' : 'Landing Page Style'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {landingStyleOptions.map((option) => (
                  <RadioSpecifyItem
                    key={option.id}
                    id={option.id}
                    value={option.id}
                    label={option.label}
                    groupValue={watch('landingStyle') || ''}
                    specifyValue={''}
                    onValueChange={(value) => setValue('landingStyle', value)}
                    onSpecifyValueChange={() => {}}
                  />
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">
                {language === 'pt' ? 'Cores' : 
                 language === 'es' ? 'Colores' : 'Colors'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    {language === 'pt' ? 'Cor Primária' : 
                     language === 'es' ? 'Color Primario' : 'Primary Color'}
                  </label>
                  <div 
                    className="h-10 rounded border cursor-pointer flex items-center p-2"
                    style={{ backgroundColor: watch('primaryColor') }}
                    onClick={() => handleColorPickerOpen('primaryColor')}
                  >
                    <span className="ml-2 text-sm">{watch('primaryColor')}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    {language === 'pt' ? 'Cor Secundária' : 
                     language === 'es' ? 'Color Secundario' : 'Secondary Color'}
                  </label>
                  <div 
                    className="h-10 rounded border cursor-pointer flex items-center p-2"
                    style={{ backgroundColor: watch('secondaryColor') }}
                    onClick={() => handleColorPickerOpen('secondaryColor')}
                  >
                    <span className="ml-2 text-sm">{watch('secondaryColor')}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    {language === 'pt' ? 'Cor de Destaque' : 
                     language === 'es' ? 'Color de Acento' : 'Accent Color'}
                  </label>
                  <div 
                    className="h-10 rounded border cursor-pointer flex items-center p-2"
                    style={{ backgroundColor: watch('accentColor') }}
                    onClick={() => handleColorPickerOpen('accentColor')}
                  >
                    <span className="ml-2 text-sm">{watch('accentColor')}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    {language === 'pt' ? 'Cor do Texto' : 
                     language === 'es' ? 'Color del Texto' : 'Text Color'}
                  </label>
                  <div 
                    className="h-10 rounded border cursor-pointer flex items-center p-2"
                    style={{ backgroundColor: watch('textColor') }}
                    onClick={() => handleColorPickerOpen('textColor')}
                  >
                    <span className="ml-2 text-sm">{watch('textColor')}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">
                    {language === 'pt' ? 'Cor de Fundo' : 
                     language === 'es' ? 'Color de Fondo' : 'Background Color'}
                  </label>
                  <div 
                    className="h-10 rounded border cursor-pointer flex items-center p-2"
                    style={{ backgroundColor: watch('backgroundColor') }}
                    onClick={() => handleColorPickerOpen('backgroundColor')}
                  >
                    <span className="ml-2 text-sm">{watch('backgroundColor')}</span>
                  </div>
                </div>
              </div>

              {isColorPickerOpen.value && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-4 rounded-lg shadow-lg w-96">
                    <ColorPicker 
                      currentColor={watch(activeColorField as any)} 
                      onColorSelect={handleColorSelect}
                      onClose={() => setIsColorPickerOpen({ value: false, selectedOptions: [] })}
                    />
                  </div>
                </div>
              )}
            </section>

            <section>
              <h3 className="text-xl font-semibold mb-4">
                {language === 'pt' ? 'Outras Especificações UX/UI' : 
                 language === 'es' ? 'Otras Especificaciones UX/UI' : 'Other UX/UI Requirements'}
              </h3>
              <textarea
                {...register('otherUXUIRequirements')}
                className="w-full h-24 p-2 border rounded focus:border-blue-500 focus:ring focus:ring-blue-200"
                placeholder={
                  language === 'pt' ? 'Descreva outras necessidades de UX/UI...' : 
                  language === 'es' ? 'Describa otras necesidades de UX/UI...' : 
                  'Describe other UX/UI requirements...'
                }
              ></textarea>
            </section>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={onPrev}
                className="px-4 py-2 border border-gray-300 rounded shadow-sm bg-white text-gray-700 hover:bg-gray-50"
              >
                {language === 'pt' ? 'Anterior' : 
                 language === 'es' ? 'Anterior' : 'Previous'}
              </button>
              <div className="space-x-2">
                {!isFinalized && (
                  <button
                    type="button"
                    onClick={markAsFinalized}
                    className="px-4 py-2 border border-transparent rounded shadow-sm bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    {language === 'pt' ? 'Finalizar' : 
                      language === 'es' ? 'Finalizar' : 'Finalize'}
                  </button>
                )}
                {isFinalized && (
                  <button
                    type="button"
                    onClick={resetStep}
                    className="px-4 py-2 border border-transparent rounded shadow-sm bg-amber-600 text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  >
                    {language === 'pt' ? 'Resetar' : 
                      language === 'es' ? 'Reiniciar' : 'Reset'}
                  </button>
                )}
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded shadow-sm bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {language === 'pt' ? 'Próximo' : 
                   language === 'es' ? 'Siguiente' : 'Next'}
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <div className="w-full md:w-80 flex-shrink-0">
          <AIAssistantPanel 
            prompt={getFaqPrompt()}
            contextData={{ formValues: watch() }}
            title={language === 'pt' ? 'Assistente de UX/UI' : 
                  language === 'es' ? 'Asistente de UX/UI' : 'UX/UI Assistant'}
          />
        </div>
      </div>
    </div>
  );
};

export default UXUIStep;
