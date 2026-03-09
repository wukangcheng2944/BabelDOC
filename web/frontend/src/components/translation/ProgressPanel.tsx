import { motion } from "framer-motion";
import { Loader2, XCircle, Upload } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import type { TranslationTask } from "@/types/config";

interface ProgressPanelProps {
  task: TranslationTask;
  onCancel: () => void;
}

export function ProgressPanel({ task, onCancel }: ProgressPanelProps) {
  const { t } = useI18n();

  if (task.status !== "uploading" && task.status !== "translating") {
    return null;
  }

  const isUploading = task.status === "uploading";

  const displayStage = task.stage
    ? t(`stages.${task.stage}`) !== `stages.${task.stage}`
      ? t(`stages.${task.stage}`)
      : task.stage
    : "";

  const progressValue = Math.min(Math.max(task.progress, 0), 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-primary/20 bg-primary/5 p-6"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isUploading ? (
              <Upload className="h-4 w-4 animate-pulse text-primary" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            )}
            <h3 className="text-sm font-semibold text-foreground">
              {isUploading ? t("translate.uploading") : t("translate.progress")}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="gap-1.5 text-muted-foreground hover:text-destructive"
          >
            <XCircle className="h-4 w-4" />
            {t("translate.cancel")}
          </Button>
        </div>

        {isUploading ? (
          <div className="space-y-2">
            <Progress className="h-2 [&>div]:animate-[indeterminate_1.5s_ease-in-out_infinite]" />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">
                  {t("translate.overall")}: {progressValue.toFixed(1)}%
                </span>
                {task.totalParts > 1 && (
                  <span className="text-xs text-muted-foreground">
                    {t("translate.part")
                      .replace("{current}", String(task.partIndex))
                      .replace("{total}", String(task.totalParts))}
                  </span>
                )}
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>

            {displayStage && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {t("translate.stage")}: {displayStage}
                </span>
                {task.stageTotal > 0 && (
                  <span>
                    {task.stageCurrent} / {task.stageTotal}
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
