import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Award, ChevronRight, Brain } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type Skill = "React" | "Node.js" | "Python" | "TypeScript" | "AWS" | "Docker";

interface Question {
  id: number;
  skill: Skill;
  question: string;
  options: string[];
  correctAnswer: number;
}

const questions: Question[] = [
  {
    id: 1,
    skill: "React",
    question: "What is the purpose of useEffect hook in React?",
    options: [
      "To create side effects in functional components",
      "To manage component state",
      "To handle component props",
      "To create class components",
    ],
    correctAnswer: 0,
  },
  {
    id: 2,
    skill: "React",
    question: "What is JSX?",
    options: [
      "A JavaScript XML syntax extension",
      "A CSS framework",
      "A testing library",
      "A database query language",
    ],
    correctAnswer: 0,
  },
  {
    id: 3,
    skill: "TypeScript",
    question: "What is the main benefit of using TypeScript?",
    options: [
      "Static type checking",
      "Faster execution",
      "Smaller bundle size",
      "Better styling",
    ],
    correctAnswer: 0,
  },
  {
    id: 4,
    skill: "Node.js",
    question: "What is Node.js primarily used for?",
    options: [
      "Server-side JavaScript runtime",
      "CSS preprocessing",
      "Image editing",
      "Database management",
    ],
    correctAnswer: 0,
  },
  {
    id: 5,
    skill: "Python",
    question: "Which keyword is used to define a function in Python?",
    options: ["def", "function", "func", "define"],
    correctAnswer: 0,
  },
  {
    id: 6,
    skill: "AWS",
    question: "What does S3 stand for in AWS?",
    options: [
      "Simple Storage Service",
      "Secure Server Solution",
      "Standard Storage System",
      "Software Service Stack",
    ],
    correctAnswer: 0,
  },
  {
    id: 7,
    skill: "Docker",
    question: "What is Docker primarily used for?",
    options: [
      "Containerization of applications",
      "Code compilation",
      "Database management",
      "Network routing",
    ],
    correctAnswer: 0,
  },
  {
    id: 8,
    skill: "React",
    question: "What is the virtual DOM in React?",
    options: [
      "A lightweight copy of the actual DOM",
      "A CSS framework",
      "A state management tool",
      "A routing library",
    ],
    correctAnswer: 0,
  },
];

const SkillsAssessment = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const availableSkills: Skill[] = [
    "React",
    "Node.js",
    "Python",
    "TypeScript",
    "AWS",
    "Docker",
  ];
  const skillQuestions = selectedSkill
    ? questions.filter((q) => q.skill === selectedSkill)
    : [];

  if (!user) {
    return null;
  }

  const handleSkillSelect = (skill: Skill) => {
    setSelectedSkill(skill);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const handleAnswer = (answerIndex: number) => {
    setAnswers({
      ...answers,
      [skillQuestions[currentQuestion].id]: answerIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestion < skillQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = () => {
    const correctAnswers = skillQuestions.filter(
      (q) => answers[q.id] === q.correctAnswer
    ).length;

    const percentage = (correctAnswers / skillQuestions.length) * 100;

    if (percentage >= 70) {
      // User passed - add validated skill
      const validatedSkills = user.validatedSkills || [];
      if (!validatedSkills.includes(selectedSkill!)) {
        validatedSkills.push(selectedSkill!);
        updateProfile({ validatedSkills });
        toast.success(
          `Congratulations! You've earned the ${selectedSkill} badge! 🎉`
        );
      } else {
        toast.success(`You maintained your ${selectedSkill} badge!`);
      }
    } else {
      toast.error(
        `You need 70% to pass. Try again to earn your ${selectedSkill} badge.`
      );
    }

    setShowResults(true);
  };

  const getScore = () => {
    const correctAnswers = skillQuestions.filter(
      (q) => answers[q.id] === q.correctAnswer
    ).length;
    return { correct: correctAnswers, total: skillQuestions.length };
  };

  if (!selectedSkill) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-50 via-white to-neutral-50">
        <Header />

        <main className="flex-1 pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-full mb-6">
                  <Brain className="h-5 w-5" />
                  <span className="font-semibold">Skills Assessment</span>
                </div>
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
                  Validate Your Skills
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Take skill-specific quizzes to earn badges and improve your
                  job match scores
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {availableSkills.map((skill) => {
                  const isValidated = user.validatedSkills?.includes(skill);
                  return (
                    <Card
                      key={skill}
                      className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-teal-500"
                      onClick={() => handleSkillSelect(skill)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-xl group-hover:text-teal-600 transition-colors">
                              {skill}
                            </CardTitle>
                            <CardDescription>
                              {isValidated
                                ? "Retake assessment"
                                : "Take assessment to earn badge"}
                            </CardDescription>
                          </div>
                          {isValidated && (
                            <Award className="h-8 w-8 text-teal-600" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {questions.filter((q) => q.skill === skill).length}{" "}
                            questions
                          </span>
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-teal-600 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (showResults) {
    const { correct, total } = getScore();
    const percentage = (correct / total) * 100;
    const passed = percentage >= 70;

    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-50 via-white to-neutral-50">
        <Header />

        <main className="flex-1 pt-32 pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="border-2 border-teal-500 shadow-2xl">
                <CardHeader className="text-center bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-t-lg">
                  <CardTitle className="text-3xl font-bold mb-2">
                    {passed ? "🎉 Congratulations!" : "📚 Keep Learning!"}
                  </CardTitle>
                  <CardDescription className="text-teal-50 text-lg">
                    {passed
                      ? `You've validated your ${selectedSkill} skills!`
                      : `You need 70% to earn the ${selectedSkill} badge`}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-8 space-y-6">
                  <div className="text-center">
                    <div className="text-6xl font-bold bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent mb-2">
                      {percentage.toFixed(0)}%
                    </div>
                    <p className="text-muted-foreground">
                      {correct} out of {total} questions correct
                    </p>
                  </div>

                  {passed && (
                    <div className="flex justify-center">
                      <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-2xl flex items-center gap-3">
                        <Award className="h-12 w-12" />
                        <div>
                          <div className="font-bold text-lg">
                            {selectedSkill}
                          </div>
                          <div className="text-sm text-teal-50">
                            Validated Skill
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      onClick={() => {
                        setSelectedSkill(null);
                        setShowResults(false);
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      Take Another Quiz
                    </Button>
                    <Button
                      onClick={() => navigate("/profile")}
                      className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                    >
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / skillQuestions.length) * 100;
  const currentQ = skillQuestions[currentQuestion];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-50 via-white to-neutral-50">
      <Header />

      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">
                  Question {currentQuestion + 1} of {skillQuestions.length}
                </div>
                <div className="flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full">
                  <Award className="h-4 w-4" />
                  <span className="font-semibold">{selectedSkill}</span>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Card className="shadow-xl border-2 border-teal-100">
              <CardHeader>
                <CardTitle className="text-2xl">{currentQ.question}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <RadioGroup
                  value={answers[currentQ.id]?.toString()}
                  onValueChange={(value) => handleAnswer(parseInt(value))}
                >
                  {currentQ.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 border-2 border-neutral-200 rounded-lg p-4 hover:border-teal-500 hover:bg-teal-50 transition-all cursor-pointer"
                    >
                      <RadioGroupItem
                        value={index.toString()}
                        id={`option-${index}`}
                      />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer text-base"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={() => setSelectedSkill(null)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={answers[currentQ.id] === undefined}
                    className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700"
                  >
                    {currentQuestion === skillQuestions.length - 1
                      ? "Finish"
                      : "Next"}
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SkillsAssessment;
