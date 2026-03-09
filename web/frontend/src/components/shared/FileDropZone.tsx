import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

const MAX_FILE_SIZE = 200 * 1024 * 1024; // 200MB

interface FileDropZoneProps {
  accept?: string;
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onRemove: () => void;
  label: string;
  hint: string;
}

export function FileDropZone({
  accept = ".pdf",
  onFileSelect,
  selectedFile,
  onRemove,
  label,
  hint,
}: FileDropZoneProps) {
  const { t } = useI18n();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): boolean => {
      const ext = file.name.toLowerCase().split(".").pop();
      if (ext !== "pdf") {
        setError(t("file.invalidType"));
        return false;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(t("file.tooLarge"));
        return false;
      }
      setError(null);
      return true;
    },
    [t]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && validateFile(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect, validateFile]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && validateFile(file)) {
        onFileSelect(file);
      }
    },
    [onFileSelect, validateFile]
  );

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200",
          isDragging
            ? "border-primary bg-primary/10"
            : error
              ? "border-destructive/50 bg-destructive/5"
              : "border-border bg-muted/30 hover:border-muted-foreground/30 hover:bg-muted/50"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
        <motion.div
          animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
          className="flex flex-col items-center gap-3"
        >
          <div
            className={cn(
              "rounded-full p-3 transition-colors",
              isDragging ? "bg-primary/20" : "bg-muted"
            )}
          >
            <Upload
              className={cn(
                "h-6 w-6 transition-colors",
                isDragging ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {error && !selectedFile && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/50 p-3">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
