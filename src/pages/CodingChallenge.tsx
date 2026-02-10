import React, { useState, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Play, Send, ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ProblemPanel from "@/components/coding/ProblemPanel";
import EditorPanel from "@/components/coding/EditorPanel";
import ConsoleOutput from "@/components/coding/ConsoleOutput";
import {
  CodingProblem,
  Difficulty,
  SupportedLanguage,
  TestCase,
} from "@/types/coding";
import { toast } from "sonner";

// Sample problem data
const sampleProblem: CodingProblem = {
  id: "two-sum",
  title: "Two Sum",
  difficulty: Difficulty.EASY,
  description: `
    <p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return <em>indices of the two numbers such that they add up to <code>target</code></em>.</p>
    <p>You may assume that each input would have <strong>exactly one solution</strong>, and you may not use the same element twice.</p>
    <p>You can return the answer in any order.</p>
  `,
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation:
        "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
    },
    {
      input: "nums = [3,3], target = 6",
      output: "[0,1]",
    },
  ],
  constraints: [
    "2 <= nums.length <= 10⁴",
    "-10⁹ <= nums[i] <= 10⁹",
    "-10⁹ <= target <= 10⁹",
    "Only one valid answer exists.",
  ],
  starterCode: {
    [SupportedLanguage.JAVASCRIPT]: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your code here
    
};`,
    [SupportedLanguage.TYPESCRIPT]: `function twoSum(nums: number[], target: number): number[] {
    // Write your code here
    
}`,
    [SupportedLanguage.PYTHON]: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your code here
        pass`,
    [SupportedLanguage.JAVA]: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        
    }
}`,
    [SupportedLanguage.CPP]: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        
    }
};`,
  },
  testCases: [
    {
      id: "1",
      input: "[2,7,11,15], 9",
      expectedOutput: "[0,1]",
    },
    {
      id: "2",
      input: "[3,2,4], 6",
      expectedOutput: "[1,2]",
    },
    {
      id: "3",
      input: "[3,3], 6",
      expectedOutput: "[0,1]",
    },
  ],
};

const CodingChallenge: React.FC = () => {
  const navigate = useNavigate();
  const { challengeId } = useParams();
  const [problem] = useState<CodingProblem>(sampleProblem);
  const [language, setLanguage] = useState<SupportedLanguage>(
    SupportedLanguage.JAVASCRIPT
  );
  const [code, setCode] = useState<string>(
    problem.starterCode[SupportedLanguage.JAVASCRIPT]
  );
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string>();

  // Update code when language changes
  useEffect(() => {
    const savedCode = localStorage.getItem(`code_${problem.id}_${language}`);
    if (savedCode) {
      setCode(savedCode);
    } else {
      setCode(problem.starterCode[language]);
    }
  }, [language, problem]);

  // Auto-save code to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(`code_${problem.id}_${language}`, code);
    }, 1000);
    return () => clearTimeout(timer);
  }, [code, language, problem.id]);

  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  const simulateTestRun = () => {
    // Simulate running tests with mock results
    return new Promise<TestCase[]>((resolve) => {
      setTimeout(() => {
        const results: TestCase[] = problem.testCases.map((tc, idx) => ({
          ...tc,
          actualOutput: idx === 0 ? "[0,1]" : idx === 1 ? "[1,2]" : "[0,1]",
          passed: true,
          runtime: Math.floor(Math.random() * 50) + 10,
          memory: Math.floor(Math.random() * 1024) + 512,
        }));
        resolve(results);
      }, 2000);
    });
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setError(undefined);
    setTestCases([]);

    try {
      const results = await simulateTestRun();
      setTestCases(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    setError(undefined);
    setTestCases([]);

    try {
      const results = await simulateTestRun();
      setTestCases(results);
      
      const allPassed = results.every((tc) => tc.passed);
      if (allPassed) {
        toast.success("All test cases passed! Submission successful.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-4 py-3 flex items-center justify-between bg-card flex-shrink-0">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-lg font-semibold">Coding Challenge</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleRunCode}
            disabled={isRunning}
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            Run Code
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isRunning}
            className="gap-2 bg-green-600 hover:bg-green-700 text-white"
          >
            <Send className="h-4 w-4" />
            Submit
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          {/* Left Panel - Problem Description */}
          <ResizablePanel defaultSize={35} minSize={25}>
            <ProblemPanel problem={problem} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          {/* Right Panel - Editor and Console */}
          <ResizablePanel defaultSize={65} minSize={40}>
            <ResizablePanelGroup direction="vertical">
              {/* Editor */}
              <ResizablePanel defaultSize={60} minSize={30}>
                <EditorPanel
                  language={language}
                  onLanguageChange={handleLanguageChange}
                  code={code}
                  onCodeChange={handleCodeChange}
                  starterCode={problem.starterCode}
                />
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Console Output */}
              <ResizablePanel defaultSize={40} minSize={20}>
                <ConsoleOutput
                  testCases={testCases}
                  isRunning={isRunning}
                  error={error}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default CodingChallenge;
