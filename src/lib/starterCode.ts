export const STARTER_CODE_LANGS = [
  "javascript",
  "typescript",
  "python",
  "java",
  "go",
] as const;

export type StarterCodeLang = (typeof STARTER_CODE_LANGS)[number];
export type StarterCode = Record<StarterCodeLang, string>;

export const DEFAULT_STARTER_CODE: StarterCode = {
  javascript:
    "function solution() {\n    // Write your code here\n    return null;\n}",
  python: "def solution():\n    # Write your code here\n    return None",
  typescript:
    "function solution(): any {\n    // Write your code here\n    return null;\n}",
  java: "public class Main {\n    public static Object solution() {\n        // Write your code here\n        return null;\n    }\n}",
  go: "func solution() interface{} {\n    // Write your code here\n    return nil\n}",
};

export const STARTER_LANGS: StarterCodeLang[] = [...STARTER_CODE_LANGS];

export const cloneDefaultStarterCode = (): StarterCode => ({
  ...DEFAULT_STARTER_CODE,
});
