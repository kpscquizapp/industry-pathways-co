import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  useStartRecordingMutation,
  useUploadChunkMutation,
  useEndRecordingMutation,
  useRecordingPingMutation,
} from "@/app/queries/assessmentApi";

type WebcamFeedProps = {
  apiBaseUrl?: string;
  isInterviewActive: boolean;
  totalViolations: number;
  onScreenShareStart?: () => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  onCameraError?: () => void;
  sessionId: string;
  initialStream?: MediaStream | null;
  initialScreenStream?: MediaStream | null;
};

type StreamingInitResponse = {
  nextChunkIndex: number;
  recordingId: number;
};

type StreamingEndResponse = {
  integrity?: {
    duplicateChunks?: number[];
    isValid?: boolean;
    missingChunks?: number[];
  };
  totalChunks: number;
};

const CHUNK_INTERVAL_MS = 3000;
const MAX_RETRIES_PER_CHUNK = 3;
const RETRY_DELAY_MS = 1000;

const stopTracks = (stream: MediaStream | null): void => {
  stream?.getTracks().forEach((track) => track.stop());
};

const WebcamFeed = ({
  isInterviewActive,
  totalViolations,
  onScreenShareStart,
  onRecordingStart,
  onRecordingStop,
  onCameraError,
  sessionId,
  initialStream,
  initialScreenStream,
}: WebcamFeedProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const screenRecorderRef = useRef<MediaRecorder | null>(null);
  const chunkIndexRef = useRef<{ webcam: number; screen: number }>({
    webcam: 0,
    screen: 0,
  });
  const recordingIdRef = useRef<{
    webcam: number | null;
    screen: number | null;
  }>({ webcam: null, screen: null });
  const pendingChunksRef = useRef<{ webcam: Set<number>; screen: Set<number> }>(
    { webcam: new Set(), screen: new Set() },
  );
  const isStreamingRef = useRef(false);
  const activeSessionIdRef = useRef(sessionId);
  const uploadIssueToastShownRef = useRef(false);
  const cleanupMountedRef = useRef(false); // prevents cleanup running before first recording starts

  // RTK Query mutation triggers
  const [startRecording] = useStartRecordingMutation();
  const [uploadChunkMutation] = useUploadChunkMutation();
  const [endRecording] = useEndRecordingMutation();
  const [recordingPing] = useRecordingPingMutation();

  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [screenShareStream, setScreenShareStream] =
    useState<MediaStream | null>(null);

  const canScreenShare = useMemo(
    () =>
      typeof navigator !== "undefined" &&
      !!navigator.mediaDevices?.getDisplayMedia,
    [],
  );
  const isScreenSharing = !!screenShareStream;

  useEffect(() => {
    if (initialStream && !webcamStream) {
      setWebcamStream(initialStream);
    }
  }, [initialStream, webcamStream]);

  useEffect(() => {
    if (initialScreenStream && !screenShareStream) {
      setScreenShareStream(initialScreenStream);
    }
  }, [initialScreenStream, screenShareStream]);

  useLayoutEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = webcamStream;
    }
  }, [webcamStream]);

  useLayoutEffect(() => {
    if (screenVideoRef.current) {
      screenVideoRef.current.srcObject = screenShareStream;
    }
  }, [screenShareStream]);

  useEffect(() => {
    if (sessionId) {
      activeSessionIdRef.current = sessionId;
    }
  }, [sessionId]);

  const notifyUploadIssue = useCallback((message: string) => {
    if (uploadIssueToastShownRef.current) {
      return;
    }

    uploadIssueToastShownRef.current = true;
    toast.error(message);
  }, []);

  const initializeStreaming = useCallback(
    async (type: "webcam" | "screen") => {
      const activeSessionId = activeSessionIdRef.current;
      if (!activeSessionId) {
        throw new Error("No active session ID is available.");
      }
      const data = await startRecording({ sessionId: activeSessionId, type }).unwrap();
      return { recordingId: data.recordingId, nextChunkIndex: data.nextChunkIndex };
    },
    [startRecording],
  );

  const streamChunk = useCallback(
    async (
      blob: Blob,
      type: "webcam" | "screen",
      chunkIndex: number,
      recordingId: number,
      retryCount = 0,
    ): Promise<boolean> => {
      const activeSessionId = activeSessionIdRef.current;
      if (!activeSessionId) {
        throw new Error("No active session ID is available.");
      }
      try {
        await uploadChunkMutation({
          sessionId: activeSessionId,
          chunkIndex,
          type,
          timestamp: Date.now(),
          recordingId,
          chunk: blob,
        }).unwrap();
        pendingChunksRef.current[type].delete(chunkIndex);
        return true;
      } catch (error) {
        pendingChunksRef.current[type].add(chunkIndex);
        if (retryCount < MAX_RETRIES_PER_CHUNK) {
          const delay = RETRY_DELAY_MS * Math.pow(2, retryCount);
          await new Promise((resolve) => setTimeout(resolve, delay));
          return streamChunk(blob, type, chunkIndex, recordingId, retryCount + 1);
        }
        console.warn(`Chunk upload exhausted retries for ${type}`, { chunkIndex, error });
        notifyUploadIssue("Recording upload is unstable. Review the network connection.");
        return false;
      }
    },
    [uploadChunkMutation, notifyUploadIssue],
  );

  const endStreaming = useCallback(
    async (type: "webcam" | "screen") => {
      const activeSessionId = activeSessionIdRef.current;
      if (!activeSessionId) {
        throw new Error("No active session ID is available.");
      }
      const result = await endRecording({ sessionId: activeSessionId, type }).unwrap();
      if (result.integrity && result.integrity.isValid === false) {
        console.warn(`Recording integrity check failed for ${type}`, {
          duplicateChunks: result.integrity.duplicateChunks || [],
          missingChunks: result.integrity.missingChunks || [],
        });
        toast.error("Recording integrity check found issues and was flagged for review.");
      }
      return result;
    },
    [endRecording],
  );

  const sendKeepalive = useCallback(async () => {
    const activeSessionId = activeSessionIdRef.current;
    if (!activeSessionId) return false;
    try {
      await recordingPing({ sessionId: activeSessionId }).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [recordingPing]);

  // Cleanup when interview ends — guarded to avoid running on mount before any recording started
  useEffect(() => {
    if (!cleanupMountedRef.current) {
      cleanupMountedRef.current = true;
      return;
    }
    if (isInterviewActive) {
      uploadIssueToastShownRef.current = false;
      return;
    }

    uploadIssueToastShownRef.current = false;

    const activeWebcamRecordingId = recordingIdRef.current.webcam;
    const activeScreenRecordingId = recordingIdRef.current.screen;

    recordingIdRef.current.webcam = null;
    recordingIdRef.current.screen = null;
    isStreamingRef.current = false;

    if (activeWebcamRecordingId) {
      void endStreaming("webcam").catch((error) => {
        console.warn("Failed to finalize webcam recording", error);
      });
    }

    if (activeScreenRecordingId) {
      void endStreaming("screen").catch((error) => {
        console.warn("Failed to finalize screen recording", error);
      });
    }

    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }

    if (screenRecorderRef.current && screenRecorderRef.current.state !== "inactive") {
      screenRecorderRef.current.stop();
    }

    // Only stop tracks if we own them (not an initialStream passed from parent)
    if (streamRef.current && streamRef.current !== initialStream) {
      stopTracks(streamRef.current);
    }
    streamRef.current = null;
    setScreenShareStream((prev) => {
      if (prev && prev !== initialScreenStream) {
        stopTracks(prev);
      }
      return null;
    });
    pendingChunksRef.current.webcam.clear();
    pendingChunksRef.current.screen.clear();

    if (videoRef.current) videoRef.current.srcObject = null;
    if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
  }, [endStreaming, isInterviewActive]);

  useEffect(() => {
    if (!isInterviewActive) {
      return;
    }

    let isActive = true;
    let keepaliveInterval: NodeJS.Timeout | null = null;

    // Auto start screen sharing when interview becomes active
    const startScreenSharing = async () => {
      if (!isInterviewActive || screenShareStream || initialScreenStream) return;
      if (!canScreenShare) {
        toast.error("Screen capture is not supported.");
        return;
      }

      try {
        onScreenShareStart?.();
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });
        const [screenTrack] = stream.getVideoTracks();
        if (screenTrack) {
          screenTrack.addEventListener("ended", () => {
            setScreenShareStream((prev) => {
              stopTracks(prev);
              return null;
            });
          });
        }
        setScreenShareStream(stream);
      } catch (error) {
        toast.error("You should allow access to your screen.");
      }
    };

    // Start screen sharing automatically
    void startScreenSharing();

    const getStream = async () => {
      try {
        let stream: MediaStream;
        if (initialStream) {
          stream = initialStream;
        } else {
          if (!navigator.mediaDevices?.getUserMedia) {
            throw new Error("MediaDevices API not available");
          }
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
        }

        if (!isActive) {
          // Don't stop tracks if this is the initialStream owned by the parent
          if (stream !== initialStream) stopTracks(stream);
          return;
        }

        // Assign srcObject and refs immediately so video shows without waiting for the API
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setWebcamStream(stream);

        let recordingId: number | null = null;

        try {
          const initResult = await initializeStreaming("webcam");
          recordingId = initResult.recordingId;
          recordingIdRef.current.webcam = recordingId;
          chunkIndexRef.current.webcam = initResult.nextChunkIndex;
          isStreamingRef.current = true;
        } catch (error) {
          console.warn("Failed to initialize webcam streaming", error);
          notifyUploadIssue(
            "Failed to start backend recording stream. Monitoring continues locally.",
          );
        }

        const preferredTypes = [
          "video/webm;codecs=vp9",
          "video/webm;codecs=vp8,opus",
          "video/webm",
        ];
        const mimeType =
          preferredTypes.find((type) => MediaRecorder.isTypeSupported(type)) ||
          "";
        const recorder = new MediaRecorder(
          stream,
          mimeType ? { mimeType } : undefined,
        );

        recorderRef.current = recorder;

        recorder.onstart = () => {
          setIsRecording(true);
          onRecordingStart?.();
          keepaliveInterval = setInterval(() => {
            void sendKeepalive();
          }, 30000);
        };

        recorder.ondataavailable = async (event) => {
          if (!event.data || event.data.size === 0) {
            return;
          }

          const currentIndex = chunkIndexRef.current.webcam;
          chunkIndexRef.current.webcam = currentIndex + 1;

          if (recordingId === null) {
            console.debug(
              "Skipped webcam chunk upload because no recording ID was available.",
            );
            return;
          }

          await streamChunk(event.data, "webcam", currentIndex, recordingId);
        };

        recorder.onstop = () => {
          setIsRecording(false);
          onRecordingStop?.();

          if (keepaliveInterval) {
            clearInterval(keepaliveInterval);
            keepaliveInterval = null;
          }

          // NOTE: endStreaming for webcam is handled by the isInterviewActive
          // cleanup effect to prevent double-calling /recordings/end
          if (pendingChunksRef.current.webcam.size > 0) {
            notifyUploadIssue("Some webcam recording chunks could not be uploaded.");
          }
        };

        recorder.start(CHUNK_INTERVAL_MS);
      } catch (error) {
        setIsRecording(false);
        onCameraError?.();
        toast.error("You should allow access to your webcam.");
      }
    };

    void getStream();

    return () => {
      isActive = false;

      if (keepaliveInterval) {
        clearInterval(keepaliveInterval);
      }

      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
      }

      // Only stop tracks if not the initialStream (owned by parent)
      if (streamRef.current && streamRef.current !== initialStream) {
        stopTracks(streamRef.current);
      }
    };
  }, [
    canScreenShare,
    endStreaming,
    initializeStreaming,
    isInterviewActive,
    notifyUploadIssue,
    onCameraError,
    onRecordingStart,
    onRecordingStop,
    onScreenShareStart,
    sendKeepalive,
    streamChunk,
    // NOTE: initialStream and initialScreenStream intentionally excluded —
    // they are stable refs passed from the parent. Including them caused the
    // effect to re-run mid-async and stop the camera tracks prematurely.
  ]);

  useEffect(() => {
    if (!screenShareStream) {
      const activeRecordingId = recordingIdRef.current.screen;
      recordingIdRef.current.screen = null;

      if (activeRecordingId) {
        void endStreaming("screen").catch((error) => {
          console.warn("Failed to finalize screen recording", error);
        });
      }

      if (
        screenRecorderRef.current &&
        screenRecorderRef.current.state !== "inactive"
      ) {
        screenRecorderRef.current.stop();
      }

      screenRecorderRef.current = null;
      return;
    }

    let screenRecordingId: number | null = null;

    void initializeStreaming("screen")
      .then((result) => {
        screenRecordingId = result.recordingId;
        recordingIdRef.current.screen = result.recordingId;
        chunkIndexRef.current.screen = result.nextChunkIndex;
      })
      .catch((error) => {
        console.warn("Failed to initialize screen streaming", error);
        notifyUploadIssue(
          "Failed to start backend screen stream. Screen sharing continues locally.",
        );
      });

    const preferredTypes = [
      "video/webm;codecs=vp9",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ];
    const mimeType =
      preferredTypes.find((type) => MediaRecorder.isTypeSupported(type)) || "";
    const recorder = new MediaRecorder(
      screenShareStream,
      mimeType ? { mimeType } : undefined,
    );

    screenRecorderRef.current = recorder;

    recorder.ondataavailable = async (event) => {
      if (!event.data || event.data.size === 0 || screenRecordingId === null) {
        return;
      }

      const currentIndex = chunkIndexRef.current.screen;
      chunkIndexRef.current.screen = currentIndex + 1;
      await streamChunk(event.data, "screen", currentIndex, screenRecordingId);
    };

    recorder.onstop = () => {
      const activeRecordingId = recordingIdRef.current.screen;
      recordingIdRef.current.screen = null;

      if (activeRecordingId) {
        void endStreaming("screen").catch((error) => {
          console.warn("Failed to finalize screen recording", error);
          notifyUploadIssue("Failed to finalize screen recording.");
        });
      }

      if (pendingChunksRef.current.screen.size > 0) {
        notifyUploadIssue(
          "Some screen-share recording chunks could not be uploaded.",
        );
      }
    };

    recorder.start(CHUNK_INTERVAL_MS);

    return () => {
      if (recorder.state !== "inactive") {
        recorder.stop();
      }
    };
  }, [
    endStreaming,
    initializeStreaming,
    notifyUploadIssue,
    screenShareStream,
    streamChunk,
  ]);

  const stopScreenShare = useCallback(() => {
    if (
      screenRecorderRef.current &&
      screenRecorderRef.current.state !== "inactive"
    ) {
      screenRecorderRef.current.stop();
    }

    setScreenShareStream((prev) => {
      stopTracks(prev);
      return null;
    });
  }, []);

  const startScreenShare = useCallback(async () => {
    if (!canScreenShare) {
      toast.error("Screen capture is not supported.");
      return;
    }

    try {
      onScreenShareStart?.();
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });
      const [screenTrack] = stream.getVideoTracks();

      if (screenTrack) {
        screenTrack.addEventListener("ended", stopScreenShare, { once: true });
      }

      setScreenShareStream(stream);
    } catch (error) {
      toast.error("You should allow access to your screen.");
    }
  }, [canScreenShare, onScreenShareStart, stopScreenShare]);

  return (
    <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl bg-[#0b1220] shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-white/10 sm:p-2">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 p-2 text-[10px] sm:text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2 py-1 font-semibold uppercase tracking-widest ${isRecording ? "bg-red-600 text-white" : "bg-white/10 text-white/80"}`}
          >
            {isRecording ? "Recording" : "Idle"}
          </span>
          <span className="rounded-full bg-white/15 px-2 py-1 text-xs font-semibold uppercase tracking-widest text-white/80">
            Violations: {totalViolations}
          </span>
        </div>

        <button
          className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-white/80 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => {
            if (!isScreenSharing) startScreenShare();
          }}
          disabled={!isInterviewActive || !canScreenShare || isScreenSharing}
        >
          {isScreenSharing ? "Screen Sharing" : "Share Screen"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 p-2">
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="aspect-video w-full object-cover min-h-[4rem]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/20" />
          <div className="absolute bottom-2 left-2 rounded-full bg-white/80 px-2 py-1 text-xs text-black">
            Webcam
          </div>
        </div>

        {isScreenSharing ? (
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/40">
            <video
              ref={screenVideoRef}
              autoPlay
              playsInline
              muted
              className="aspect-video w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/20" />
            <div className="absolute bottom-2 left-2 rounded-full bg-white/80 px-2 py-1 text-xs text-black">
              Screen
            </div>
          </div>
        ) : (
          <div className="relative flex min-h-[4rem] items-center justify-center rounded-xl border border-dashed border-white/30 bg-black/20 text-xs text-white/70 text-center">
            Start screen share to display here
          </div>
        )}
      </div>
    </div>
  );
};

export default WebcamFeed;
