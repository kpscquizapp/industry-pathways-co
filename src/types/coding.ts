export enum Difficulty {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

export enum SupportedLanguage {
  JAVASCRIPT = "javascript",
  TYPESCRIPT = "typescript",
  PYTHON = "python",
  JAVA = "java",
  CPP = "cpp",
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  passed?: boolean;
  runtime?: number;
  memory?: number;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  starterCode: Record<SupportedLanguage, string>;
  testCases: TestCase[];
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
