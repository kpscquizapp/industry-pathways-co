import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { TestCase } from "@/types/coding";
import { CheckCircle2, XCircle, Clock, Database } from "lucide-react";

interface ConsoleOutputProps {
  testCases: TestCase[];
  isRunning: boolean;
  error?: string;
}

const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  testCases,
  isRunning,
  error,
}) => {
  const resolvedCases = testCases.filter((tc) => tc.passed !== undefined);
  const passedTests = resolvedCases.filter((tc) => tc.passed).length;
  const totalTests = resolvedCases.length;

  return (
    <Card className="h-full border-t rounded-none shadow-none">
      <Tabs defaultValue="test-results" className="h-full">
        <div className="border-b border-border px-4 py-2 flex items-center justify-between">
          <TabsList className="bg-transparent p-0 h-auto">
            <TabsTrigger
              value="test-results"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4"
            >
              Test Results
            </TabsTrigger>
          </TabsList>

          {!isRunning && resolvedCases.length > 0 && (
            <div className="text-sm">
              <Badge
                variant={passedTests === totalTests ? "default" : "destructive"}
                className="font-medium"
              >
                {passedTests} / {totalTests} Passed
              </Badge>
            </div>
          )}
        </div>

        <ScrollArea className="h-[calc(100%-48px)]">
          <TabsContent value="test-results" className="p-4 mt-0 space-y-3">
            {isRunning && (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  <span>Running test cases...</span>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-destructive mb-1">
                      Runtime Error
                    </p>
                    <pre className="text-sm text-destructive/80 whitespace-pre-wrap font-mono">
                      {error}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {!isRunning && !error && testCases.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">No test results yet</p>
                <p className="text-xs mt-2">
                  Click &quot;Run Code&quot; to test your solution
                </p>
              </div>
            )}

            {!isRunning &&
              testCases.map((testCase, idx) => {
                const isResolved = testCase.passed !== undefined;
                return (
                  <div
                    key={testCase.id}
                    className={`border rounded-lg p-4 ${!isResolved
                      ? "border-border bg-muted/20"
                      : testCase.passed
                        ? "border-green-500/30 bg-green-500/5"
                        : "border-red-500/30 bg-red-500/5"
                      }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {!isResolved ? (
                          <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                        ) : testCase.passed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className="font-medium text-sm">
                          Test Case {idx + 1}
                        </span>
                        {isResolved && (
                          <Badge
                            variant={testCase.passed ? "default" : "destructive"}
                            className={`text-[10px] px-1.5 py-0 ${testCase.passed
                              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-600 border-0 hover:bg-green-100 hover:dark:bg-green-900/30 hover:text-green-600 hover:dark:text-green-600"
                              : ""
                              }`}
                          >
                            {testCase.passed ? "Accepted" : "Failed"}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {testCase.runtime !== undefined && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {testCase.runtime}ms
                          </span>
                        )}
                        {testCase.memory !== undefined && (
                          <span className="flex items-center gap-1">
                            <Database className="h-3 w-3" />
                            {(testCase.memory / 1024).toFixed(1)} MB
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      {testCase.input && (
                        <div>
                          <p className="text-muted-foreground mb-1">Input:</p>
                          <code className="bg-muted/50 px-2 py-1 rounded text-foreground whitespace-pre-wrap break-all block">
                            {testCase.input}
                          </code>
                        </div>
                      )}

                      {testCase.actualOutput !== undefined && (
                        <div>
                          <p className="text-muted-foreground mb-1">
                            Your Output:
                          </p>
                          <code
                            className={`px-2 py-1 rounded whitespace-pre-wrap break-all block ${!isResolved
                              ? "bg-muted/50 text-foreground"
                              : testCase.passed
                                ? "bg-green-500/10 text-green-700 dark:text-green-400"
                                : "bg-red-500/10 text-red-700 dark:text-red-400"
                              }`}
                          >
                            {testCase.actualOutput || <span className="italic opacity-50">empty</span>}
                          </code>
                        </div>
                      )}

                      {testCase.stderr && (
                        <div>
                          <p className="text-muted-foreground mb-1">Stderr:</p>
                          <code className="bg-red-500/10 text-red-700 dark:text-red-400 px-2 py-1 rounded whitespace-pre-wrap break-all block text-xs">
                            {testCase.stderr}
                          </code>
                        </div>
                      )}
                      {
                        testCase.compile_output && (
                          <div>
                            <p className="text-muted-foreground mb-1">Compile Output:</p>
                            <code className="bg-muted/50 px-2 py-1 rounded text-foreground whitespace-pre-wrap break-all block">
                              {testCase.compile_output}
                            </code>
                          </div>
                        )
                      }
                    </div>
                  </div>
                );
              })}
          </TabsContent>

        </ScrollArea>
      </Tabs>
    </Card>
  );
};

export default ConsoleOutput;
