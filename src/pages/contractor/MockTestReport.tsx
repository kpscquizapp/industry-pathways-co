import React, { useState } from "react";
import { ArrowLeft, LayoutGrid, ListChecks, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const MockTestReport = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("detailed");

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "detailed", label: "Detailed Review", icon: ListChecks },
    { id: "audit", label: "Audit Trail", icon: ShieldCheck },
  ];

  return (
    <div className="flex flex-col gap-6 py-4 sm:px-2 font-sans animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-full mx-auto w-full font-inter">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-[13px] font-bold transition-colors mb-3"
          >
            <ArrowLeft size={16} /> Back to Mock Tests
          </button>
          <h2 className="text-2xl md:text-[28px] font-black tracking-tight text-slate-900 leading-tight">
            ReactJS Frontend Development
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-[13px] font-medium text-slate-400">
            <span className="px-2 py-0.5 rounded-md border border-slate-200 text-slate-600 font-bold text-[11px]">
              Intermediate
            </span>
            <span>Completed on Oct 24, 2023</span>
            <span className="hidden sm:inline">•</span>
            <span>Duration: 42 mins</span>
          </div>
        </div>

        {/* Score Circle */}
        <div className="flex items-center justify-center shrink-0">
          <div className="w-[84px] h-[84px] rounded-full border-[4px] border-[#22c55e] flex items-center justify-center bg-white shadow-sm">
            <div className="w-full h-full rounded-full border-4 border-transparent flex items-center justify-center text-[22px] font-black text-[#22c55e]">
              88%
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-3 border-b border-transparent pb-2 mt-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-[13px] transition-all border",
                isActive
                  ? "bg-[#f0fdfa] border-[#ccfbf1] text-[#0ea5e9] shadow-sm"
                  : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
              )}
            >
              <Icon size={16} /> {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "detailed" && (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <div className="p-5 border border-slate-100 rounded-2xl bg-white shadow-sm flex flex-col justify-between">
              <div className="text-[11px] font-bold text-slate-400 mb-2">Questions Reviewed</div>
              <div className="text-3xl font-black text-slate-800 mb-2">12</div>
              <div className="text-[12px] font-medium text-slate-400 leading-snug">MCQs, short answers, and coding tasks</div>
            </div>
            <div className="p-5 border border-slate-100 rounded-2xl bg-white shadow-sm flex flex-col justify-between">
              <div className="text-[11px] font-bold text-slate-400 mb-2">Correct Answers</div>
              <div className="text-3xl font-black text-slate-800 mb-2">8</div>
              <div className="text-[12px] font-medium text-slate-400 leading-snug">Strong performance in React fundamentals</div>
            </div>
            <div className="p-5 border border-slate-100 rounded-2xl bg-white shadow-sm flex flex-col justify-between">
              <div className="text-[11px] font-bold text-slate-400 mb-2">Coding Accuracy</div>
              <div className="text-3xl font-black text-slate-800 mb-2">91%</div>
              <div className="text-[12px] font-medium text-slate-400 leading-snug">Passed all hidden tests in the coding round</div>
            </div>
            <div className="p-5 border border-slate-100 rounded-2xl bg-white shadow-sm flex flex-col justify-between">
              <div className="text-[11px] font-bold text-slate-400 mb-2">Improvement Focus</div>
              <div className="text-[22px] leading-none mb-1 mt-1 font-black text-slate-800">Optimization</div>
              <div className="text-[12px] font-medium text-slate-400 leading-snug mt-2">useMemo, render efficiency, and hook usage</div>
            </div>
          </div>

          {/* Main Layout: Nav + Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Question Navigator */}
            <div className="lg:col-span-1">
              <div className="border border-slate-100 bg-white shadow-sm rounded-2xl p-5 sticky top-6">
                <h4 className="font-bold text-slate-800 mb-3 text-[15px]">Question Navigator</h4>
                <p className="text-[12px] font-medium text-slate-400 mb-5 leading-relaxed">
                  Open one detailed review tab at a time, so the screen stays focused and avoids long scrolling.
                </p>
                <div className="flex flex-col gap-2">

                  <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-transparent bg-[#f0fdfa] cursor-pointer">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-[13px] text-slate-800">Q1</span>
                      <span className="text-[12px] font-medium text-slate-400">React concepts</span>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-transparent bg-white hover:bg-slate-50 cursor-pointer">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-[13px] text-slate-800">Q2</span>
                      <span className="text-[12px] font-medium text-slate-400">Hooks optimization</span>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-transparent bg-white hover:bg-slate-50 cursor-pointer">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-[13px] text-slate-800">Q3</span>
                      <span className="text-[12px] font-medium text-slate-400">Coding task</span>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></div>
                  </div>

                  <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-transparent bg-white hover:bg-slate-50 cursor-pointer">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-[13px] text-slate-800">Q4</span>
                      <span className="text-[12px] font-medium text-slate-400">State management</span>
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                  </div>

                </div>
              </div>
            </div>

            {/* Questions List Content */}
            <div className="lg:col-span-3 flex flex-col gap-6">

              {/* Q3 Card */}
              <div className="border border-slate-100 bg-white shadow-sm rounded-2xl p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div className="flex gap-4">
                    <span className="font-bold text-slate-600 mt-0.5 text-[15px]">Q3</span>
                    <p className="font-bold text-slate-800 text-[15px] leading-relaxed">
                      Write a utility function to debounce user input. It should delay the execution of a function until a specified amount of time has passed since the last call. (Coding Task)
                    </p>
                  </div>
                  <div className="px-3 py-1.5 bg-[#f0fdfa] rounded-lg flex items-center gap-1.5 shrink-0 h-fit border border-[#ccfbf1]">
                    <CheckCircle2 size={14} className="text-[#10b981]" />
                    <span className="text-[12px] font-bold text-[#10b981]">3/3 Tests Passed</span>
                  </div>
                </div>

                <div className="bg-[#0F172A] rounded-xl p-5 mb-8">
                  <div className="text-[10px] font-bold text-slate-400 mb-4 tracking-wider uppercase">Your Submitted Code</div>
                  <pre className="text-slate-300 text-[13.5px] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
                    {`function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}`}
                  </pre>
                </div>

                <div className="mb-8">
                  <h5 className="text-[14px] font-bold text-slate-800 mb-3">AI Evaluation Feedback</h5>
                  <p className="text-[13.5px] font-medium text-slate-500 leading-relaxed">
                    Excellent implementation. You correctly handled closure for the timeout variable, preserved the arguments inside the returned function, and kept the solution efficient. To make this even stronger, you could also preserve <span className="font-bold text-slate-700">this</span> context explicitly for edge cases in older callback patterns.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#f8f9fb] p-4.5 p-4 rounded-xl border border-slate-50">
                    <div className="text-[11px] font-bold text-slate-400 mb-1.5">10:25 AM</div>
                    <div className="text-[13px] font-bold text-slate-600 leading-snug">Coding test started in full-screen mode</div>
                  </div>
                  <div className="bg-[#f8f9fb] p-4.5 p-4 rounded-xl border border-slate-50">
                    <div className="text-[11px] font-bold text-slate-400 mb-1.5">10:34 AM</div>
                    <div className="text-[13px] font-bold text-slate-600 leading-snug">Three hidden test cases executed successfully</div>
                  </div>
                  <div className="bg-[#f8f9fb] p-4.5 p-4 rounded-xl border border-slate-50">
                    <div className="text-[11px] font-bold text-slate-400 mb-1.5">10:42 AM</div>
                    <div className="text-[13px] font-bold text-slate-600 leading-snug">Submission locked and evaluation completed</div>
                  </div>
                </div>
              </div>

              {/* Q2 Card */}
              <div className="border border-slate-100 bg-white shadow-sm rounded-2xl p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div className="flex gap-4">
                    <span className="font-bold text-slate-600 mt-0.5 text-[15px]">Q2</span>
                    <p className="font-bold text-slate-800 text-[15px] leading-relaxed">
                      Which hook is best suited for deriving state that is computationally expensive to calculate on every render?
                    </p>
                  </div>
                  <div className="px-3 py-1.5 bg-red-50 rounded-lg flex items-center gap-1.5 shrink-0 h-fit border border-red-100">
                    <XCircle size={14} className="text-red-500" />
                    <span className="text-[12px] font-bold text-red-600">Incorrect</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  <div className="bg-red-50/60 p-5 rounded-xl border border-red-100/60">
                    <div className="text-[11px] font-bold text-red-400/80 mb-2 tracking-wider">YOUR ANSWER</div>
                    <div className="text-[15px] font-bold text-slate-800">useCallback</div>
                  </div>
                  <div className="bg-[#f0fdfa] p-5 rounded-xl border border-[#ccfbf1]">
                    <div className="text-[11px] font-bold text-[#10b981] mb-2 tracking-wider">CORRECT ANSWER</div>
                    <div className="text-[15px] font-bold text-slate-800">useMemo</div>
                  </div>
                </div>

                <div>
                  <h5 className="text-[14px] font-bold text-slate-800 mb-3">Explanation</h5>
                  <p className="text-[13.5px] font-medium text-slate-500 leading-relaxed">
                    <span className="font-bold text-slate-700">useMemo</span> memoizes computed values, while <span className="font-bold text-slate-700">useCallback</span> memoizes function references. For expensive calculations that should not rerun on every render, <span className="font-bold text-slate-700">useMemo</span> is the better choice.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {activeTab !== "detailed" && (
        <div className="bg-white border border-slate-100 rounded-2xl p-10 shadow-sm min-h-[300px] flex items-center justify-center text-center">
          <div className="flex flex-col gap-2 max-w-sm">
            <LayoutGrid className="mx-auto text-slate-300 w-12 h-12 mb-2" />
            <h3 className="text-lg font-bold text-slate-800">Section Under Development</h3>
            <p className="text-sm font-medium text-slate-400">
              You are currently previewing the Mock Test Report design. Switch to the <span className="font-bold text-slate-600 border-b border-slate-200">Detailed Review</span> tab to see the implemented layout.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};

export default MockTestReport;
