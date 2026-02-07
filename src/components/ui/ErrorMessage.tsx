import { AlertCircle } from "lucide-react";

export const ErrorMessage = ({ error }: { error?: string }) => {
  if (!error) return null;
  return (
    <div className="flex items-start gap-2 mt-1.5 text-red-500 dark:text-red-400">
      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
      <span className="text-xs font-medium">{error}</span>
    </div>
  );
};
