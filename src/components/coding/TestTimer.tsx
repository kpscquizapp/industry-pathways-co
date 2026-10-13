import React, { useState, useEffect, useRef } from "react";
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
    <span
      className={cn(
        "font-mono text-xl font-semibold leading-none tabular-nums transition-colors",
        isLowTime ? "text-red-300" : "text-white",
        isUrgentTime && "animate-pulse motion-reduce:animate-none",
      )}
    >
      {formatTime(timeLeft)}
    </span>
  );
};

export default TestTimer;
