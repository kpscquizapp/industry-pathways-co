import React, { useState } from "react";
import { ArrowLeft, LayoutGrid, ListChecks, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetTestReportQuery } from "@/app/queries/contractorSkillTest";
import { Loader2, AlertCircle } from "lucide-react";

const MockTestReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const testId = queryParams.get("id");
  
  const [activeTab, setActiveTab] = useState("detailed");
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const { data: reportData, isLoading, error } = useGetTestReportQuery(testId || "", {
    skip: !testId,
  });

  const report = reportData?.data;

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "detailed", label: "Detailed Review", icon: ListChecks },
    { id: "audit", label: "Audit Trail", icon: ShieldCheck },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#0ea5e9]" />
        <p className="text-slate-500 font-medium font-inter">Loading your assessment report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <h3 className="text-xl font-bold text-slate-800">Report Not Found</h3>
        <p className="text-slate-500 max-w-md text-center">We couldn't retrieve the report for this assessment. It might still be processing or the ID is invalid.</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-6 py-2 bg-[#0F172A] text-white rounded-lg font-bold">
          Go Back
        </button>
      </div>
    );
  }

  const currentQuestion = report.questions[activeQuestionIndex];

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
            {report.test.title}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-3 text-[13px] font-medium text-slate-400">
            <span className="px-2 py-0.5 rounded-md border border-slate-200 text-slate-600 font-bold text-[11px]">
              {report.test.difficulty}
            </span>
            <span>Completed on {new Date(report.test.createdAt).toLocaleDateString()}</span>
            <span className="hidden sm:inline">•</span>
            <span>Duration: {report.test.duration} mins</span>
          </div>
        </div>

        {/* Score Circle */}
        <div className="flex items-center justify-center shrink-0">
          <div className="w-[84px] h-[84px] rounded-full border-[4px] border-[#22c55e] flex items-center justify-center bg-white shadow-sm">
            <div className="w-full h-full rounded-full border-4 border-transparent flex items-center justify-center text-[22px] font-black text-[#22c55e]">
              {report.test.overallScore}%
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
              <div className="text-3xl font-black text-slate-800 mb-2">{report.stats.questionsReviewed}</div>
              <div className="text-[12px] font-medium text-slate-400 leading-snug">MCQs, short answers, and coding tasks</div>
            </div>
            <div className="p-5 border border-slate-100 rounded-2xl bg-white shadow-sm flex flex-col justify-between">
              <div className="text-[11px] font-bold text-slate-400 mb-2">Correct Answers</div>
              <div className="text-3xl font-black text-slate-800 mb-2">{report.stats.correctAnswers}</div>
              <div className="text-[12px] font-medium text-slate-400 leading-snug">Strong performance in key competencies</div>
            </div>
            <div className="p-5 border border-slate-100 rounded-2xl bg-white shadow-sm flex flex-col justify-between">
              <div className="text-[11px] font-bold text-slate-400 mb-2">Coding Accuracy</div>
              <div className="text-3xl font-black text-slate-800 mb-2">{report.stats.codingAccuracy}%</div>
              <div className="text-[12px] font-medium text-slate-400 leading-snug">Based on test case execution results</div>
            </div>
            <div className="p-5 border border-slate-100 rounded-2xl bg-white shadow-sm flex flex-col justify-between">
              <div className="text-[11px] font-bold text-slate-400 mb-2">Improvement Focus</div>
              <div className="text-[22px] leading-none mb-1 mt-1 font-black text-slate-800">{report.stats.improvementFocus}</div>
              <div className="text-[12px] font-medium text-slate-400 leading-snug mt-2">Key area recommended for further study</div>
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
                  {report.questions.map((q: any, index: number) => (
                    <div 
                      key={q.id}
                      onClick={() => setActiveQuestionIndex(index)}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl border border-transparent cursor-pointer transition-all",
                        activeQuestionIndex === index ? "bg-[#f0fdfa] border-[#ccfbf1]" : "bg-white hover:bg-slate-50"
                      )}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-[13px] text-slate-800">Q{index + 1}</span>
                        <span className="text-[12px] font-medium text-slate-400 truncate max-w-[120px]">{q.title}</span>
                      </div>
                      <div className={cn(
                        "w-2.5 h-2.5 rounded-full",
                        q.status === 'Correct' ? "bg-[#22c55e]" : q.status === 'Incorrect' ? "bg-red-500" : "bg-slate-300"
                      )}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Questions List Content */}
            <div className="lg:col-span-3 flex flex-col gap-6">

              <div className="border border-slate-100 bg-white shadow-sm rounded-2xl p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div className="flex gap-4">
                    <span className="font-bold text-slate-600 mt-0.5 text-[15px]">Q{activeQuestionIndex + 1}</span>
                    <p className="font-bold text-slate-800 text-[15px] leading-relaxed">
                      {currentQuestion.title}
                    </p>
                  </div>
                  <div className={cn(
                    "px-3 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 h-fit border",
                    currentQuestion.status === 'Correct' ? "bg-[#f0fdfa] border-[#ccfbf1]" : "bg-red-50 border-red-100"
                  )}>
                    {currentQuestion.status === 'Correct' ? (
                      <>
                        <CheckCircle2 size={14} className="text-[#10b981]" />
                        <span className="text-[12px] font-bold text-[#10b981]">Passed</span>
                      </>
                    ) : (
                      <>
                        <XCircle size={14} className="text-red-500" />
                        <span className="text-[12px] font-bold text-red-600">Failed</span>
                      </>
                    )}
                  </div>
                </div>

                {currentQuestion.submittedCode && (
                  <div className="bg-[#0F172A] rounded-xl p-5 mb-8">
                    <div className="text-[10px] font-bold text-slate-400 mb-4 tracking-wider uppercase">Your Submitted Code</div>
                    <pre className="text-slate-300 text-[13.5px] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
                      {currentQuestion.submittedCode}
                    </pre>
                  </div>
                )}

                <div className="mb-8">
                  <h5 className="text-[14px] font-bold text-slate-800 mb-3">AI Evaluation Feedback</h5>
                  <p className="text-[13.5px] font-medium text-slate-500 leading-relaxed whitespace-pre-wrap">
                    {currentQuestion.aiFeedback}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentQuestion.auditTrail.map((audit: any, i: number) => (
                    <div key={i} className="bg-[#f8f9fb] p-4 rounded-xl border border-slate-50 font-inter">
                      <div className="text-[11px] font-bold text-slate-400 mb-1.5">
                        {new Date(audit.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-[13px] font-bold text-slate-600 leading-snug">
                        {audit.event}
                      </div>
                    </div>
                  ))}
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
