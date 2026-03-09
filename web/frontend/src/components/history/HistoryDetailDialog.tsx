import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { StatusBadge } from "./StatusBadge";
import type { TaskHistoryEntry } from "@/types/config";

interface HistoryDetailDialogProps {
  entry: TaskHistoryEntry;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HistoryDetailDialog({
  entry,
  open,
  onOpenChange,
}: HistoryDetailDialogProps) {
  const { t } = useI18n();

  const formatTokenK = (n: number | null) => {
    if (n == null) return "--";
    return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("history.detail.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">{t("history.detail.taskId")}</p>
              <p className="font-mono">{entry.taskId}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("history.status")}</p>
              <StatusBadge status={entry.status} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("history.detail.file")}</p>
              <p className="font-medium truncate">{entry.filename}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("history.detail.model")}</p>
              <p className="text-xs">{entry.model}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("history.detail.language")}</p>
              <p>{entry.langIn} → {entry.langOut}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t("history.detail.startTime")}</p>
              <p className="text-xs">{entry.startedAt ? new Date(entry.startedAt).toLocaleString() : "--"}</p>
            </div>
          </div>

          {/* Resource Usage */}
          {entry.status === "completed" && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {t("history.detail.resource")}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {entry.totalSeconds != null && (
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-[10px] text-muted-foreground">{t("resource.duration")}</p>
                    <p className="text-sm font-medium tabular-nums">{entry.totalSeconds.toFixed(1)}s</p>
                  </div>
                )}
                {entry.peakMemoryUsage != null && (
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-[10px] text-muted-foreground">{t("resource.peakMemory")}</p>
                    <p className="text-sm font-medium tabular-nums">
                      {(entry.peakMemoryUsage / (1024 * 1024 * 1024)).toFixed(2)} GB
                    </p>
                  </div>
                )}
                {entry.characterCount != null && (
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-[10px] text-muted-foreground">{t("resource.characters")}</p>
                    <p className="text-sm font-medium tabular-nums">{entry.characterCount.toLocaleString()}</p>
                  </div>
                )}
                {entry.promptTokenCount != null && (
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-[10px] text-muted-foreground">{t("resource.promptTokens")}</p>
                    <p className="text-sm font-medium tabular-nums">{formatTokenK(entry.promptTokenCount)}</p>
                  </div>
                )}
                {entry.completionTokenCount != null && (
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-[10px] text-muted-foreground">{t("resource.completionTokens")}</p>
                    <p className="text-sm font-medium tabular-nums">{formatTokenK(entry.completionTokenCount)}</p>
                  </div>
                )}
                {entry.cacheHitTokenCount != null && entry.cacheHitTokenCount > 0 && (
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-[10px] text-muted-foreground">{t("resource.cacheHit")}</p>
                    <p className="text-sm font-medium tabular-nums">{formatTokenK(entry.cacheHitTokenCount)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Error */}
          {entry.error && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">
                {t("history.detail.error")}
              </p>
              <pre className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive overflow-x-auto whitespace-pre-wrap">
                {entry.error}
              </pre>
            </div>
          )}

          {/* Downloads */}
          {entry.status === "completed" && (entry.dualPdfUrl || entry.monoPdfUrl || entry.glossaryUrl) && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {t("history.detail.downloads")}
              </p>
              <div className="flex flex-wrap gap-2">
                {entry.dualPdfUrl && (
                  <Button size="sm" className="gap-2" asChild>
                    <a href={entry.dualPdfUrl} download>
                      <Download className="h-4 w-4" />
                      {t("result.downloadDual")}
                    </a>
                  </Button>
                )}
                {entry.monoPdfUrl && (
                  <Button size="sm" variant="outline" className="gap-2" asChild>
                    <a href={entry.monoPdfUrl} download>
                      <Download className="h-4 w-4" />
                      {t("result.downloadMono")}
                    </a>
                  </Button>
                )}
                {entry.glossaryUrl && (
                  <Button size="sm" variant="outline" className="gap-2" asChild>
                    <a href={entry.glossaryUrl} download>
                      <FileSpreadsheet className="h-4 w-4" />
                      {t("result.downloadGlossary")}
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
