
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

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
  return (
    <div 
      className={`rounded-2xl p-6 shadow-lg transition-all duration-300 hover:translate-y-[-4px] hover:shadow-xl
        ${popular ? 'border-2 border-brand-500 bg-white' : 'border border-gray-200 bg-white'}`}
    >
      {popular && (
        <div className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-800 mb-4">
          Most Popular
        </div>
      )}
      
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <div className="mt-4 flex items-baseline">
        <span className="text-4xl font-bold tracking-tight text-gray-900">{price}</span>
        <span className="ml-1 text-sm font-semibold text-gray-500">/month</span>
      </div>
      
      <p className="mt-2 text-sm text-gray-500">{description}</p>
      
      <ul className="mt-6 space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check 
              className={`mr-2 h-5 w-5 flex-shrink-0 ${
                feature.included ? 'text-brand-500' : 'text-gray-300'
              }`}
            />
            <span className={feature.included ? 'text-gray-600' : 'text-gray-400'}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
      
      {apiOption && (
        <div className="mt-6 bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
          <p className="font-medium mb-1">Save 20% on this plan</p>
          <p>Use your own API keys and get 20% off the subscription price</p>
        </div>
      )}
      
      <div className="mt-8">
        <Button 
          className={`w-full ${
            popular 
              ? 'bg-brand-600 hover:bg-brand-700 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
          }`}
        >
          {ctaText}
        </Button>
      </div>
    </div>
  );
};

export default PricingCard;
