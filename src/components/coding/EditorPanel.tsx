import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Language } from "@/app/queries/assessmentApi";
import { Settings, Maximize2, Minimize2, RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EditorPanelProps {
  language: Language | undefined;
  onLanguageChange: (language: Language) => void;
  code: string;
  onCodeChange: (code: string) => void;
  starterCode?: Record<string, string>;
  baseCode?: Record<string, string>;
  allLanguages: Language[];
}

const getMonacoLanguage = (name?: string): string => {
  if (!name) return "javascript";
  const normalized = name.toLowerCase();
  if (normalized.startsWith("javascript")) return "javascript";
  if (normalized.startsWith("typescript")) return "typescript";
  if (normalized.startsWith("python")) return "python";
  if (normalized.startsWith("java") && !normalized.startsWith("javascript"))
    return "java";
  if (
    normalized.startsWith("c++") ||
    normalized === "c" ||
    normalized.startsWith("c ") ||
    normalized.startsWith("c(")
  ) {
    return "cpp";
  }
  if (normalized.startsWith("go ") || normalized.startsWith("go(")) return "go";
  return normalized;
};

const getDropdownLanguageKey = (name?: string): string | null => {
  if (!name) return null;
  const normalized = name.toLowerCase().trim();
  if (normalized.startsWith("javascript")) return "javascript";
  if (normalized.startsWith("typescript")) return "typescript";
  if (normalized.startsWith("python")) return "python";
  if (normalized.startsWith("java") && !normalized.startsWith("javascript"))
    return "java";
  if (
    normalized === "go" ||
    normalized.startsWith("go ") ||
    normalized.startsWith("go(")
  )
    return "go";
  return null;
};

const DROPDOWN_LANGUAGE_LABELS: Record<string, string> = {
  go: "Go",
  java: "Java",
  javascript: "JavaScript",
  python: "Python",
  typescript: "TypeScript",
};

const extractVersionTuple = (name?: string): number[] => {
  if (!name) return [0];
  const match = name.match(/\(([^)]+)\)/);
  if (!match?.[1]) return [0];

  const versionMatch = match[1].match(/(\d+(?:\.\d+)*)/);
  if (!versionMatch?.[1]) return [0];

  return versionMatch[1].split(".").map((part) => Number(part));
};

const compareVersionTuples = (a: number[], b: number[]): number => {
  const maxLength = Math.max(a.length, b.length);
  for (let i = 0; i < maxLength; i += 1) {
    const left = a[i] ?? 0;
    const right = b[i] ?? 0;
    if (left > right) return 1;
    if (left < right) return -1;
  }
  return 0;
};

const EditorPanel: React.FC<EditorPanelProps> = ({
  language,
  onLanguageChange,
  code,
  onCodeChange,
  starterCode,
  baseCode,
  allLanguages,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const filteredLanguages = React.useMemo(() => {
    const byKey = new Map<string, Language>();

    allLanguages.forEach((lang) => {
      const key = getDropdownLanguageKey(lang.name);
      if (!key || !DROPDOWN_LANGUAGE_LABELS[key]) return;

      const existing = byKey.get(key);
      if (!existing) {
        byKey.set(key, lang);
        return;
      }

      const nextVersion = extractVersionTuple(lang.name);
      const existingVersion = extractVersionTuple(existing.name);
      const versionComparison = compareVersionTuples(
        nextVersion,
        existingVersion,
      );

      if (
        versionComparison > 0 ||
        (versionComparison === 0 && lang.id > existing.id)
      ) {
        byKey.set(key, lang);
      }
    });

    return Array.from(byKey.values()).sort((a, b) => {
      const aKey = getDropdownLanguageKey(a.name) || "";
      const bKey = getDropdownLanguageKey(b.name) || "";
      return aKey.localeCompare(bKey);
    });
  }, [allLanguages]);

  useEffect(() => {
    if (!isFullscreen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isFullscreen]);
  const [fontSize, setFontSize] = useState(14);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<string>("vs-dark");

  // Sync with system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setTheme(mediaQuery.matches ? "vs-dark" : "light");
    const handler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "vs-dark" : "light");
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleReset = () => {
    if (!language) return;

    const getLanguageKey = (name?: string): string => {
      if (!name) return "";
      const n = name.toLowerCase().trim();
      if (n.startsWith("javascript")) return "javascript";
      if (n.startsWith("typescript")) return "typescript";
      if (n.startsWith("python")) return "python";
      if (n.startsWith("java") && !n.startsWith("javascript")) return "java";
      if (n.startsWith("go ") || n.startsWith("go(")) return "go";
      if (n.startsWith("c++")) return "cpp";
      if (n === "c" || n.startsWith("c ") || n.startsWith("c(")) return "c";
      return n;
    };

    const langKey = getLanguageKey(language.name);

    if (baseCode && baseCode[langKey]) {
      onCodeChange(baseCode[langKey]);
    } else if (starterCode && (starterCode as any)[langKey]) {
      onCodeChange((starterCode as any)[langKey]);
    } else {
      onCodeChange("");
    }
  };

  const selectedLanguageValue = React.useMemo(() => {
    const key = getDropdownLanguageKey(language?.name);
    if (!key) return language?.id?.toString();

    return filteredLanguages
      .find((candidate) => getDropdownLanguageKey(candidate.name) === key)
      ?.id.toString();
  }, [filteredLanguages, language]);

  return (
    <Card
      className={`h-full border-none rounded-none shadow-none flex flex-col ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      {/* Toolbar */}
      <div className="border-b border-border px-4 py-2 flex items-center justify-between gap-4 bg-card flex-shrink-0">
        <div className="flex items-center gap-3">
          <Select
            value={selectedLanguageValue}
            onValueChange={(val) => {
              const selected = filteredLanguages.find(
                (l) => l.id.toString() === val,
              );
              if (selected) onLanguageChange(selected);
            }}
          >
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {filteredLanguages.map((lang) => {
                const key = getDropdownLanguageKey(lang.name);
                const label = key ? DROPDOWN_LANGUAGE_LABELS[key] : lang.name;

                return (
                  <SelectItem key={lang.id} value={lang.id.toString()}>
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Button
            size="sm"
            onClick={handleReset}
            className="h-9 bg-transparent text-foreground hover:bg-muted font-semibold"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="h-9 bg-transparent text-foreground hover:bg-muted font-semibold"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Editor Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFontSize(12)}>
                Font Size: Small
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFontSize(14)}>
                Font Size: Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFontSize(16)}>
                Font Size: Large
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-9 bg-transparent text-foreground hover:bg-muted font-semibold"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          key={language?.id}
          height="100%"
          language={getMonacoLanguage(language?.name)}
          value={code}
          onChange={(value) => onCodeChange(value || "")}
          theme={theme}
          options={{
            fontSize,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            wordWrap: "on",
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            formatOnPaste: true,
            formatOnType: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            folding: true,
            lineNumbers: "on",
            renderLineHighlight: "all",
            scrollbar: {
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span>Loading editor...</span>
              </div>
            </div>
          }
        />
      </div>
    </Card>
  );
};

export default EditorPanel;
