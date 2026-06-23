import React, { useState, useEffect, useRef } from "react";
import { Timer, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestTimerProps {
  startedAt: string | Date;
  totalMinutes: number;
  onTimeUp: () => void;
}

const TestTimer: React.FC<TestTimerProps> = ({
  startedAt,
  totalMinutes,
  onTimeUp,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const onTimeUpRef = useRef(onTimeUp);
  const hasFiredRef = useRef(false);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const calculateTimeLeft = () => {
      const start = new Date(startedAt).getTime();
      const end = start + totalMinutes * 60 * 1000;
      const now = new Date().getTime();
      const remaining = Math.max(0, Math.floor((end - now) / 1000));

      setTimeLeft(remaining);

      if (remaining === 0) {
        if (!hasFiredRef.current) {
          hasFiredRef.current = true;
          onTimeUpRef.current();
        }
        if (interval) clearInterval(interval);
      }
    };

    calculateTimeLeft();
    if (!hasFiredRef.current) {
      interval = setInterval(calculateTimeLeft, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startedAt, totalMinutes]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ":" : ""}${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const isLowTime = timeLeft < 300; // less than 5 minutes
  const isUrgentTime = timeLeft < 60;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full font-mono font-bold text-lg min-w-[120px] justify-center transition-colors",
        isLowTime
          ? "bg-red-100 text-red-700 border border-red-200 shadow-sm"
          : "bg-slate-100 text-slate-700 border border-slate-200",
      )}
    >
      {isLowTime ? (
        <AlertTriangle
          className={cn(
            "h-5 w-5",
            isUrgentTime && "animate-pulse motion-reduce:animate-none",
          )}
        />
      ) : (
        <Timer className="h-5 w-5" />
      )}
      <span
        className={cn(
          "tabular-nums leading-none",
          isUrgentTime && "animate-pulse motion-reduce:animate-none",
          isUrgentTime && "text-red-800",
        )}
      >
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};

export default TestTimer;
