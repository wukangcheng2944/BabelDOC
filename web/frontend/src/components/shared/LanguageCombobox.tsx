import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { getSortedLanguages, commonLanguageCodes } from "@/lib/languages";
import { useI18n } from "@/hooks/use-i18n";

interface LanguageComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function LanguageCombobox({
  value,
  onChange,
  placeholder,
}: LanguageComboboxProps) {
  const [open, setOpen] = useState(false);
  const { locale } = useI18n();
  const languages = getSortedLanguages();

  const selectedLang = languages.find(
    (l) => l.code.toLowerCase() === value.toLowerCase()
  );
  const displayValue = selectedLang
    ? locale === "zh"
      ? `${selectedLang.nameZh} (${selectedLang.code})`
      : `${selectedLang.nameEn} (${selectedLang.code})`
    : value || placeholder;

  const commonLangs = languages.filter(
    (l) =>
      commonLanguageCodes.includes(l.code.toLowerCase()) ||
      commonLanguageCodes.includes(l.code)
  );
  const otherLangs = languages.filter(
    (l) =>
      !commonLanguageCodes.includes(l.code.toLowerCase()) &&
      !commonLanguageCodes.includes(l.code)
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">{displayValue}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput
            placeholder={locale === "zh" ? "搜索语言..." : "Search language..."}
          />
          <CommandList>
            <CommandEmpty>
              {locale === "zh" ? "未找到语言" : "No language found"}
            </CommandEmpty>
            <CommandGroup heading={locale === "zh" ? "常用语言" : "Common"}>
              {commonLangs.map((lang) => (
                <CommandItem
                  key={lang.code}
                  value={`${lang.nameEn} ${lang.nameZh} ${lang.code}`}
                  onSelect={() => {
                    onChange(lang.code);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.toLowerCase() === lang.code.toLowerCase()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {locale === "zh"
                    ? `${lang.nameZh} (${lang.code})`
                    : `${lang.nameEn} (${lang.code})`}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading={locale === "zh" ? "全部语言" : "All Languages"}>
              {otherLangs.map((lang) => (
                <CommandItem
                  key={lang.code}
                  value={`${lang.nameEn} ${lang.nameZh} ${lang.code}`}
                  onSelect={() => {
                    onChange(lang.code);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.toLowerCase() === lang.code.toLowerCase()
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {locale === "zh"
                    ? `${lang.nameZh} (${lang.code})`
                    : `${lang.nameEn} (${lang.code})`}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
