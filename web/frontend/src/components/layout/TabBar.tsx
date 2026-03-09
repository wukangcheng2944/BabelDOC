import { motion, AnimatePresence } from "framer-motion";
import { Languages, History } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export type TabId = "translate" | "history";

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; icon: React.ElementType; labelKey: string }[] = [
  { id: "translate", icon: Languages, labelKey: "tabs.translate" },
  { id: "history", icon: History, labelKey: "tabs.history" },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const { t } = useI18n();

  return (
    <div className="flex justify-center py-4">
      <div className="flex items-center gap-1 rounded-full border border-border/50 bg-background/60 p-1 backdrop-blur-md">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="tab-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <Icon className="relative z-10 h-4 w-4" />
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.span
                    key={tab.id}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="relative z-10 overflow-hidden whitespace-nowrap"
                  >
                    {t(tab.labelKey)}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </div>
    </div>
  );
}
