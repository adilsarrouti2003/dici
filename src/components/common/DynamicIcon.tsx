import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', style }) => {
  const iconsMap = Icons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>;
  const IconComponent = iconsMap[name] || Icons.CheckCircle2;
  return <IconComponent className={className} style={style} />;
};
