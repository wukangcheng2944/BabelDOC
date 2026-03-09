import { motion } from "framer-motion";
import { Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";

interface TranslateButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
  hint?: string;
}

export function TranslateButton({
  onClick,
  disabled,
  loading,
  hint,
}: TranslateButtonProps) {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        onClick={onClick}
        disabled={disabled || loading}
        size="lg"
        className="w-full gap-2 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20 transition-all duration-200 h-12 text-base font-medium"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            {t("translate.translating")}
          </>
        ) : (
          <>
            <Play className="h-5 w-5" />
            {t("translate.start")}
          </>
        )}
      </Button>
      {hint && !loading && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {hint}
        </p>
      )}
    </motion.div>
  );
}
