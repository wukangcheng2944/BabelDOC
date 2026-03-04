import { motion } from "framer-motion";
import { Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/hooks/use-i18n";

interface TranslateButtonProps {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}

export function TranslateButton({
  onClick,
  disabled,
  loading,
}: TranslateButtonProps) {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7 }}
    >
      <Button
        onClick={onClick}
        disabled={disabled || loading}
        size="lg"
        className="w-full gap-2 bg-blue-600 text-white hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 h-12 text-base font-medium"
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
    </motion.div>
  );
}
