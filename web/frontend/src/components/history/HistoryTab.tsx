import { useState } from "react";
import { Search, Calendar } from "lucide-react";
import { BentoCard } from "@/components/shared/BentoCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/hooks/use-i18n";
import { useHistory } from "@/hooks/use-history";
import { StatusBadge } from "./StatusBadge";
import { HistoryDetailDialog } from "./HistoryDetailDialog";
import type { TaskHistoryEntry } from "@/types/config";

export function HistoryTab() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(0);
  const [selectedEntry, setSelectedEntry] = useState<TaskHistoryEntry | null>(null);

  const { data, loading } = useHistory({
    search,
    status: statusFilter === "all" ? undefined : statusFilter,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    offset: page * 20,
    limit: 20,
  });

  const totalPages = data ? Math.ceil(data.total / 20) : 0;

  const formatDuration = (s: number | null) => {
    if (s == null) return "--";
    return `${s.toFixed(1)}s`;
  };

  const formatTokenK = (n: number | null) => {
    if (n == null) return "--";
    return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <BentoCard>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder={t("history.search")}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("history.allStatus")}</SelectItem>
              <SelectItem value="completed">{t("history.completed")}</SelectItem>
              <SelectItem value="failed">{t("history.failed")}</SelectItem>
              <SelectItem value="cancelled">{t("history.cancelled")}</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
              className="w-36"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(0); }}
              className="w-36"
            />
          </div>
        </div>
      </BentoCard>

      {/* Desktop Table */}
      <BentoCard className="hidden md:block">
        {loading ? (
          <div className="space-y-3 py-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="h-5 flex-1 animate-pulse rounded bg-muted" />
                ))}
              </div>
            ))}
          </div>
        ) : !data || data.items.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {t("history.empty")}
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 text-muted-foreground">
                    <th className="py-3 pr-4 text-left font-medium">{t("history.filename")}</th>
                    <th className="py-3 pr-4 text-left font-medium">{t("history.status")}</th>
                    <th className="py-3 pr-4 text-left font-medium">{t("history.model")}</th>
                    <th className="py-3 pr-4 text-left font-medium">{t("history.language")}</th>
                    <th className="py-3 pr-4 text-right font-medium">{t("history.tokens")}</th>
                    <th className="py-3 pr-4 text-right font-medium">{t("history.duration")}</th>
                    <th className="py-3 text-right font-medium">{t("history.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((entry) => (
                    <tr key={entry.taskId} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                      <td className="py-3 pr-4">
                        <span className="font-medium truncate max-w-[200px] block">{entry.filename}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={entry.status} />
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground font-mono text-xs">
                        {entry.model}
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground text-xs">
                        {entry.langIn} → {entry.langOut}
                      </td>
                      <td className="py-3 pr-4 text-right font-mono text-xs">
                        {formatTokenK(entry.tokenCount)}
                      </td>
                      <td className="py-3 pr-4 text-right font-mono text-xs">
                        {formatDuration(entry.totalSeconds)}
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEntry(entry)}
                        >
                          {t("history.viewDetail")}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between pt-4 text-xs text-muted-foreground">
              <span>
                {t("history.showing")
                  .replace("{start}", String(page * 20 + 1))
                  .replace("{end}", String(Math.min((page + 1) * 20, data.total)))
                  .replace("{total}", String(data.total))}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  &lt;
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                  <Button
                    key={i}
                    variant={page === i ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  &gt;
                </Button>
              </div>
            </div>
          </>
        )}
      </BentoCard>

      {/* Mobile Card List */}
      <div className="space-y-3 md:hidden">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <BentoCard key={i}>
                <div className="h-16 animate-pulse rounded bg-muted" />
              </BentoCard>
            ))}
          </div>
        ) : !data || data.items.length === 0 ? (
          <BentoCard>
            <p className="py-8 text-center text-sm text-muted-foreground">
              {t("history.empty")}
            </p>
          </BentoCard>
        ) : (
          data.items.map((entry) => (
            <BentoCard key={entry.taskId}>
              <div className="flex items-center justify-between">
                <div className="space-y-1 min-w-0">
                  <p className="text-sm font-medium truncate">{entry.filename}</p>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={entry.status} />
                    <span className="text-xs text-muted-foreground font-mono">{entry.model}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEntry(entry)}
                >
                  {t("history.viewDetail")}
                </Button>
              </div>
            </BentoCard>
          ))
        )}
      </div>

      {selectedEntry && (
        <HistoryDetailDialog
          entry={selectedEntry}
          open={!!selectedEntry}
          onOpenChange={(open) => !open && setSelectedEntry(null)}
        />
      )}
    </div>
  );
}
