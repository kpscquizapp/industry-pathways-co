import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  UploadCloud,
  ChevronDown,
  Sparkles,
  Edit2,
  Trash2,
  Search,
  Bot,
  Video
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

type TabMode = "manual" | "ai" | "bulk";

export default function InterviewQuestions() {
  const [activeTab, setActiveTab] = useState<TabMode>("manual");

  return (
    <div className="min-h-screen bg-[#f2f5fa] font-sans flex flex-col">
      {/* Page Header — replacing dashboard layout header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 py-2.5 sm:py-3.5 shrink-0">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-muted-foreground hover:bg-gray-100" title="Toggle Sidebar" />
          <div className="space-y-0.5">
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-[#112433]">
              Interview Questions
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm hidden sm:block">
              Build a reusable question bank with manual, AI-generated, and bulk-upload workflows.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" className="rounded-xl h-9 px-4 text-sm font-medium border-gray-200 bg-white" onClick={() => setActiveTab("bulk")}>
            Bulk Upload
          </Button>
          <Button className="rounded-xl bg-[#00A99D] hover:bg-[#00968b] text-white px-5 h-9 text-sm font-semibold shadow-sm transition-all duration-300">
            Add Question
          </Button>
        </div>
      </div>

      <div className="flex flex-1 w-full mx-auto relative items-stretch">
        {/* Left Column - Forms & Lists */}
        <div className="flex-1 flex flex-col gap-6 p-6 lg:p-8 min-w-0 max-w-5xl mx-auto w-full">
          {/* Form Content based on Tab (Card) */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
            {/* Tabs inside Card */}
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setActiveTab("manual")}
                className={cn(
                  "px-5 py-2 text-sm font-semibold rounded-full transition-colors",
                  activeTab === "manual"
                    ? "bg-[#0ea5e9] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                Manual Entry
              </button>
              <button
                onClick={() => setActiveTab("ai")}
                className={cn(
                  "px-5 py-2 text-sm font-semibold flex items-center gap-2 rounded-full transition-colors",
                  activeTab === "ai"
                    ? "bg-[#0ea5e9] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                <Sparkles className="w-4 h-4" />
                AI Generate from JD
              </button>
              <button
                onClick={() => setActiveTab("bulk")}
                className={cn(
                  "px-5 py-2 text-sm font-semibold rounded-full transition-colors",
                  activeTab === "bulk"
                    ? "bg-[#0ea5e9] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                Bulk Upload
              </button>
            </div>

            {activeTab === "manual" && <ManualEntryForm />}
            {activeTab === "ai" && <AIGenerateForm />}
            {activeTab === "bulk" && <BulkUploadForm />}
          </div>

          {activeTab === "manual" && <QuestionsList />}
          {activeTab === "ai" && <GeneratedQuestionsList />}
          {activeTab === "bulk" && <ImportedQuestionsList />}
        </div>

        {/* Right Column - Preview (Sidebar) */}
        <div className="hidden lg:block w-[360px] xl:w-[420px] shrink-0 bg-white border-l border-gray-200">
          <AIInterviewPreview />
        </div>
      </div>
    </div>
  );
}

function ManualEntryForm() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div className="flex flex-col gap-2 md:col-span-8">
        <label className="text-sm font-semibold text-gray-700">Question text</label>
        <textarea
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm min-h-[140px] focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 leading-relaxed text-gray-700"
          placeholder="How would you evaluate a candidate's ability..."
          defaultValue={"How would you evaluate a candidate's ability to build reusable frontend architecture for a hiring workflow product that includes dashboards, assessments, and interview automation?"}
        />
      </div>
      <div className="flex flex-col gap-4 md:col-span-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Assigned role</label>
          <div className="relative">
            <select className="w-full appearance-none p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none text-gray-700 font-medium">
              <option>Senior Frontend Engineer</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Category</label>
          <div className="relative">
            <select className="w-full appearance-none p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none text-gray-700 font-medium">
              <option>System design</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 md:col-span-8">
        <label className="text-sm font-semibold text-gray-700">Scoring focus</label>
        <Input 
          className="bg-gray-50 border-gray-200 rounded-xl h-12 text-sm font-medium text-gray-700"
          defaultValue="Architecture, problem solving, communication"
        />
      </div>
      
      <div className="flex flex-col gap-2 md:col-span-4">
        <label className="text-sm font-semibold text-gray-700">Difficulty</label>
        <div className="relative">
          <select className="w-full appearance-none p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none text-gray-700 font-medium">
            <option>Advanced</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>
      
      <div className="md:col-span-12 flex items-center justify-end gap-3 pt-2">
        <Button variant="ghost" className="text-gray-500 hover:bg-gray-100 rounded-xl px-6">Cancel</Button>
        <Button className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl shadow-sm px-6 h-11 font-bold">Save Question</Button>
      </div>
    </div>
  );
}

function AIGenerateForm() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Select a posted job</label>
          <div className="relative">
            <select className="w-full appearance-none p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none text-gray-700">
              <option>Senior Frontend Engineer</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Questions</label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <select className="w-full appearance-none p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none text-gray-700">
                <option>5 questions</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <Button variant="outline" className="rounded-xl flex items-center gap-2 text-gray-700 border-gray-200 h-[46px]">
              <Sparkles className="w-4 h-4 text-amber-500" /> Regenerate
            </Button>
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-500 flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-gray-400" /> Advanced focus: <span className="font-medium text-gray-700">Architecture, problem solving, communication</span>
        <button className="text-[#0ea5e9] hover:underline ml-1">Edit</button>
      </div>
    </div>
  );
}

function BulkUploadForm() {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer">
        <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mb-4">
          <UploadCloud className="w-6 h-6 text-teal-500" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">Upload CSV or Excel file</h3>
        <p className="text-xs text-gray-500 max-w-xs mb-4">
          Import interview questions in bulk with prompt, category, tags, difficulty, and source columns. New questions will be reviewed before publishing to your bank.
        </p>
        <div className="flex items-center gap-2 mb-6">
          <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-600">CSV</span>
          <span className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-medium text-gray-600">XLSX</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">Up to 500 questions</span>
        </div>
        <div className="flex items-center gap-3 w-full justify-center">
          <Button className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl shadow-sm">Choose file</Button>
          <Button variant="outline" className="border-gray-200 rounded-xl bg-white">Download template</Button>
        </div>
      </div>
      
      <div className="w-full md:w-64 flex flex-col gap-4">
        <h4 className="font-semibold text-gray-900 text-sm">Import settings</h4>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-700">Question type</label>
          <div className="relative">
            <select className="w-full appearance-none p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
              <option>Mixed types</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-700">Default difficulty</label>
          <div className="relative">
            <select className="w-full appearance-none p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
              <option>Intermediate</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-gray-700">Duplicate handling</label>
          <div className="relative">
            <select className="w-full appearance-none p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
              <option>Skip duplicates</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 mt-2">
          <label className="text-xs font-medium text-gray-700">Notify owner</label>
          <Input className="bg-gray-50 border-gray-200 h-9 text-sm" value="hiring@aaravrecruitment.com" readOnly />
        </div>
      </div>
    </div>
  );
}

function QuestionsList() {
  return (
    <div className="flex flex-col gap-4">
      {/* Filters/Search */}
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by role, skill, or question text..." 
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0ea5e9]/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">46 total questions</span>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">18 AI-generated</span>
          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">12 used this week</span>
        </div>
      </div>

      {/* List items */}
      <QuestionCard 
        text="How would you design a scalable React component system for a product with multiple hiring workflows and reusable assessment steps?"
        tags={[
          { label: "AI-generated", color: "blue" },
          { label: "Frontend", color: "gray" },
          { label: "System design", color: "gray" },
          { label: "Advanced", color: "orange" },
        ]}
        isActive
      />
      <QuestionCard 
        text="Describe a time you reduced application load time in a React app. What tools and metrics did you use to validate improvement?"
        tags={[
          { label: "Manual", color: "gray" },
          { label: "Performance", color: "gray" },
          { label: "Behavioral", color: "gray" },
          { label: "12 uses", color: "gray-solid" },
        ]}
      />
      <QuestionCard 
        text="When integrating a third-party assessment API, how would you handle retries, partial failures, and candidate state consistency in the hiring pipeline?"
        tags={[
          { label: "AI-generated", color: "blue" },
          { label: "API integration", color: "gray" },
          { label: "Backend collaboration", color: "gray" },
          { label: "Intermediate", color: "orange" },
        ]}
      />
      <QuestionCard 
        text="How do you collaborate with designers and recruiters when a hiring workflow needs quick UI changes without creating technical debt?"
        tags={[
          { label: "Manual", color: "gray" },
          { label: "Collaboration", color: "gray" },
          { label: "Product thinking", color: "gray" },
          { label: "Hiring ops", color: "gray" },
        ]}
      />
    </div>
  );
}

function GeneratedQuestionsList() {
  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <h3 className="font-bold text-gray-900">Generated Questions (5)</h3>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="text-gray-500 hover:text-gray-700 h-9 font-semibold">Discard All</Button>
          <Button className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl h-9 shadow-sm">Save 5 to Bank</Button>
        </div>
      </div>

      <QuestionCard 
        text="How would you design a scalable React component system for a product with multiple hiring workflows and reusable assessment steps?"
        tags={[
          { label: "AI-generated", color: "blue" },
          { label: "Frontend", color: "gray" },
          { label: "System design", color: "gray" },
          { label: "Advanced", color: "orange" },
        ]}
        isActive
      />
      <QuestionCard 
        text="Describe your approach to state management in a complex React application. When would you choose Context API over Redux or Zustand?"
        tags={[
          { label: "AI-generated", color: "blue" },
          { label: "Architecture", color: "gray" },
          { label: "Intermediate", color: "orange" },
        ]}
      />
      <QuestionCard 
        text="When integrating a third-party assessment API, how would you handle retries, partial failures, and candidate state consistency in the hiring pipeline?"
        tags={[
          { label: "AI-generated", color: "blue" },
          { label: "API integration", color: "gray" },
          { label: "Problem solving", color: "gray" },
          { label: "Advanced", color: "orange" },
        ]}
      />
      <QuestionCard 
        text="How do you collaborate with designers and recruiters when a hiring workflow needs quick UI changes without creating technical debt?"
        tags={[
          { label: "AI-generated", color: "blue" },
          { label: "Collaboration", color: "gray" },
          { label: "Communication", color: "gray" },
        ]}
      />
      <QuestionCard 
        text="Can you walk me through a time you identified a performance bottleneck in a front-end application and how you resolved it?"
        tags={[
          { label: "AI-generated", color: "blue" },
          { label: "Performance", color: "gray" },
          { label: "Intermediate", color: "orange" },
        ]}
      />
    </div>
  );
}

function ImportedQuestionsList() {
  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="grid grid-cols-3 gap-4 mb-2">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-1 text-center">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rows detected</span>
          <span className="text-2xl font-bold text-gray-900">124</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-1 text-center">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Valid questions</span>
          <span className="text-2xl font-bold text-gray-900">118</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-1 text-center">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Needs review</span>
          <span className="text-2xl font-bold text-gray-900">6</span>
        </div>
      </div>

      <div className="flex items-center justify-between pb-2 border-b border-gray-100 mt-2">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search imported questions..." 
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all text-gray-700"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none">
              <option>All Categories</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <div className="relative">
            <select className="appearance-none pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none">
              <option>Review status</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <QuestionCard 
        text="Describe how you would evaluate a candidate's proficiency in React performance optimization when working on a fast-moving product team."
        tags={[
          { label: "Bulk Upload", color: "teal" },
          { label: "Frontend", color: "gray" },
          { label: "Performance", color: "gray" },
          { label: "Validated", color: "green" },
        ]}
        isActive
        activeColor="teal"
      />
      <QuestionCard 
        text="How would you assess whether a product designer can balance research insights with shipping speed during a hiring sprint?"
        tags={[
          { label: "Bulk Upload", color: "teal" },
          { label: "Design", color: "gray" },
          { label: "Hiring process", color: "gray" },
          { label: "Needs review", color: "orange-solid" },
        ]}
      />
      <QuestionCard 
        text="Tell me how you would measure backend ownership, API reliability, and communication quality for a senior engineering manager candidate."
        tags={[
          { label: "Bulk Upload", color: "teal" },
          { label: "Backend", color: "gray" },
          { label: "Leadership", color: "gray" },
          { label: "Validated", color: "green" },
        ]}
      />
    </div>
  );
}


function QuestionCard({ 
  text, 
  tags, 
  isActive = false,
  activeColor = "blue"
}: { 
  text: string, 
  tags: {label: string, color: string}[], 
  isActive?: boolean,
  activeColor?: "blue" | "teal"
}) {
  return (
    <div className={cn(
      "bg-white p-4 rounded-xl border transition-all",
      isActive 
        ? activeColor === "teal" 
          ? "border-teal-400 shadow-[0_0_0_1px_rgba(45,212,191,1)]" 
          : "border-[#0ea5e9] shadow-[0_0_0_1px_rgba(14,165,233,1)]"
        : "border-gray-100 hover:border-gray-200 shadow-sm"
    )}>
      <div className="flex gap-4">
        <p className="flex-1 text-sm font-medium text-gray-800 leading-relaxed">
          {text}
        </p>
        <div className="flex items-start gap-1">
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Edit2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-4">
        {tags.map((tag, i) => (
          <span key={i} className={cn(
            "px-2.5 py-1 text-[11px] font-bold rounded-md",
            tag.color === "blue" && "bg-[#0ea5e9]/10 text-[#0ea5e9]",
            tag.color === "teal" && "bg-teal-50 text-teal-600",
            tag.color === "orange" && "bg-orange-50 text-orange-600",
            tag.color === "orange-solid" && "bg-orange-100 text-orange-700",
            tag.color === "green" && "bg-emerald-50 text-emerald-600",
            tag.color === "gray" && "bg-gray-50 text-gray-600 border border-gray-100",
            tag.color === "gray-solid" && "bg-gray-100 text-gray-700",
          )}>
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function AIInterviewPreview() {
  return (
    <div className="sticky top-[65px] flex flex-col gap-5 p-6 lg:p-8 w-full h-[calc(100vh-65px)] overflow-y-auto">
      <div className="shrink-0">
        <h2 className="text-[17px] font-bold text-gray-900">AI interview preview</h2>
        <p className="text-[13px] text-[#8c9fc4] mt-1 leading-relaxed pr-4">
          See how the selected question appears to the candidate during the AI interview flow.
        </p>
      </div>

      {/* Phone Mockup */}
      <div className="bg-[#1e2532] rounded-[18px] overflow-hidden flex flex-col w-full flex-1 shrink-0 min-h-[300px] shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        {/* Inner Screen */}
        <div className="flex-1 flex flex-col relative h-full">
          {/* Main Content Area */}
          <div className="flex-1 p-5 flex flex-col justify-center relative">
            {/* Message Bubble Container */}
            <div className="relative z-10 flex flex-col gap-2.5 items-start w-full mt-auto mb-10">
                {/* AI Badge */}
                <div className="flex items-center gap-1.5 bg-[#2a3545] px-3 py-1.5 rounded-full border border-white/5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#00e5ff]" />
                    <span className="text-[11px] font-semibold text-white tracking-wide">AI interviewer</span>
                </div>

                {/* Question Bubble */}
                <div className="bg-white text-gray-900 p-5 rounded-[20px] text-[13.5px] leading-relaxed w-full font-medium shadow-sm">
                    How would you design a scalable React component system for a product with multiple hiring workflows and reusable assessment steps? Please explain your architecture, ownership model, and testing strategy.
                </div>
            </div>
          </div>

          {/* Camera Preview Area */}
          <div className="h-[90px] bg-black flex items-center justify-center shrink-0">
            <span className="text-[11px] font-bold tracking-wide text-white/80">Candidate camera preview</span>
          </div>
        </div>
      </div>

      {/* Attributes Metadata Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-3 shadow-sm w-full shrink-0">
        <div className="flex justify-between items-start text-[12.5px]">
          <span className="text-[#8c9fc4] font-medium">Assigned role</span>
          <span className="font-bold text-gray-900 text-right">Senior Frontend<br/>Engineer</span>
        </div>
        <div className="flex justify-between items-center text-[12.5px]">
          <span className="text-[#8c9fc4] font-medium">Interview round</span>
          <span className="font-bold text-gray-900">Technical deep-dive</span>
        </div>
        <div className="flex justify-between items-center text-[12.5px]">
          <span className="text-[#8c9fc4] font-medium">Expected answer length</span>
          <span className="font-bold text-gray-900">2-4 minutes</span>
        </div>
        <div className="flex justify-between items-start text-[12.5px]">
          <span className="text-[#8c9fc4] font-medium">Scoring focus</span>
          <span className="font-bold text-gray-900 text-right pl-4 leading-tight">Architecture, tradeoffs,<br/>clarity</span>
        </div>
      </div>
    </div>
  );
}
