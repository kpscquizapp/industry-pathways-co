import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { TestCase } from "@/types/coding";
import { CheckCircle2, Clock, Database, XCircle } from "lucide-react";

interface ConsoleOutputProps {
  testCases: TestCase[];
  sampleTestCases: TestCase[];
  isRunning: boolean;
  runningProblemId?: number | null;
  currentProblemId?: number;
  error?: string;
}

const MAX_VISIBLE_CASES = 2;

type ApiTestCase = TestCase & {
  expected_output?: string;
  expected?: string;
  output?: string;
  stdin?: string;
};

const getCaseInput = (testCase: TestCase): string =>
  testCase.input || (testCase as ApiTestCase).stdin || "";

const getExpectedOutput = (testCase: TestCase): string => {
  const apiTestCase = testCase as ApiTestCase;
  return (
    testCase.expectedOutput ||
    apiTestCase.expected_output ||
    apiTestCase.expected ||
    apiTestCase.output ||
    ""
  );
};

const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  testCases,
  sampleTestCases,
  isRunning,
  runningProblemId,
  currentProblemId,
  error,
}) => {
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const isRunningForCurrentProblem =
    isRunning &&
    runningProblemId != null &&
    currentProblemId != null &&
    runningProblemId === currentProblemId;

  const visibleCases = (sampleTestCases.length > 0 ? sampleTestCases : testCases)
    .slice(0, MAX_VISIBLE_CASES);
  const selectedIndex = Math.min(selectedCaseIndex, visibleCases.length - 1);
  const selectedCase = visibleCases[selectedIndex];
  const result = testCases[selectedIndex];

  return (
    <Card className="h-full rounded-none border-t border-[#344353] bg-[#1d2734] text-[#e6edf6] shadow-none">
      <div className="flex h-12 items-center justify-between border-b border-[#344353] bg-[#202e3f] px-4">
        <h2 className="text-sm font-semibold text-[#e6edf6]">Test cases</h2>
        <span className="text-xs text-[#a5b5c6]">Sample inputs</span>
      </div>

      <ScrollArea className="h-[calc(100%-48px)]">
        <div className="space-y-5 p-4">
          {visibleCases.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Test cases">
                {visibleCases.map((testCase, index) => {
                  const caseResult = testCases[index];
                  const isSelected = selectedIndex === index;
                  const isResolved = caseResult?.passed !== undefined;

                  return (
                    <button
                      key={index}
                      type="button"
                      role="tab"
                      aria-selected={isSelected}
                      onClick={() => setSelectedCaseIndex(index)}
                      className={`rounded-lg border px-3 py-2 text-xs transition-colors ${
                        isSelected
                          ? "border-sky-500 bg-[#202e3f] text-sky-400"
                          : "border-[#344353] text-[#e6edf6] hover:border-[#526273]"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        {isResolved &&
                          (caseResult.passed ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-red-400" />
                          ))}
                        Case {index + 1}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedCase && (
                <div className="space-y-4 text-xs">
                  <section>
                    <h3 className="mb-2 text-[#a5b5c6]">INPUT</h3>
                    <pre className="whitespace-pre-wrap break-words font-mono leading-5 text-[#e6edf6]">
                      {getCaseInput(selectedCase) || "—"}
                    </pre>
                  </section>

                  <section>
                    <h3 className="mb-2 text-[#a5b5c6]">EXPECTED OUTPUT</h3>
                    <pre className="whitespace-pre-wrap break-words font-mono leading-5 text-[#e6edf6]">
                      {getExpectedOutput(selectedCase) || "—"}
                    </pre>
                  </section>

                  {isRunningForCurrentProblem && (
                    <div className="flex items-center gap-2 text-[#a5b5c6]">
                      <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-sky-400" />
                      Running test cases...
                    </div>
                  )}

                  {result?.passed !== undefined && (
                    <div className="flex items-center justify-between border-t border-[#344353] pt-3">
                      <div className="flex items-center gap-2">
                        {result.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-400" />
                        )}
                        <Badge
                          variant={result.passed ? "default" : "destructive"}
                          className="text-xs"
                        >
                          {result.passed
                            ? "Test Case Passed"
                            : "Test Case Failed"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#a5b5c6]">
                        {result.runtime !== undefined && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {result.runtime}ms
                          </span>
                        )}
                        {result.memory !== undefined && (
                          <span className="flex items-center gap-1">
                            <Database className="h-3 w-3" />
                            {(result.memory / 1024).toFixed(1)} MB
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {result?.actualOutput !== undefined && (
                    <section>
                      <h3 className="mb-2 text-[#a5b5c6]">YOUR OUTPUT</h3>
                      <pre
                        className={`whitespace-pre-wrap break-words rounded-md border px-3 py-2 font-mono leading-5 ${
                          result.passed === undefined
                            ? "border-[#344353] bg-[#131a24] text-[#e6edf6]"
                            : result.passed
                              ? "border-green-500/30 bg-green-500/10 text-green-300"
                              : "border-red-500/30 bg-red-500/10 text-red-300"
                        }`}
                      >
                        {result.actualOutput || (
                          <span className="italic opacity-60">empty</span>
                        )}
                      </pre>
                    </section>
                  )}

                  {result?.stderr && (
                    <section>
                      <h3 className="mb-2 text-red-300">STDERR</h3>
                      <pre className="whitespace-pre-wrap break-words rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 font-mono text-red-200">
                        {result.stderr}
                      </pre>
                    </section>
                  )}

                  {result?.compile_output && (
                    <section>
                      <h3 className="mb-2 text-[#a5b5c6]">COMPILE OUTPUT</h3>
                      <pre className="whitespace-pre-wrap break-words rounded-md border border-[#344353] bg-[#131a24] px-3 py-2 font-mono text-[#e6edf6]">
                        {result.compile_output}
                      </pre>
                    </section>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="py-8 text-center text-sm text-[#a5b5c6]">
              No sample test cases available.
            </div>
          )}

          {error && (
            <div className="rounded-md border border-red-400/30 bg-red-500/10 p-3">
              <div className="mb-1 flex items-center gap-2 font-semibold text-red-300">
                <XCircle className="h-4 w-4" />
                Runtime Error
              </div>
              <pre className="whitespace-pre-wrap break-words font-mono text-xs text-red-200/90">
                {error}
              </pre>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ConsoleOutput;
