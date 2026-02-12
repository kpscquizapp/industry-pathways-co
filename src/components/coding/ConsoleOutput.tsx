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
  const passedTests = testCases.filter((tc) => tc.passed).length;
  const totalTests = testCases.length;

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
            <TabsTrigger
              value="output"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4"
            >
              Console
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4"
            >
              Performance
            </TabsTrigger>
          </TabsList>

          {!isRunning && testCases.length > 0 && (
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
                  Click "Run Code" to test your solution
                </p>
              </div>
            )}

            {!isRunning &&
              testCases.map((testCase) => (
                <div
                  key={testCase.id}
                  className={`border rounded-lg p-4 ${
                    testCase.passed
                      ? "border-green-500/30 bg-green-500/5"
                      : "border-red-500/30 bg-red-500/5"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {testCase.passed ? (
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="font-medium text-sm">
                        Test Case {testCase.id}
                      </span>
                    </div>
                    {testCase.runtime !== undefined && (
                      <span className="text-xs text-muted-foreground">
                        {testCase.runtime}ms
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Input:</p>
                      <code className="bg-muted/50 px-2 py-1 rounded text-foreground">
                        {testCase.input}
                      </code>
                    </div>

                    <div>
                      <p className="text-muted-foreground mb-1">
                        Expected Output:
                      </p>
                      <code className="bg-muted/50 px-2 py-1 rounded text-foreground">
                        {testCase.expectedOutput}
                      </code>
                    </div>

                    {testCase.actualOutput !== undefined && (
                      <div>
                        <p className="text-muted-foreground mb-1">
                          Your Output:
                        </p>
                        <code
                          className={`px-2 py-1 rounded ${
                            testCase.passed
                              ? "bg-green-500/10 text-green-700 dark:text-green-400"
                              : "bg-red-500/10 text-red-700 dark:text-red-400"
                          }`}
                        >
                          {testCase.actualOutput}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </TabsContent>

          <TabsContent value="output" className="p-4 mt-0">
            <div className="bg-black/90 rounded-lg p-4 font-mono text-sm min-h-[200px]">
              <pre className="text-green-400">
                {testCases.length > 0
                  ? testCases
                      .map((tc) => `Test ${tc.id}: ${tc.actualOutput || ""}`)
                      .join("\n")
                  : "Console output will appear here..."}
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="p-4 mt-0 space-y-4">
            {testCases.length > 0 ? (
              <div className="space-y-3">
                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Runtime</h4>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {Math.max(
                      ...testCases.map((tc) => tc.runtime || 0),
                    ).toFixed(0)}
                    ms
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Beats 65% of submissions
                  </p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Database className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold">Memory</h4>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {(
                      Math.max(...testCases.map((tc) => tc.memory || 0)) / 1024
                    ).toFixed(2)}{" "}
                    MB
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Beats 72% of submissions
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">No performance data available</p>
              </div>
            )}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </Card>
  );
};

export default ConsoleOutput;
