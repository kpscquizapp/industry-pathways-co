import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  AlertTriangle,
  Monitor,
  Camera,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  SkipBack,
  SkipForward,
  Gauge,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getAuthHeaders } from "@/lib/helpers";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Recording {
  id: number;
  type: "webcam" | "screen";
  status: string;
  startedAt: string;
  completedAt: string;
  totalChunks: number;
  playUrl: string;
  streamUrl: string;
  chunksUrl: string;
}

interface Violation {
  id: number;
  type: string;
  questionId: number | null;
  timestamp: string;
  meta: unknown | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL ?? "";

function resolveUrl(url: string): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;

  const base = BASE_URL.endsWith("/") ? BASE_URL.slice(0, -1) : BASE_URL;
  const path = url.startsWith("/") ? url : `/${url}`;

  if (path.startsWith("/api/v1") && base.endsWith("/api/v1")) {
    return `${base.slice(0, -7)}${path}`;
  }

  return `${base}${path}`;
}

interface LiveReviewTabProps {
  recordings: Recording[];
  violations: Violation[];
}

function formatTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

const typeStyle: Record<string, string> = {
  "Tab Switched": "bg-yellow-50 border-yellow-200 text-yellow-700",
  "Multiple monitors detected": "bg-red-50 border-red-200 text-red-700",
  "Developer tools opened": "bg-orange-50 border-orange-200 text-orange-700",
  "Window resized": "bg-purple-50 border-purple-200 text-purple-700",
  "Copy attempt": "bg-rose-50 border-rose-200 text-rose-700",
  "Cut attempt": "bg-pink-50 border-pink-200 text-pink-700",
};

function fixBrokenDuration(
  video: HTMLVideoElement,
  onFixed: (duration: number) => void,
  fixingRef: React.MutableRefObject<boolean>
) {
  if (isFinite(video.duration) && video.duration > 0) {
    onFixed(video.duration);
    return;
  }

  fixingRef.current = true;

  let cleanupDone = false;
  const cleanup = () => {
    if (cleanupDone) return;
    cleanupDone = true;

    video.removeEventListener("timeupdate", cleanup);
    video.removeEventListener("seeked", cleanup);
    clearTimeout(fallbackTimeout);

    video.currentTime = 0;

    fixingRef.current = false;

    if (isFinite(video.duration) && video.duration > 0) {
      onFixed(video.duration);
    }
  };

  video.addEventListener("timeupdate", cleanup);
  video.addEventListener("seeked", cleanup);
  const fallbackTimeout = setTimeout(cleanup, 1000);

  video.currentTime = 1e101;
}

const LiveReviewTab: React.FC<LiveReviewTabProps> = ({ recordings, violations }) => {
  const screenRec = recordings.find((r) => r.type === "screen");
  const webcamRec = recordings.find((r) => r.type === "webcam");

  const screenSrcUrl = screenRec ? resolveUrl(screenRec.playUrl) : null;
  const webcamSrcUrl = webcamRec ? resolveUrl(webcamRec.playUrl) : null;

  const [screenBlobUrl, setScreenBlobUrl] = useState<string | null>(null);
  const [webcamBlobUrl, setWebcamBlobUrl] = useState<string | null>(null);
  const screenBlobUrlRef = useRef<string | null>(null);
  const webcamBlobUrlRef = useRef<string | null>(null);
  const [loadingMedia, setLoadingMedia] = useState(true);

  // Fetch blobs for videos to enable duration and seeking over CORP
  useEffect(() => {
    let active = true;
    let loadedCount = 0;
    const toLoad = (screenSrcUrl ? 1 : 0) + (webcamSrcUrl ? 1 : 0);

    if (toLoad === 0) {
      setLoadingMedia(false);
      return;
    }

    async function fetchBlob(
      url: string | null,
      setBlob: (b: string) => void,
      blobRef: React.MutableRefObject<string | null>
    ) {
      if (!url) return;
      try {
        const { Authorization } = getAuthHeaders();
        const headers: HeadersInit = {};
        if (Authorization) headers["Authorization"] = Authorization;

        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error("Failed to fetch media");
        const blob = await res.blob();
        if (active) {
          const objUrl = URL.createObjectURL(blob);
          blobRef.current = objUrl;
          setBlob(objUrl);
          loadedCount++;
          if (loadedCount === toLoad) setLoadingMedia(false);
        }
      } catch (err) {
        console.error(err);
        if (active) {
          loadedCount++;
          if (loadedCount === toLoad) setLoadingMedia(false);
        }
      }
    }

    fetchBlob(screenSrcUrl, setScreenBlobUrl, screenBlobUrlRef);
    fetchBlob(webcamSrcUrl, setWebcamBlobUrl, webcamBlobUrlRef);

    return () => {
      active = false;
      if (screenBlobUrlRef.current) {
        URL.revokeObjectURL(screenBlobUrlRef.current);
        screenBlobUrlRef.current = null;
      }
      setScreenBlobUrl(null);
      if (webcamBlobUrlRef.current) {
        URL.revokeObjectURL(webcamBlobUrlRef.current);
        webcamBlobUrlRef.current = null;
      }
      setWebcamBlobUrl(null);
    };
  }, [screenSrcUrl, webcamSrcUrl]);

  // Refs to native <video> elements
  const screenRef = useRef<HTMLVideoElement>(null);
  const webcamRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Guards so the temporary huge-timestamp seek used to fix broken duration
  // metadata doesn't leak into currentTime/progress state.
  const screenFixingRef = useRef(false);
  const webcamFixingRef = useRef(false);

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

  const applyPlaybackRate = useCallback((rate: number) => {
    if (screenRef.current) screenRef.current.playbackRate = rate;
    if (webcamRef.current) webcamRef.current.playbackRate = rate;
  }, []);

  // Apply playback rate whenever it changes
  useEffect(() => {
    applyPlaybackRate(playbackRate);
  }, [playbackRate, applyPlaybackRate]);

  // Sync webcam to screen position
  const syncWebcamTo = useCallback((seconds: number) => {
    if (webcamRef.current) webcamRef.current.currentTime = seconds;
  }, []);

  // Controls
  const togglePlay = useCallback(() => {
    const v = screenRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => { });
      webcamRef.current?.play().catch(() => { });
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
    [currentTime, duration, syncWebcamTo]
  );

  const onSeekBarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const t = Number(e.target.value);
      if (screenRef.current) screenRef.current.currentTime = t;
      syncWebcamTo(t);
      setCurrentTime(t);
    },
    [syncWebcamTo]
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
    const isMuted = v === 0;
    if (screenRef.current) {
      screenRef.current.volume = v;
      screenRef.current.muted = isMuted;
    }
    if (webcamRef.current) {
      webcamRef.current.volume = v;
      webcamRef.current.muted = isMuted;
    }
    setMuted(isMuted);
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
          'input, textarea, select, button, a, [contenteditable="true"]'
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
      // Ignore spurious timeupdate events fired during the duration-fix hack
      // (seeking to a huge timestamp and back) so it never flashes into UI state.
      if (screenFixingRef.current) return;

      const v = e.currentTarget;
      setCurrentTime(v.currentTime);
      if (v.buffered.length > 0) {
        setBuffered(
          (v.buffered.end(v.buffered.length - 1) / (v.duration || 1)) * 100
        );
      }
    },
    []
  );

  const onDurationChange = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const d = e.currentTarget.duration;
      if (isFinite(d) && d > 0) setDuration(d);
    },
    []
  );

  const onLoadedMetadata = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      const d = video.duration;

      if (isFinite(d) && d > 0) {
        setDuration(d);
        applyPlaybackRate(playbackRate);
      } else {
        // Broken/missing duration metadata - common with server-concatenated
        // MediaRecorder webm chunks. Force the browser to recompute it.
        fixBrokenDuration(
          video,
          (fixedDuration) => {
            setDuration(fixedDuration);
            // Re-apply playback rate: some browsers ignore rate changes
            // made before the media resolves a finite duration.
            applyPlaybackRate(playbackRate);
          },
          screenFixingRef
        );
      }
    },
    [applyPlaybackRate, playbackRate]
  );

  const onWebcamLoadedMetadata = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      if (!isFinite(video.duration) || video.duration <= 0) {
        fixBrokenDuration(video, () => { }, webcamFixingRef);
      }
      video.playbackRate = playbackRate;
    },
    [playbackRate]
  );

  const onPlay = useCallback(() => {
    setPlaying(true);
    resetHideTimer();
    applyPlaybackRate(playbackRate);
    // Keep webcam in sync
    webcamRef.current?.play().catch(() => { });
  }, [resetHideTimer, applyPlaybackRate, playbackRate]);

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
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const [activeTab, setActiveTab] = useState<"logs" | "reference">("logs");

  const groupedViolations = React.useMemo(() => {
    return Object.values(
      violations.reduce((acc, v) => {
        if (!acc[v.type]) {
          acc[v.type] = { count: 0, sample: v };
        }
        acc[v.type].count += 1;
        return acc;
      }, {} as Record<string, { count: number; sample: any }>)
    );
  }, [violations]);

  if (!screenSrcUrl && !webcamSrcUrl) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center text-slate-500">
        No recordings are available for this session.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-slate-500 mb-1">
              Session Review
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Live Review</h2>
          </div>

          <div className="flex flex-col gap-2 text-right">
            <h4 className="text-sm font-medium text-slate-900 capitalize">Status : {recordings[0]?.status}</h4>
            <h4 className="text-sm font-medium text-slate-900 capitalize">Completed At : {recordings[0]?.completedAt ? new Date(recordings[0].completedAt).toLocaleDateString() : "N/A"}</h4>

          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div
            ref={containerRef}
            className={`relative w-full bg-slate-900 overflow-hidden shadow-xl group select-none flex items-center justify-center ${isFullscreen ? "rounded-none" : "rounded-2xl"
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
            {loadingMedia && (
              <div className="absolute inset-0 z-40 bg-slate-900 flex flex-col items-center justify-center gap-4">
                <Loader2 size={32} className="text-sky-400 animate-spin" />
                <p className="text-slate-400 text-sm font-medium animate-pulse">Loading video streams...</p>
              </div>
            )}

            <div
              className="w-full h-full cursor-pointer"
              onClick={togglePlay}
              style={{ background: "#0f172a" }}
            >
              {screenBlobUrl ? (
                <video
                  ref={screenRef}
                  src={screenBlobUrl}
                  muted={muted}
                  onTimeUpdate={onTimeUpdate}
                  onDurationChange={onDurationChange}
                  onLoadedMetadata={onLoadedMetadata}
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
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-slate-500 text-sm">No screen recording available</p>
                </div>
              )}
            </div>

            {webcamBlobUrl && (
              <div
                className="absolute w-[32%] sm:w-[26%] md:w-[22%] lg:w-1/4 right-1.5 bottom-12 sm:right-3 sm:bottom-16 rounded sm:rounded-md overflow-hidden"
                style={{
                  aspectRatio: "16/9",
                  zIndex: 20,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
                  border: "2px solid rgba(14,165,233,0.7)",
                }}
              >
                <video
                  ref={webcamRef}
                  src={webcamBlobUrl}
                  muted={muted}
                  onLoadedMetadata={onWebcamLoadedMetadata}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div
                  className="absolute top-0 left-0 flex items-center gap-1 px-1 sm:px-1.5 py-0.5"
                  style={{ background: "rgba(0,0,0,0.6)", zIndex: 1 }}
                >
                  <Camera size={8} className="text-sky-400 hidden sm:block" />
                  <span className="text-[8px] sm:text-[10px] font-bold text-slate-200">Cam</span>
                </div>
              </div>
            )}

            {/* Controls overlay */}
            <div
              className={`absolute inset-x-0 bottom-0 z-30 transition-opacity duration-200 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

              <div className="relative px-2 sm:px-4 pb-2 sm:pb-3 pt-5 sm:pt-6 flex flex-col gap-1.5 sm:gap-2 w-full box-border">
                <div
                  className="relative w-full group/seek py-2.5 sm:py-2 cursor-pointer"
                  style={{ minWidth: 0 }}
                >
                  <div className="relative h-1.5 w-full">
                    <div className="absolute inset-0 rounded-full bg-white/20" />
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-white/30"
                      style={{ width: `${buffered}%` }}
                    />
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-sky-400"
                      style={{ width: `${progress}%` }}
                    />
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

                <div
                  className="flex items-center gap-1.5 sm:gap-3 flex-wrap"
                  style={{ minWidth: 0 }}
                >
                  <button
                    onClick={() => skipSeconds(-10)}
                    className="text-white/70 hover:text-white transition-colors flex-shrink-0 p-1 -m-1"
                    title="–10s"
                  >
                    <SkipBack size={15} className="sm:hidden" />
                    <SkipBack size={17} className="hidden sm:block" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors flex-shrink-0"
                    title={playing ? "Pause" : "Play"}
                  >
                    {playing ? <Pause size={16} className="sm:hidden" /> : <Play size={16} className="sm:hidden" />}
                    {playing ? <Pause size={17} className="hidden sm:block" /> : <Play size={17} className="hidden sm:block" />}
                  </button>

                  <button
                    onClick={() => skipSeconds(10)}
                    className="text-white/70 hover:text-white transition-colors flex-shrink-0 p-1 -m-1"
                    title="+10s"
                  >
                    <SkipForward size={15} className="sm:hidden" />
                    <SkipForward size={17} className="hidden sm:block" />
                  </button>

                  <span className="text-[10px] sm:text-[12px] text-white/70 font-mono select-none flex-shrink-0 whitespace-nowrap">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>

                  <div className="flex-1" style={{ minWidth: "4px" }} />

                  <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-black/40 rounded text-[11px] text-white/70 backdrop-blur-sm flex-shrink-0">
                    <Monitor size={11} /> Screen
                  </div>
                  <div className="hidden md:flex items-center gap-1.5 px-2 py-1 bg-black/40 rounded text-[11px] text-white/70 backdrop-blur-sm flex-shrink-0">
                    <Camera size={11} /> PiP
                  </div>

                  <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
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

                  {/* Mute-only toggle for narrow screens (volume slider hidden) */}
                  <button
                    onClick={toggleMute}
                    className="sm:hidden text-white/70 hover:text-white transition-colors flex-shrink-0 p-1 -m-1"
                    title={muted ? "Unmute" : "Mute"}
                  >
                    {muted || volume === 0 ? (
                      <VolumeX size={15} />
                    ) : (
                      <Volume2 size={15} />
                    )}
                  </button>

                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => setShowSpeedMenu((s) => !s)}
                      className="flex items-center gap-1 px-1.5 sm:px-2 py-1 bg-black/40 rounded text-[10px] sm:text-[11px] text-white/70 hover:text-white backdrop-blur-sm transition-colors"
                      title="Playback speed"
                    >
                      <Gauge size={10} className="sm:hidden" />
                      <Gauge size={11} className="hidden sm:block" />
                      {playbackRate}x
                    </button>
                    {showSpeedMenu && (
                      <div
                        className="absolute bottom-20 right-0 bg-slate-900/95 border border-slate-700 rounded-lg overflow-hidden backdrop-blur-sm shadow-xl"
                        style={{ minWidth: 72 }}
                      >
                        {SPEEDS.map((s) => (
                          <button
                            key={s}
                            onClick={() => {
                              setPlaybackRate(s);
                              setShowSpeedMenu(false);
                            }}
                            className={`w-full text-right px-3 py-1.5 text-[12px] transition-colors ${playbackRate === s
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

                  <button
                    onClick={toggleFullscreen}
                    className="text-white/70 hover:text-white transition-colors flex-shrink-0 p-1 -m-1"
                    title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  >
                    {isFullscreen ? (
                      <>
                        <Minimize2 size={15} className="sm:hidden" />
                        <Minimize2 size={17} className="hidden sm:block" />
                      </>
                    ) : (
                      <>
                        <Maximize2 size={15} className="sm:hidden" />
                        <Maximize2 size={17} className="hidden sm:block" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[320px] sm:h-[380px] lg:h-[450px]">
            <div className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b border-slate-100">
              <div className="flex justify-between items-center flex-wrap gap-2 mb-3 sm:mb-4">
                <h3 className="text-[14px] sm:text-[15px] font-bold text-slate-800 flex items-center gap-2">
                  <AlertTriangle size={17} className="text-amber-500" />
                  Violations
                </h3>
                <h3>
                  Total violations:{" "}
                  <Badge variant="destructive">{violations.length}</Badge>
                </h3>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab("logs")}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[12px] sm:text-[13px] font-semibold transition-all ${activeTab === "logs"
                    ? "bg-cyan-100 text-cyan-700 border border-cyan-300"
                    : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                    }`}
                >
                  Logs ({violations.length})
                </button>
                <button
                  onClick={() => setActiveTab("reference")}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[12px] sm:text-[13px] font-semibold transition-all ${activeTab === "reference"
                    ? "bg-cyan-100 text-cyan-700 border border-cyan-300"
                    : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                    }`}
                >
                  Reference
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4">
              {activeTab === "logs" && (
                <div className="space-y-3">
                  {violations.length === 0 && (
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
                  {groupedViolations.map(({ count, sample: v }) => {
                    const isYellow = typeStyle[v.type]?.includes("yellow");
                    const isRed = typeStyle[v.type]?.includes("red");
                    const isOrange = typeStyle[v.type]?.includes("orange");
                    const isPurple = typeStyle[v.type]?.includes("purple");
                    
                    const borderColor = isYellow ? "border-l-yellow-400" 
                      : isRed ? "border-l-red-400" 
                      : isOrange ? "border-l-orange-400" 
                      : isPurple ? "border-l-purple-400" 
                      : "border-l-rose-400";
                      
                    const iconColor = isYellow ? "text-yellow-500" 
                      : isRed ? "text-red-500" 
                      : isOrange ? "text-orange-500" 
                      : isPurple ? "text-purple-500" 
                      : "text-rose-500";
                      
                    const bgColor = isYellow ? "bg-yellow-50" 
                      : isRed ? "bg-red-50" 
                      : isOrange ? "bg-orange-50" 
                      : isPurple ? "bg-purple-50" 
                      : "bg-rose-50";

                    return (
                      <div
                        key={v.type}
                        className={`p-3 sm:p-4 rounded-xl border-y border-r border-slate-200 border-l-[4px] bg-white shadow-sm hover:shadow-md transition-shadow flex items-center justify-between gap-3 ${borderColor}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}>
                            <AlertTriangle size={14} className={iconColor} />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-slate-800 leading-tight">
                              {v.type}
                            </span>
                            {v.questionId && count === 1 ? (
                              <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                                Question #{v.questionId}
                              </span>
                            ) : count > 1 ? (
                              <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                                Multiple integrity flags
                              </span>
                            ) : null}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end flex-shrink-0">
                          <span className="text-[9px] uppercase tracking-wider font-bold text-slate-400 mb-1">
                            Occurrences
                          </span>
                          <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-md ${typeStyle[v.type] ?? "bg-slate-100 text-slate-600"}`}>
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

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