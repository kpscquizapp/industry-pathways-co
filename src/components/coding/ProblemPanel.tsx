import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodingProblem, Difficulty } from "@/types/coding";
import { Circle, FileCode2 } from "lucide-react";
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
  const examples = problem.examples || [];
  const constraints = problem.constraints || [];

  return (
    <Card className="h-full overflow-y-auto [scrollbar-color:#526273_#1d2734] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#526273] [&::-webkit-scrollbar-thumb:hover]:bg-[#6b7f92] [&::-webkit-scrollbar-track]:bg-[#1d2734] rounded-none border-none bg-transparent text-[#e6edf6] shadow-none">
      <CardContent className="space-y-6 px-5 py-5">
        <div>
          <h2 className="text-2xl font-bold leading-tight tracking-tight text-white">
            {problem.title}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={`${getDifficultyColor(problem.difficulty as Difficulty)} capitalize`}
            >
              {problem.difficulty}
            </Badge>
            <Badge
              variant="outline"
              className="border-[#344353] bg-[#131a24] text-[#a5b5c6]"
            >
              Coding
            </Badge>
          </div>
        </div>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-white">Description</h3>
          <div
            className="prose prose-sm prose-invert max-w-none text-[#a5b5c6] prose-p:my-3 prose-p:leading-7 prose-headings:mb-2 prose-headings:mt-5 prose-headings:text-white prose-strong:text-[#e6edf6] prose-code:rounded-md prose-code:bg-[#c8d4e0] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[#263b4b] prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-lg prose-pre:border prose-pre:border-[#344353] prose-pre:bg-[#131a24] prose-pre:text-[#e6edf6]"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(problem.description || ""),
            }}
          />
        </section>

        {constraints.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-white">Constraints</h3>
            <ul className="space-y-2">
              {constraints.map((constraint, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm leading-6 text-[#a5b5c6]"
                >
                  <Circle className="mt-2 h-1.5 w-1.5 shrink-0 fill-current" />
                  <span>{constraint}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {examples.length > 0 ? (
          <section className="space-y-4">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Example 1</h3>
              <div className="overflow-hidden rounded-lg border border-[#344353] bg-[#131a24]">
                <div className="space-y-4 p-4 font-mono text-xs leading-6 text-[#e6edf6] sm:text-[13px]">
                  <div>
                    <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-wider text-[#a5b5c6]">
                      Input
                    </p>
                    <pre className="whitespace-pre-wrap break-words">
                      {examples[0].input}
                    </pre>
                  </div>
                  <div>
                    <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-wider text-[#a5b5c6]">
                      Output
                    </p>
                    <pre className="whitespace-pre-wrap break-words">
                      {examples[0].output}
                    </pre>
                  </div>
                  {examples[0].explanation && (
                    <div>
                      <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-wider text-[#a5b5c6]">
                        Explanation
                      </p>
                      <p className="font-sans text-[#a5b5c6]">
                        {examples[0].explanation}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        ) : (
          constraints.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-white">Constraints</h3>
              <ul className="space-y-2">
                {constraints.map((constraint, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-sm leading-6 text-[#a5b5c6]"
                  >
                    <Circle className="mt-2 h-1.5 w-1.5 shrink-0 fill-current" />
                    <span>{constraint}</span>
                  </li>
                ))}
              </ul>
            </section>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default ProblemPanel;
