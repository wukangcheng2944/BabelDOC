import { Gauge } from "lucide-react";
import { BentoCard } from "@/components/shared/BentoCard";
import { ParamRow } from "@/components/shared/ParamRow";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useI18n } from "@/hooks/use-i18n";
import { useConfig } from "@/hooks/use-config";

export function PerformanceSection() {
  const { t } = useI18n();
  const { config, setField } = useConfig();

  return (
    <BentoCard>
      <div className="flex items-center gap-2 mb-3">
        <Gauge className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">{t("performance.title")}</h3>
      </div>
      <div className="space-y-3">
        <ParamRow label={t("performance.qps")} tooltip={t("performance.qpsDesc")}>
          <div className="flex items-center gap-3 w-48">
            <Slider
              value={[config.qps]}
              onValueChange={([v]) => setField("qps", v)}
              min={1}
              max={20}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-8 text-right font-mono">
              {config.qps}
            </span>
          </div>
        </ParamRow>

        <ParamRow
          label={t("performance.poolMaxWorkers")}
          tooltip={t("performance.poolMaxWorkersDesc")}
        >
          <Input
            type="number"
            value={config.poolMaxWorkers ?? ""}
            onChange={(e) =>
              setField(
                "poolMaxWorkers",
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            placeholder={String(config.qps)}
            className="w-20 text-center"
            min={1}
            max={50}
          />
        </ParamRow>

        <ParamRow
          label={t("performance.termPoolMaxWorkers")}
          tooltip={t("performance.termPoolMaxWorkersDesc")}
        >
          <Input
            type="number"
            value={config.termPoolMaxWorkers ?? ""}
            onChange={(e) =>
              setField(
                "termPoolMaxWorkers",
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            placeholder={String(config.poolMaxWorkers ?? config.qps)}
            className="w-20 text-center"
            min={1}
            max={50}
          />
        </ParamRow>

        <ParamRow
          label={t("performance.maxPagesPerPart")}
          tooltip={t("performance.maxPagesPerPartDesc")}
        >
          <Input
            type="number"
            value={config.maxPagesPerPart ?? ""}
            onChange={(e) =>
              setField(
                "maxPagesPerPart",
                e.target.value ? parseInt(e.target.value) : null
              )
            }
            placeholder="--"
            className="w-20 text-center"
            min={1}
          />
        </ParamRow>

        <ParamRow
          label={t("performance.reportInterval")}
          tooltip={t("performance.reportIntervalDesc")}
        >
          <Input
            type="number"
            value={config.reportInterval}
            onChange={(e) =>
              setField("reportInterval", parseFloat(e.target.value) || 0.1)
            }
            className="w-20 text-center"
            min={0.01}
            max={10}
            step={0.1}
          />
        </ParamRow>
      </div>
    </BentoCard>
  );
}
