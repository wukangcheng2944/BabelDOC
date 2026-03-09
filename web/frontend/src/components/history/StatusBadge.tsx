import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/hooks/use-i18n";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { t } = useI18n();

  switch (status) {
    case "completed":
      return (
        <Badge className="bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20">
          {t("history.completed")}
        </Badge>
      );
    case "failed":
      return (
        <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20">
          {t("history.failed")}
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20">
          {t("history.cancelled")}
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
