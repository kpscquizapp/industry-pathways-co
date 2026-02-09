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
import { SupportedLanguage } from "@/types/coding";
import {
  Settings,
  Maximize2,
  Minimize2,
  RotateCcw,
  Copy,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EditorPanelProps {
  language: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
  code: string;
  onCodeChange: (code: string) => void;
  starterCode: Record<SupportedLanguage, string>;
}

const languageMap = {
  [SupportedLanguage.JAVASCRIPT]: { label: "JavaScript", monacoLang: "javascript" },
  [SupportedLanguage.TYPESCRIPT]: { label: "TypeScript", monacoLang: "typescript" },
  [SupportedLanguage.PYTHON]: { label: "Python", monacoLang: "python" },
  [SupportedLanguage.JAVA]: { label: "Java", monacoLang: "java" },
  [SupportedLanguage.CPP]: { label: "C++", monacoLang: "cpp" },
};

const EditorPanel: React.FC<EditorPanelProps> = ({
  language,
  onLanguageChange,
  code,
  onCodeChange,
  starterCode,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<string>("vs-dark");

  // Sync with system theme
  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(isDark ? "vs-dark" : "light");

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "vs-dark" : "light");
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const handleReset = () => {
    onCodeChange(starterCode[language]);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            value={language}
            onValueChange={(val) => onLanguageChange(val as SupportedLanguage)}
          >
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(languageMap).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-9"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-9"
          >
            {copied ? (
              <Check className="h-4 w-4 mr-2" />
            ) : (
              <Copy className="h-4 w-4 mr-2" />
            )}
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9">
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
            variant="ghost"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-9"
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
          key={language}
          height="100%"
          language={languageMap[language].monacoLang}
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
