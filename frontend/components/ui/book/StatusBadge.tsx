import { BookOpen, CheckCircle, Clock, XCircle } from 'lucide-react';
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: 'READING' | 'READ' | 'WILL_READ' | 'DROPPED' | null;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  if (!status) return null;

  const badges = {
    'READ': {
      icon: CheckCircle,
      className: 'bg-emerald-500/10 text-emerald-500'
    },
    'READING': {
      icon: BookOpen,
      className: 'bg-blue-500/10 text-blue-500'
    },
    'WILL_READ': {
      icon: Clock,
      className: 'bg-amber-500/10 text-amber-500'
    },
    'DROPPED': {
      icon: XCircle,
      className: 'bg-rose-500/10 text-rose-500'
    }
  };

  const BadgeIcon = badges[status].icon;

  return (
    <div className={cn(
      "absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm",
      badges[status].className,
      className
    )}>
      <BadgeIcon size={16} />
    </div>
  );
};

export default StatusBadge; 