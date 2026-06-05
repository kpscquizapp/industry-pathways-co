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
  javascript: "var solution = function() {\n    // Write your code here\n};",
  python: "def solution():\n    # Write your code here\n    pass",
  java: "class Solution {\n    // Write your code here\n}",
  typescript: "function solution(): void {\n    // Write your code here\n};",
  go: "func solution() {\n    // Write your code here\n}",
};

export const STARTER_LANGS: StarterCodeLang[] = [...STARTER_CODE_LANGS];

export const cloneDefaultStarterCode = (): StarterCode => ({
  ...DEFAULT_STARTER_CODE,
});
