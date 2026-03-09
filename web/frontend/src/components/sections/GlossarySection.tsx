import { useState, useCallback, useRef } from "react";
import { Library, Upload, X, FileSpreadsheet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { BentoCard } from "@/components/shared/BentoCard";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { uploadGlossary } from "@/lib/api";

interface GlossaryFile {
  id: string;
  name: string;
  size: number;
}

interface GlossarySectionProps {
  glossaryFiles: GlossaryFile[];
  onGlossaryAdd: (file: GlossaryFile) => void;
  onGlossaryRemove: (id: string) => void;
}

export function GlossarySection({
  glossaryFiles,
  onGlossaryAdd,
  onGlossaryRemove,
}: GlossarySectionProps) {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      try {
        const { fileId } = await uploadGlossary(file);
        onGlossaryAdd({ id: fileId, name: file.name, size: file.size });
      } catch (err) {
        toast.error(t("glossary.uploadError"), {
          description: err instanceof Error ? err.message : undefined,
        });
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [onGlossaryAdd, t]
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <BentoCard className="h-full">
      <div className="flex items-center gap-2 mb-2">
        <Library className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold">{t("glossary.title")}</h3>
      </div>
      <div className="space-y-2">
        <div>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            {uploading ? t("glossary.uploading") : t("glossary.upload")}
          </Button>
          <p className="mt-1 text-xs text-muted-foreground">{t("glossary.uploadHint")}</p>
        </div>

        {glossaryFiles.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("glossary.empty")}</p>
        ) : (
          <div className="space-y-2">
            <AnimatePresence>
              {glossaryFiles.map((gf) => (
                <motion.div
                  key={gf.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/30 p-2.5"
                >
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-foreground">{gf.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatSize(gf.size)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => onGlossaryRemove(gf.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </BentoCard>
  );
}
