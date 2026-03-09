import { Sparkles } from "lucide-react";
import { BentoCard } from "@/components/shared/BentoCard";
import { useI18n } from "@/hooks/use-i18n";
import { useConfig } from "@/hooks/use-config";
import { useTokenEstimate } from "@/hooks/use-token-estimate";

interface TokenEstimateCardProps {
  file: File | null;
}

export function TokenEstimateCard({ file }: TokenEstimateCardProps) {
  const { t } = useI18n();
  const { config } = useConfig();
  const { estimate, loading } = useTokenEstimate(file, config.openaiModel);

  const formatTokenK = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);

  return (
    <BentoCard className="h-full">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">{t("estimate.title")}</h3>
      </div>

      {!file ? (
        <p className="text-xs text-muted-foreground">{t("estimate.empty")}</p>
      ) : loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-1">
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              <div className="h-5 w-24 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : estimate ? (
        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-muted-foreground">{t("estimate.model")}</p>
            <p className="text-sm font-medium truncate">{estimate.model}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">{t("estimate.pages")}</p>
            <p className="text-sm font-mono font-medium">{estimate.pageCount}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">{t("estimate.tokens")}</p>
            <p className="text-sm font-mono font-medium">{formatTokenK(estimate.estimatedTokens)}</p>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">{t("estimate.cost")}</p>
            <p className="text-sm font-mono font-medium">
              {estimate.estimatedCostUsd != null
                ? `$${estimate.estimatedCostUsd.toFixed(4)}`
                : t("estimate.na")}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">{t("estimate.empty")}</p>
      )}
    </BentoCard>
  );
}
