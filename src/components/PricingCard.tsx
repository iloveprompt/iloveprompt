import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Feature {
  text: string;
  included: boolean;
}

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: Feature[];
  ctaText: string;
  popular?: boolean;
  apiOption?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  description,
  features,
  ctaText,
  popular = false,
  apiOption = false,
}) => {
  const { t } = useTranslation();
  return (
    <div className={`group relative bg-darkBg/80 backdrop-blur-md rounded-2xl p-8 shadow-xl transition-all duration-300 ${
      popular ? 'border-2 border-neonPink hover:border-aquaGreen shadow-neonPink/20 hover:shadow-aquaGreen/30' : 'border border-electricBlue/30 hover:border-neonPurple hover:shadow-neonPurple/20'
    }`}>
      {popular && (
        <div className="inline-block rounded-full bg-neonPink/20 px-4 py-1.5 text-xs font-bold text-pureWhite mb-4 backdrop-blur-sm border border-neonPink/30">
          {t('pricing.mostPopular')}
        </div>
      )}
      
      <h3 className="text-2xl font-bold text-pureWhite">{title}</h3>
      <div className="mt-4 flex items-baseline">
        <span className="text-4xl font-bold tracking-tight text-electricBlue">{price}</span>
        <span className="ml-1 text-sm font-semibold text-pureWhite/70">{t('pricing.perMonth')}</span>
      </div>
      
      <p className="mt-2 text-sm text-pureWhite/90">{description}</p>
      
      <ul className="mt-6 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check 
              className={`mr-2 h-5 w-5 flex-shrink-0 ${
                feature.included ? 'text-neonPink' : 'text-electricBlue/50'
              }`}
            />
            <span className={feature.included ? 'text-pureWhite' : 'text-gray-400'}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
      
      {apiOption && (
        <div className="mt-6 bg-darkBg/50 rounded-lg p-3 text-sm text-pureWhite/90 border border-electricBlue/20 backdrop-blur-sm">
          <p className="font-medium mb-1 text-neonPurple">{t('pricing.saveDiscount')}</p>
          <p>{t('pricing.apiKeyDiscount')}</p>
        </div>
      )}
      
      <div className="mt-8">
        <Button 
          className={`w-full font-semibold transition-all duration-300 rounded-lg py-3 ${
            popular 
              ? 'bg-neonPink hover:bg-opacity-80 text-pureWhite shadow-lg hover:shadow-neonPink/40' 
              : 'bg-electricBlue/10 hover:bg-electricBlue/20 text-aquaGreen border border-electricBlue/30 hover:border-neonPurple'
          }`}
        >
          {ctaText}
        </Button>
      </div>
    </div>
  );
};

export default PricingCard;
