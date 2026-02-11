import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CodingProblem, Difficulty } from "@/types/coding";
import { CheckCircle2, Circle } from "lucide-react";
import DOMPurify from "dompurify";

interface ProblemPanelProps {
  problem: CodingProblem;
}

const getDifficultyColor = (difficulty: Difficulty) => {
  switch (difficulty) {
    case Difficulty.EASY:
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case Difficulty.MEDIUM:
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case Difficulty.HARD:
      return "bg-red-500/10 text-red-600 border-red-500/20";
  }
};

const ProblemPanel: React.FC<ProblemPanelProps> = ({ problem }) => {
  return (
    <Card className="h-full border-none rounded-none shadow-none">
      <CardHeader className="border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl mb-2">{problem.title}</CardTitle>
            <Badge
              variant="outline"
              className={getDifficultyColor(problem.difficulty)}
            >
              {problem.difficulty}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="description" className="h-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="description"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Description
            </TabsTrigger>
            <TabsTrigger
              value="examples"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Examples
            </TabsTrigger>
            <TabsTrigger
              value="constraints"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Constraints
            </TabsTrigger>
            <TabsTrigger
              value="submissions"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Submissions
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-280px)]">
            <TabsContent value="description" className="p-6 space-y-4">
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(problem.description),
                }}
              />
            </TabsContent>

            <TabsContent value="examples" className="p-6 space-y-6">
              {problem.examples.map((example, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="font-semibold text-foreground">
                    Example {idx + 1}:
                  </h4>
                  <div className="space-y-2">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Input:
                      </p>
                      <code className="text-sm text-foreground">
                        {example.input}
                      </code>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        Output:
                      </p>
                      <code className="text-sm text-foreground">
                        {example.output}
                      </code>
                    </div>
                    {example.explanation && (
                      <div className="bg-muted/30 rounded-lg p-4">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                          Explanation:
                        </p>
                        <p className="text-sm text-foreground">
                          {example.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="constraints" className="p-6">
              <ul className="space-y-2">
                {problem.constraints.map((constraint, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Circle className="h-2 w-2 mt-1.5 fill-current" />
                    <span>{constraint}</span>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="submissions" className="p-6">
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No submissions yet</p>
                <p className="text-xs mt-2">
                  Submit your solution to see your history
                </p>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProblemPanel;
