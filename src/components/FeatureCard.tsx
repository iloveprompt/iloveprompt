
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon,
  delay = ''
}) => {
  return (
    <Card className={`slide-in ${delay} bg-white hover:shadow-md transition-all duration-300 border border-gray-100`}>
      <CardContent className="p-6">
        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-brand-100 p-2 text-brand-600">
          {icon}
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
