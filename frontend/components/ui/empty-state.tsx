import { LucideIcon } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  ctaText?: string;
  ctaAction?: () => void;
}

export function EmptyState({ icon: Icon, title, description, ctaText, ctaAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <Icon className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-4">{description}</p>
      )}
      {ctaText && ctaAction && (
        <Button onClick={ctaAction} variant="outline">
          {ctaText}
        </Button>
      )}
    </div>
  );
} 