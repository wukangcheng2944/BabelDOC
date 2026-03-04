import { motion } from "framer-motion";
import {
  FileText,
  Languages,
  BookOpen,
  Library,
  FileOutput,
  Settings2,
  ScanLine,
  Gauge,
  Wrench,
} from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  icon: React.ElementType;
  labelKey: string;
}

const navItems: NavItem[] = [
  { id: "file", icon: FileText, labelKey: "nav.file" },
  { id: "service", icon: Languages, labelKey: "nav.translation" },
  { id: "term-extraction", icon: BookOpen, labelKey: "nav.termExtraction" },
  { id: "glossary", icon: Library, labelKey: "nav.glossary" },
  { id: "output", icon: FileOutput, labelKey: "nav.output" },
  { id: "processing", icon: Settings2, labelKey: "nav.processing" },
  { id: "ocr", icon: ScanLine, labelKey: "nav.ocr" },
  { id: "performance", icon: Gauge, labelKey: "nav.performance" },
  { id: "advanced", icon: Wrench, labelKey: "nav.advanced" },
];

interface SidebarProps {
  activeSection?: string;
  onNavigate: (sectionId: string) => void;
}

export function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  const { t } = useI18n();

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-56 shrink-0 border-r border-gray-100 bg-white lg:block">
      <nav className="flex flex-col gap-1 p-3 pt-4">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-slate-500 hover:bg-gray-50 hover:text-slate-700"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{t(item.labelKey)}</span>
            </motion.button>
          );
        })}
      </nav>
    </aside>
  );
}
