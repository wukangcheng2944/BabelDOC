import { Globe, Github, Upload, Download, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/hooks/use-i18n";
import { useTheme } from "@/hooks/use-theme";

interface HeaderProps {
  onImport?: () => void;
  onExport?: () => void;
}

export function Header({ onImport, onExport }: HeaderProps) {
  const { locale, setLocale, t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="K3 DocTranslate" className="h-8 w-8 rounded-lg" />
          <div>
            <h1 className="text-base font-semibold tracking-tight text-foreground">
              K3 DocTranslate
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex gap-2 text-muted-foreground hover:text-foreground"
            onClick={onImport}
          >
            <Upload className="h-4 w-4" />
            <span className="hidden md:inline">{t("header.importConfig")}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex gap-2 text-muted-foreground hover:text-foreground"
            onClick={onExport}
          >
            <Download className="h-4 w-4" />
            <span className="hidden md:inline">{t("header.exportConfig")}</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <Globe className="h-4 w-4" />
                {locale === "zh" ? "中文" : "English"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLocale("zh")}>
                中文
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocale("en")}>
                English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={toggleTheme}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            asChild
          >
            <a
              href="https://github.com/funstory-ai/BabelDOC"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
