
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactElement;
  delay?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon,
  delay = ''
}) => {
  return (
    <Card className={`slide-in ${delay} group relative bg-darkBg/80 backdrop-blur-md rounded-xl border border-electricBlue/20 hover:border-neonPurple transition-all duration-300 shadow-xl hover:shadow-neonPurple/30 hover-glow`}>
      <CardContent className="p-6">
        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-electricBlue/10 p-3 text-electricBlue backdrop-blur-sm border border-electricBlue/20">
          {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "h-6 w-6" }) : icon}
        </div>
        <h3 className="mb-2 text-xl font-semibold text-pureWhite">{title}</h3>
        <p className="text-base text-pureWhite/90">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
