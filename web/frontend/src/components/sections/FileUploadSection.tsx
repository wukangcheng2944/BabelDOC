import { FileText, ArrowRight } from "lucide-react";
import { BentoCard } from "@/components/shared/BentoCard";
import { FileDropZone } from "@/components/shared/FileDropZone";
import { LanguageCombobox } from "@/components/shared/LanguageCombobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/hooks/use-i18n";
import { useConfig } from "@/hooks/use-config";

interface FileUploadSectionProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
}

export function FileUploadSection({
  file,
  onFileSelect,
  onFileRemove,
}: FileUploadSectionProps) {
  const { t } = useI18n();
  const { config, setField } = useConfig();

  return (
    <BentoCard>
      <div className="flex items-center gap-2 mb-4">
        <FileText className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">{t("file.title")}</h3>
      </div>
      <div className="space-y-5">
        <FileDropZone
          accept=".pdf"
          onFileSelect={onFileSelect}
          selectedFile={file}
          onRemove={onFileRemove}
          label={t("file.upload")}
          hint={t("file.uploadHint")}
        />

        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs text-muted-foreground">{t("file.langIn")}</Label>
            <LanguageCombobox
              value={config.langIn}
              onChange={(v) => setField("langIn", v)}
            />
          </div>
          <ArrowRight className="mt-5 h-4 w-4 shrink-0 text-muted-foreground/50" />
          <div className="flex-1 space-y-1.5">
            <Label className="text-xs text-muted-foreground">{t("file.langOut")}</Label>
            <LanguageCombobox
              value={config.langOut}
              onChange={(v) => setField("langOut", v)}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">{t("file.pages")}</Label>
          <Input
            value={config.pages}
            onChange={(e) => setField("pages", e.target.value)}
            placeholder={t("file.pagesPlaceholder")}
            className="font-mono text-sm"
          />
        </div>
      </div>
    </BentoCard>
  );
}
