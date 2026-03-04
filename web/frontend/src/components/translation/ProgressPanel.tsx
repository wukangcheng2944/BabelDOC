import { motion } from "framer-motion";
import { Loader2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import type { TranslationTask } from "@/types/config";

interface ProgressPanelProps {
  task: TranslationTask;
  onCancel: () => void;
}

const stageNames: Record<string, { zh: string; en: string }> = {
  "Parse PDF and Create IR": { zh: "解析 PDF", en: "Parsing PDF" },
  "Detect scanned file": { zh: "检测扫描文件", en: "Detecting scanned file" },
  "Parse page layout": { zh: "解析页面布局", en: "Parsing page layout" },
  "Parse tables": { zh: "解析表格", en: "Parsing tables" },
  "Parse paragraphs": { zh: "解析段落", en: "Parsing paragraphs" },
  "Parse formulas and styles": { zh: "解析公式和样式", en: "Parsing formulas & styles" },
  "Extract terms": { zh: "提取术语", en: "Extracting terms" },
  "Translate paragraphs": { zh: "翻译段落", en: "Translating paragraphs" },
  "Typesetting": { zh: "排版", en: "Typesetting" },
  "Add fonts": { zh: "添加字体", en: "Adding fonts" },
  "Generate drawing instructions": { zh: "生成绘制指令", en: "Generating drawings" },
  "Subset font": { zh: "子集化字体", en: "Subsetting fonts" },
  "Save PDF": { zh: "保存 PDF", en: "Saving PDF" },
};

export function ProgressPanel({ task, onCancel }: ProgressPanelProps) {
  const { t, locale } = useI18n();

  if (task.status !== "uploading" && task.status !== "translating") {
    return null;
  }

  const stageName = stageNames[task.stage];
  const displayStage = stageName
    ? locale === "zh"
      ? stageName.zh
      : stageName.en
    : task.stage;

  const progressValue = Math.min(Math.max(task.progress, 0), 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-blue-100 bg-blue-50/30 p-6"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              {t("translate.progress")}
            </h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="gap-1.5 text-slate-500 hover:text-red-600"
          >
            <XCircle className="h-4 w-4" />
            {t("translate.cancel")}
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">
              {t("translate.overall")}: {progressValue.toFixed(1)}%
            </span>
            {task.totalParts > 1 && (
              <span className="text-xs text-slate-400">
                {t("translate.part")
                  .replace("{current}", String(task.partIndex))
                  .replace("{total}", String(task.totalParts))}
              </span>
            )}
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        {displayStage && (
          <div className="flex items-center justify-between text-xs text-slate-500">
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
      </div>
    </motion.div>
  );
}
