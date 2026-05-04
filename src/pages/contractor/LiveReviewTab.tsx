import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  AlertTriangle,
  Clock,
  Monitor,
  Camera,
  Loader2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  SkipBack,
  SkipForward,
} from "lucide-react";
import {
  useGetSessionViolationsQuery,
  useGetRecordingPlayQuery,
} from "@/app/queries/contractorSkillTest";

interface LiveReviewTabProps {
  sessionId: string;
}

function formatTime(sec: number): string {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const LiveReviewTab: React.FC<LiveReviewTabProps> = ({ sessionId }) => {
  const skip = !sessionId;

  const { data: violationsData, isLoading: violLoading } =
    useGetSessionViolationsQuery(sessionId, { skip });

  const {
    data: webcamSrc,
    isLoading: webcamLoading,
    isError: webcamError,
  } = useGetRecordingPlayQuery({ sessionId, type: "webcam" }, { skip });

  const {
    data: screenSrc,
    isLoading: screenLoading,
    isError: screenError,
  } = useGetRecordingPlayQuery({ sessionId, type: "screen" }, { skip });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const webcamRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);

  // Player state
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout>>();

  // Track fullscreen changes (user pressing Escape, or our toggle)
  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Set video src from RTK Query blob URLs
  useEffect(() => {
    if (webcamSrc && webcamRef.current) {
      const w = webcamRef.current;
      w.src = webcamSrc;
      w.muted = false; // allow microphone audio to play
      w.volume = volume;
    }
  }, [webcamSrc]);

  useEffect(() => {
    if (screenSrc && screenRef.current) {
      const v = screenRef.current;
      v.src = screenSrc;
      v.muted = false; // ensure audio plays
      v.volume = volume;
      v.onloadedmetadata = () => setDuration(v.duration);
      v.ontimeupdate = () => setCurrentTime(v.currentTime);
      v.onplay = () => setPlaying(true);
      v.onpause = () => setPlaying(false);
      v.onended = () => setPlaying(false);
    }
  }, [screenSrc]);

  // Sync webcam to screen seek
  const syncWebcam = useCallback((time: number) => {
    if (webcamRef.current) webcamRef.current.currentTime = time;
  }, []);

  // Controls
  const togglePlay = useCallback(() => {
    const v = screenRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
      webcamRef.current?.play().catch(() => {});
    } else {
      v.pause();
      webcamRef.current?.pause();
    }
  }, []);

  const seek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const t = Number(e.target.value);
      if (screenRef.current) screenRef.current.currentTime = t;
      syncWebcam(t);
      setCurrentTime(t);
    },
    [syncWebcam],
  );

  const skip10 = useCallback(
    (dir: 1 | -1) => {
      const v = screenRef.current;
      if (!v) return;
      const t = Math.max(0, Math.min(v.duration, v.currentTime + dir * 10));
      v.currentTime = t;
      syncWebcam(t);
    },
    [syncWebcam],
  );

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      if (screenRef.current) screenRef.current.muted = next;
      if (webcamRef.current) webcamRef.current.muted = next;
      return next;
    });
  }, []);

  const changeVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (screenRef.current) {
      screenRef.current.volume = v;
      screenRef.current.muted = v === 0;
    }
    if (webcamRef.current) {
      webcamRef.current.volume = v;
      webcamRef.current.muted = v === 0;
    }
    setMuted(v === 0);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      containerRef.current?.requestFullscreen?.();
    }
  }, []);

  // Auto-hide controls
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  }, [playing]);

  useEffect(() => () => clearTimeout(hideControlsTimer.current), []);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("fullscreenchange", resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, w, h);

      const screen = screenRef.current;
      if (screen && screen.readyState >= 2) {
        ctx.drawImage(screen, 0, 0, w, h);
      } else {
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#475569";
        ctx.font = "15px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          screenError
            ? "Screen recording not available"
            : "Loading screen recording…",
          w / 2,
          h / 2,
        );
      }

      const webcam = webcamRef.current;
      const pipW = w * 0.25;
      const pipH = h * 0.25;
      const pipX = w - pipW - 12;
      // push PiP above controls bar (48px)
      const pipY = h - pipH - 60;

      if (webcam && webcam.readyState >= 2) {
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.6)";
        ctx.shadowBlur = 14;
        ctx.drawImage(webcam, pipX, pipY, pipW, pipH);
        ctx.restore();
        ctx.strokeStyle = "rgba(14,165,233,0.7)";
        ctx.lineWidth = 2;
        ctx.strokeRect(pipX, pipY, pipW, pipH);
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(pipX, pipY, 66, 20);
        ctx.fillStyle = "#e2e8f0";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "left";
        ctx.fillText("Webcam", pipX + 5, pipY + 14);
      } else {
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(pipX, pipY, pipW, pipH);
        ctx.strokeStyle = "rgba(100,116,139,0.4)";
        ctx.lineWidth = 1;
        ctx.strokeRect(pipX, pipY, pipW, pipH);
        ctx.fillStyle = "#64748b";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          webcamError ? "No webcam" : "…",
          pipX + pipW / 2,
          pipY + pipH / 2,
        );
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("fullscreenchange", resize);
    };
  }, [webcamError, screenError]);

  const isVideoLoading = webcamLoading || screenLoading;
  const session = violationsData?.session;
  const violations: any[] = violationsData?.violations ?? [];

  const typeStyle: Record<string, string> = {
    "Tab Switched": "bg-yellow-50 border-yellow-200 text-yellow-700",
    "Face Not Detected": "bg-red-50 border-red-200 text-red-700",
    "Multiple Faces": "bg-orange-50 border-orange-200 text-orange-700",
    "Phone Detected": "bg-purple-50 border-purple-200 text-purple-700",
    "Copying Detected": "bg-rose-50 border-rose-200 text-rose-700",
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Video Player ── */}
      <div
        ref={containerRef}
        className={`relative w-full bg-slate-900 overflow-hidden shadow-xl group ${
          isFullscreen ? "rounded-none" : "rounded-2xl"
        }`}
        style={
          isFullscreen
            ? { width: "100%", height: "100%" }
            : { aspectRatio: "16/9" }
        }
        onMouseMove={resetHideTimer}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => !playing && setShowControls(true)}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-pointer"
          onClick={togglePlay}
        />

        {/* Hidden video elements – use offscreen positioning instead of display:none
            so the browser doesn't suppress audio playback */}
        <video
          ref={webcamRef}
          playsInline
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            overflow: "hidden",
            opacity: 0,
          }}
        />
        {/* Screen video: NOT muted so audio plays */}
        <video
          ref={screenRef}
          playsInline
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            overflow: "hidden",
            opacity: 0,
          }}
        />

        {/* Loading overlay */}
        {isVideoLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 gap-3 backdrop-blur-sm">
            <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
            <p className="text-slate-300 text-sm font-medium">
              Loading session recordings…
            </p>
          </div>
        )}

        {/* ── Controls overlay ── */}
        {!isVideoLoading && (
          <div
            className={`absolute inset-x-0 bottom-0 transition-opacity duration-200 ${
              showControls ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

            <div className="relative px-4 pb-3 pt-6 flex flex-col gap-2 w-full box-border">
              {/* Seek bar */}
              <div
                className="relative w-full group/seek py-2 cursor-pointer"
                style={{ minWidth: 0 }}
              >
                {/* Track background */}
                <div className="relative h-1.5 w-full">
                  <div className="absolute inset-0 rounded-full bg-white/20" />
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-sky-400"
                    style={{ width: `${progress}%` }}
                  />
                  {/* Thumb dot – pointer-events-none so clicks pass through to input */}
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-sky-400 shadow border-2 border-white transition-transform group-hover/seek:scale-125 pointer-events-none"
                    style={{ left: `calc(${progress}% - 6px)` }}
                  />
                </div>
                {/* Invisible range input on top of everything */}
                <input
                  type="range"
                  min={0}
                  max={duration || 0}
                  step={0.1}
                  value={currentTime}
                  onChange={seek}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                  style={{ margin: 0, height: "100%", zIndex: 10 }}
                  aria-label="Seek"
                />
              </div>

              {/* Buttons row */}
              <div
                className="flex items-center gap-3 flex-wrap"
                style={{ minWidth: 0 }}
              >
                {/* Skip back */}
                <button
                  onClick={() => skip10(-1)}
                  className="text-white/70 hover:text-white transition-colors flex-shrink-0"
                  title="–10s"
                >
                  <SkipBack size={17} />
                </button>

                {/* Play / Pause */}
                <button
                  onClick={togglePlay}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors flex-shrink-0"
                  title={playing ? "Pause" : "Play"}
                >
                  {playing ? <Pause size={17} /> : <Play size={17} />}
                </button>

                {/* Skip forward */}
                <button
                  onClick={() => skip10(1)}
                  className="text-white/70 hover:text-white transition-colors flex-shrink-0"
                  title="+10s"
                >
                  <SkipForward size={17} />
                </button>

                {/* Time */}
                <span className="text-[12px] text-white/70 font-mono select-none flex-shrink-0">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                {/* Spacer */}
                <div className="flex-1" style={{ minWidth: "8px" }} />

                {/* Stream labels */}
                <div className="flex items-center gap-1.5 px-2 py-1 bg-black/40 rounded text-[11px] text-white/70 backdrop-blur-sm flex-shrink-0">
                  <Monitor size={11} /> Screen
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-black/40 rounded text-[11px] text-white/70 backdrop-blur-sm flex-shrink-0">
                  <Camera size={11} /> PiP
                </div>

                {/* Volume */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={toggleMute}
                    className="text-white/70 hover:text-white transition-colors"
                    title={muted ? "Unmute" : "Mute"}
                  >
                    {muted || volume === 0 ? (
                      <VolumeX size={17} />
                    ) : (
                      <Volume2 size={17} />
                    )}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={muted ? 0 : volume}
                    onChange={changeVolume}
                    className="w-16 accent-sky-400 cursor-pointer"
                    aria-label="Volume"
                  />
                </div>

                {/* Fullscreen toggle */}
                <button
                  onClick={toggleFullscreen}
                  className="text-white/70 hover:text-white transition-colors flex-shrink-0"
                  title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {isFullscreen ? (
                    <Minimize2 size={17} />
                  ) : (
                    <Maximize2 size={17} />
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Session meta ── */}
      {session && (
        <div className="flex flex-wrap gap-4 text-[13px] text-slate-500 px-1">
          <span className="capitalize">
            <span className="font-semibold text-slate-700">Status:</span>{" "}
            {session.status}
            {session.ended_at && (
              <>
                <span className="font-semibold text-slate-700 ml-4">
                  Completed on:
                </span>{" "}
                {session.ended_at.split("T")[0]}
              </>
            )}
          </span>
        </div>
      )}

      {/* ── Violation Logs ── */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-[15px] font-bold text-slate-800 mb-4 flex items-center gap-2">
          <AlertTriangle size={17} className="text-amber-500" />
          Violation Logs
          {violations.length > 0 && (
            <span className="ml-auto px-2.5 py-0.5 bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold rounded-full">
              {violations.length}
            </span>
          )}
        </h3>

        {violLoading && (
          <p className="text-slate-400 text-sm">Loading violations…</p>
        )}
        {!violLoading && violations.length === 0 && (
          <p className="text-slate-400 text-sm">
            No violations recorded for this session.
          </p>
        )}

        {violations.length > 0 && (
          <ul className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {violations.map((v: any) => (
              <li
                key={v.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-100 bg-slate-50"
              >
                <span
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border ${
                    typeStyle[v.type] ??
                    "bg-slate-100 border-slate-200 text-slate-600"
                  }`}
                >
                  {v.type}
                </span>
                {/* <span className="flex items-center gap-1 text-[12px] text-slate-400 ml-auto whitespace-nowrap">
                  <Clock size={11} />
                  {new Date(v.timestamp).toLocaleTimeString()}
                </span> */}
                {v.question_id && (
                  <span className="text-[11px] text-slate-400">
                    Q#{v.question_id}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LiveReviewTab;
