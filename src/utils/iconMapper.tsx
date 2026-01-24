import React from "react";
import {
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  Building,
  MapPin,
  Map,
  Hash,
  Globe,
  AtSign,
  Briefcase,
  Award,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Save,
  X,
} from "lucide-react";

const iconComponents: Record<string, React.ComponentType<{ className?: string }>> = {
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  Building,
  MapPin,
  Map,
  Hash,
  Globe,
  AtSign,
  Briefcase,
  Award,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  Save,
  X,
};

export function getIcon(iconName: string | undefined, className: string = "h-5 w-5"): React.ReactNode {
  if (!iconName) return null;

  const IconComponent = iconComponents[iconName];
  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found`);
    return null;
  }

  return <IconComponent className={className} />;
}