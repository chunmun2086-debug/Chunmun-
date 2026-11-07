import React from 'react';
import {
  Zap,
  Wrench,
  Wind,
  Sparkles,
  Paintbrush,
  Home,
  Hammer,
  Disc,
  Flame,
  Droplets,
  ShieldCheck,
  Utensils,
  Armchair,
  Tv,
  Video,
  BatteryCharging,
  Building,
  Umbrella,
  Key,
  Layers,
  Flower2,
  Truck,
  Refrigerator
} from 'lucide-react';

interface ServiceIconProps {
  name: string;
  className?: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Zap':
      return <Zap className={className} />;
    case 'Wrench':
      return <Wrench className={className} />;
    case 'Wind':
      return <Wind className={className} />;
    case 'Sparkles':
    case 'Sparkle':
      return <Sparkles className={className} />;
    case 'Paintbrush':
      return <Paintbrush className={className} />;
    case 'Home':
      return <Home className={className} />;
    case 'Hammer':
      return <Hammer className={className} />;
    case 'Refrigerator':
      return <Refrigerator className={className} />;
    case 'Disc':
      return <Disc className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Droplets':
      return <Droplets className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'Utensils':
      return <Utensils className={className} />;
    case 'Armchair':
      return <Armchair className={className} />;
    case 'Tv':
      return <Tv className={className} />;
    case 'Video':
      return <Video className={className} />;
    case 'BatteryCharging':
      return <BatteryCharging className={className} />;
    case 'Building':
      return <Building className={className} />;
    case 'Umbrella':
      return <Umbrella className={className} />;
    case 'Key':
      return <Key className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'Flower2':
      return <Flower2 className={className} />;
    case 'Truck':
      return <Truck className={className} />;
    default:
      return <Wrench className={className} />;
  }
};
