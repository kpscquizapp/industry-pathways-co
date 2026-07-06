import React, { useRef, useState, useCallback, useEffect } from "react";
import ReactPlayer from "react-player";
import {
  AlertTriangle,
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
  Gauge,
} from "lucide-react";
import {
  useGetSessionViolationsQuery,
  useGetRecordingPlayQuery,
} from "@/app/queries/contractorSkillTest";
import { Badge } from "@/components/ui/badge";

interface LiveReviewTabProps {
  sessionId: string;
}

function formatTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

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

  // v3: refs point directly to the underlying HTMLVideoElement
  const screenRef = useRef<HTMLVideoElement>(null);
  const webcamRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Player state
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout>>();

  // Track fullscreen changes
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  // Auto-hide controls
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(hideControlsTimer.current);
    hideControlsTimer.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  useEffect(() => () => clearTimeout(hideControlsTimer.current), []);

  // Sync webcam to screen position — v3: direct currentTime assignment
  const syncWebcamTo = useCallback((seconds: number) => {
    if (webcamRef.current) webcamRef.current.currentTime = seconds;
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

  const skipSeconds = useCallback(
    (dir: number) => {
      const next = Math.max(0, Math.min(duration, currentTime + dir));
      if (screenRef.current) screenRef.current.currentTime = next;
      syncWebcamTo(next);
      setCurrentTime(next);
    },
    [currentTime, duration, syncWebcamTo],
  );

  const onSeekBarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const t = Number(e.target.value);
      if (screenRef.current) screenRef.current.currentTime = t;
      syncWebcamTo(t);
      setCurrentTime(t);
    },
    [syncWebcamTo],
  );

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      const next = !m;
      if (screenRef.current) screenRef.current.muted = next;
      if (webcamRef.current) webcamRef.current.muted = true; // webcam is always muted
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
    setMuted(v === 0);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      containerRef.current?.requestFullscreen?.();
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as Element | null;
      if (
        target?.closest(
          'input, textarea, select, button, a, [contenteditable="true"]',
        )
      ) {
        return;
      }

      switch (e.key) {
        case " ":
        case "k":
          e.preventDefault();
          togglePlay();
          break;
        case "ArrowLeft":
          e.preventDefault();
          skipSeconds(-10);
          break;
        case "ArrowRight":
          e.preventDefault();
          skipSeconds(10);
          break;
        case "m":
        case "M":
          toggleMute();
          break;
        case "f":
        case "F":
          toggleFullscreen();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlay, skipSeconds, toggleMute, toggleFullscreen]);

  // v3 native video event handlers
  const onTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const v = e.currentTarget;
      setCurrentTime(v.currentTime);
      if (v.buffered.length > 0) {
        setBuffered(
          (v.buffered.end(v.buffered.length - 1) / (v.duration || 1)) * 100,
        );
      }
    },
    [],
  );

  const onDurationChange = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      setDuration(e.currentTarget.duration);
    },
    [],
  );

  const onPlay = useCallback(() => {
    setPlaying(true);
    resetHideTimer();
    // Keep webcam in sync
    webcamRef.current?.play().catch(() => {});
  }, [resetHideTimer]);

  const onPause = useCallback(() => {
    setPlaying(false);
    setShowControls(true);
    clearTimeout(hideControlsTimer.current);
    webcamRef.current?.pause();
  }, []);

  const onEnded = useCallback(() => {
    setPlaying(false);
    setShowControls(true);
    clearTimeout(hideControlsTimer.current);
  }, []);

  // Derived
  const isVideoLoading = webcamLoading || screenLoading;
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const session = violationsData?.session;
  const violations: any[] = violationsData?.violations ?? [];

  const [activeTab, setActiveTab] = useState<"logs" | "reference">("logs");

  const typeStyle: Record<string, string> = {
    "Tab Switched": "bg-yellow-50 border-yellow-200 text-yellow-700",
    "Multiple monitors detected": "bg-red-50 border-red-200 text-red-700",
    "Developer tools opened": "bg-orange-50 border-orange-200 text-orange-700",
    "Window resized": "bg-purple-50 border-purple-200 text-purple-700",
    "Copy attempt": "bg-rose-50 border-rose-200 text-rose-700",
    "Cut attempt": "bg-pink-50 border-pink-200 text-pink-700",
  };

  if (skip) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-500">
        No live review session is available for this report.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* HEADER SECTION */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
              Session Review
            </p>
            <h2 className="text-2xl font-bold text-slate-900">Live Review</h2>
          </div>
          {session && (
            <div className="flex flex-col gap-1 text-right">
              <span className="text-sm font-semibold text-slate-700">
                Status:{" "}
                <span className="capitalize text-cyan-600">
                  {session.status}
                </span>
              </span>
              {session.ended_at && (
                <span className="text-[12px] text-slate-600">
                  Completed: {session.ended_at.split("T")[0]}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT: Video Player + Violation Panel */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player — 2 columns on large screens */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div
            ref={containerRef}
            className={`relative w-full bg-slate-900 overflow-hidden shadow-xl group select-none ${
              isFullscreen ? "rounded-none" : "rounded-2xl"
            }`}
            style={
              isFullscreen
                ? { width: "100%", height: "100%" }
                : { aspectRatio: "16/9" }
            }
            onMouseMove={resetHideTimer}
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => playing && setShowControls(false)}
          >
            {/* ── Screen Recording (main player, fills container) ── */}
            <div
              className="w-full h-full cursor-pointer"
              onClick={togglePlay}
              style={{ background: "#0f172a" }}
            >
              {screenSrc ? (
                <ReactPlayer
                  ref={screenRef}
                  src={screenSrc}
                  playing={playing}
                  volume={volume}
                  muted={muted}
                  playbackRate={playbackRate}
                  onTimeUpdate={onTimeUpdate}
                  onDurationChange={onDurationChange}
                  onPlay={onPlay}
                  onPause={onPause}
                  onEnded={onEnded}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              ) : (
                !isVideoLoading && (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-slate-500 text-sm">
                      {screenError
                        ? "Screen recording not available"
                        : "No screen recording"}
                    </p>
                  </div>
                )
              )}
            </div>

            {/* ── Webcam PiP overlay (bottom-right) ── */}
            <div
              className="absolute"
              style={{
                width: "25%",
                aspectRatio: "16/9",
                right: 12,
                bottom: 68,
                zIndex: 20,
                borderRadius: 6,
                overflow: "hidden",
                boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
                border: "2px solid rgba(14,165,233,0.7)",
              }}
            >
              {webcamSrc ? (
                <ReactPlayer
                  ref={webcamRef}
                  src={webcamSrc}
                  playing={playing}
                  volume={0}
                  muted={true}
                  playbackRate={playbackRate}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                  <p className="text-slate-500 text-[10px] text-center px-1">
                    {webcamError ? "No webcam" : "…"}
                  </p>
                </div>
              )}
              {/* Webcam label */}
              <div
                className="absolute top-0 left-0 flex items-center gap-1 px-1.5 py-0.5"
                style={{ background: "rgba(0,0,0,0.6)", zIndex: 1 }}
              >
                <Camera size={9} className="text-sky-400" />
                <span className="text-[10px] font-bold text-slate-200">
                  Webcam
                </span>
              </div>
            </div>

            {/* ── Loading overlay ── */}
            {isVideoLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 gap-3 backdrop-blur-sm z-30">
                <Loader2 className="w-8 h-8 text-sky-400 animate-spin" />
                <p className="text-slate-300 text-sm font-medium">
                  Loading session recordings…
                </p>
              </div>
            )}

            {/* ── Controls overlay ── */}
            {!isVideoLoading && (
              <div
                className={`absolute inset-x-0 bottom-0 z-30 transition-opacity duration-200 ${
                  showControls ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                {/* Gradient backdrop */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

                <div className="relative px-4 pb-3 pt-6 flex flex-col gap-2 w-full box-border">
                  {/* Seek bar */}
                  <div
                    className="relative w-full group/seek py-2 cursor-pointer"
                    style={{ minWidth: 0 }}
                  >
                    <div className="relative h-1.5 w-full">
                      {/* Track */}
                      <div className="absolute inset-0 rounded-full bg-white/20" />
                      {/* Buffered */}
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-white/30"
                        style={{ width: `${buffered}%` }}
                      />
                      {/* Played */}
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-sky-400"
                        style={{ width: `${progress}%` }}
                      />
                      {/* Thumb */}
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-sky-400 shadow border-2 border-white transition-transform group-hover/seek:scale-125 pointer-events-none"
                        style={{ left: `calc(${progress}% - 6px)` }}
                      />
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={duration || 0}
                      step={0.1}
                      value={currentTime}
                      onChange={onSeekBarChange}
                      className="absolute inset-0 w-full opacity-0 cursor-pointer"
                      style={{ margin: 0, height: "100%", zIndex: 10 }}
                      aria-label="Seek"
                    />
                  </div>

                  {/* Button row */}
                  <div
                    className="flex items-center gap-3 flex-wrap"
                    style={{ minWidth: 0 }}
                  >
                    {/* Skip back */}
                    <button
                      onClick={() => skipSeconds(-10)}
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
                      onClick={() => skipSeconds(10)}
                      className="text-white/70 hover:text-white transition-colors flex-shrink-0"
                      title="+10s"
                    >
                      <SkipForward size={17} />
                    </button>

                    {/* Time */}
                    <span className="text-[12px] text-white/70 font-mono select-none flex-shrink-0">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

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

                    {/* Playback speed */}
                    <div className="relative flex-shrink-0">
                      <button
                        onClick={() => setShowSpeedMenu((s) => !s)}
                        className="flex items-center gap-1 px-2 py-1 bg-black/40 rounded text-[11px] text-white/70 hover:text-white backdrop-blur-sm transition-colors"
                        title="Playback speed"
                      >
                        <Gauge size={11} />
                        {playbackRate}x
                      </button>
                      {showSpeedMenu && (
                        <div
                          className="absolute bottom-8 right-0 bg-slate-900/95 border border-slate-700 rounded-lg overflow-hidden backdrop-blur-sm shadow-xl"
                          style={{ minWidth: 72 }}
                        >
                          {SPEEDS.map((s) => (
                            <button
                              key={s}
                              onClick={() => {
                                setPlaybackRate(s);
                                setShowSpeedMenu(false);
                              }}
                              className={`w-full text-right px-3 py-1.5 text-[12px] transition-colors ${
                                playbackRate === s
                                  ? "bg-sky-500/20 text-sky-400 font-semibold"
                                  : "text-slate-300 hover:bg-white/10"
                              }`}
                            >
                              {s}x
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Fullscreen */}
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
        </div>

        {/* Violation Panel — 1 column on large screens */}
        <div className="lg:col-span-1 flex flex-col">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[450px]">
            {/* Header with tabs */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100">
              <div className="flex justify-between items-center flex-wrap mb-4">
                <h3 className="text-[15px] font-bold text-slate-800 flex items-center gap-2">
                  <AlertTriangle size={17} className="text-amber-500" />
                  Violations
                </h3>
                <h3>
                  Total violations:{" "}
                  <Badge variant="destructive">{violations.length}</Badge>
                </h3>
              </div>

              {/* Tab buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("logs")}
                  className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                    activeTab === "logs"
                      ? "bg-cyan-100 text-cyan-700 border border-cyan-300"
                      : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  Logs ({violations.length})
                </button>
                <button
                  onClick={() => setActiveTab("reference")}
                  className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${
                    activeTab === "reference"
                      ? "bg-cyan-100 text-cyan-700 border border-cyan-300"
                      : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                  }`}
                >
                  Reference
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* Logs Tab */}
              {activeTab === "logs" && (
                <div className="space-y-3">
                  {violLoading && (
                    <p className="text-slate-400 text-sm text-center py-8">
                      Loading violations…
                    </p>
                  )}
                  {!violLoading && violations.length === 0 && (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-3">
                        <AlertTriangle size={20} className="text-green-600" />
                      </div>
                      <p className="text-slate-600 font-medium text-sm">
                        No violations detected
                      </p>
                      <p className="text-slate-400 text-xs mt-1">
                        Clean session with no integrity issues
                      </p>
                    </div>
                  )}
                  {violations.length > 0 &&
                    violations.map((v: any) => (
                      <div
                        key={v.id}
                        className={`p-3 rounded-lg border-l-4 bg-slate-50 ${
                          typeStyle[v.type]?.includes("yellow")
                            ? "border-l-yellow-400"
                            : typeStyle[v.type]?.includes("red")
                              ? "border-l-red-400"
                              : typeStyle[v.type]?.includes("orange")
                                ? "border-l-orange-400"
                                : typeStyle[v.type]?.includes("purple")
                                  ? "border-l-purple-400"
                                  : "border-l-rose-400"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                              typeStyle[v.type] ??
                              "bg-slate-100 border border-slate-200 text-slate-600"
                            }`}
                          >
                            {v.type}
                          </span>
                        </div>
                        {v.question_id && (
                          <p className="text-[12px] text-slate-600">
                            Question #{v.question_id}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              )}

              {/* Reference Tab */}
              {activeTab === "reference" && (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <p className="text-[13px] font-semibold text-slate-900">
                        Tab Switched
                      </p>
                    </div>
                    <p className="text-[12px] text-slate-600 ml-5">
                      Candidate switched tabs or windows during the test
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <p className="text-[13px] font-semibold text-slate-900">
                        Multiple Monitors Detected
                      </p>
                    </div>
                    <p className="text-[12px] text-slate-600 ml-5">
                      Candidate is using more than one monitor
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                      <p className="text-[13px] font-semibold text-slate-900">
                        Developer Tools Opened
                      </p>
                    </div>
                    <p className="text-[12px] text-slate-600 ml-5">
                      Candidate opened browser developer tools during the test
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                      <p className="text-[13px] font-semibold text-slate-900">
                        Window Resized
                      </p>
                    </div>
                    <p className="text-[12px] text-slate-600 ml-5">
                      Candidate resized the browser window during the test
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <p className="text-[13px] font-semibold text-slate-900">
                        Copy Attempt
                      </p>
                    </div>
                    <p className="text-[12px] text-slate-600 ml-5">
                      Candidate attempted to copy content during the test
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-pink-400" />
                      <p className="text-[13px] font-semibold text-slate-900">
                        Cut Attempt
                      </p>
                    </div>
                    <p className="text-[12px] text-slate-600 ml-5">
                      Candidate attempted to cut content during the test
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveReviewTab;
