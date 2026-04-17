export enum Difficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export enum SupportedLanguage {
  JAVASCRIPT = "javascript",
  TYPESCRIPT = "typescript",
  PYTHON = "python",
  JAVA = "java",
  CPP = "cpp",
  C = "c",
  GO = "go",
}

export interface TestCase {
  id: string | number;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
  runtime?: number;
  memory?: number;
}

export interface CodingProblem {
  id: string | number;
  title: string;
  difficulty: string | Difficulty;
  description: string;
  examples?: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints?: string[];
  baseCode?: Record<string, string>;
  starterCode?: Record<SupportedLanguage, string>;
  testcases?: TestCase[];
  testCases?: TestCase[];
}

export interface SubmissionResult {
  success: boolean;
  totalTests: number;
  passedTests: number;
  failedTests: TestCase[];
  runtime?: number;
  memory?: number;
  error?: string;
}

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  minimap: boolean;
  wordWrap: boolean;
}
