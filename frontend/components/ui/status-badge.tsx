import { BookOpen, CheckCircle, Clock, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: 'READING' | 'READ' | 'WILL_READ' | 'DROPPED' | null;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  if (!status) return null;

  const statusConfig = {
    READING: {
      icon: BookOpen,
      bgColor: "bg-blue-500",
      textColor: "text-white",
      label: "Okuyor"
    },
    READ: {
      icon: CheckCircle,
      bgColor: "bg-green-500",
      textColor: "text-white",
      label: "Okundu"
    },
    WILL_READ: {
      icon: Clock,
      bgColor: "bg-purple-500",
      textColor: "text-white",
      label: "Okunacak"
    },
    DROPPED: {
      icon: XCircle,
      bgColor: "bg-red-500",
      textColor: "text-white",
      label: "Yarım Bırakıldı"
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`absolute top-2 left-2 ${config.bgColor} ${config.textColor} px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1`}>
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </div>
  );
}; 