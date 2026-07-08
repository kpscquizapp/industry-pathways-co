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

  /**
   * recordingIdRef holds the live recording IDs.
   * We use a "take ownership" pattern: whichever code path finalizes a recording
   * atomically swaps the ID to null first, preventing double /recordings/end calls.
   */
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
  // Tracks whether a recording has ever started, so the cleanup effect
  // doesn't run on the very first render before any recording begins.
  const hasRecordingStartedRef = useRef(false);

  // RTK Query mutation triggers
  const [startRecording] = useStartRecordingMutation();
  const [uploadChunkMutation] = useUploadChunkMutation();
  const [endRecording] = useEndRecordingMutation();
  const [recordingPing] = useRecordingPingMutation();

  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [screenShareStream, setScreenShareStream] =
    useState<MediaStream | null>(null);
  // Ref mirror of screenShareStream so the isInterviewActive cleanup
  // can read the current value without re-running the effect.
  const screenShareStreamRef = useRef<MediaStream | null>(null);

  const canScreenShare = useMemo(
    () =>
      typeof navigator !== "undefined" &&
      !!navigator.mediaDevices?.getDisplayMedia,
    [],
  );

  // Keep session ID ref current so async callbacks always use the latest value.
  useEffect(() => {
    if (sessionId) {
      activeSessionIdRef.current = sessionId;
    }
  }, [sessionId]);

  // Sync initialStream → state once (for parent-provided streams)
  useEffect(() => {
    if (initialStream && !webcamStream) {
      setWebcamStream(initialStream);
    }
  }, [initialStream, webcamStream]);

  useEffect(() => {
    if (initialScreenStream && !screenShareStream) {
      setScreenShareStream(initialScreenStream);
      screenShareStreamRef.current = initialScreenStream;
    }
  }, [initialScreenStream, screenShareStream]);

  // Keep video elements updated
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

  /**
   * Atomically "claims" the recording ID and calls /recordings/end exactly once.
   * Returns true if the call was made, false if another path already claimed it.
   */
  const finalizeRecording = useCallback(
    async (type: "webcam" | "screen"): Promise<boolean> => {
      const activeSessionId = activeSessionIdRef.current;
      if (!activeSessionId) return false;

      // Atomically take ownership: set to null and capture the previous value.
      const claimedId = recordingIdRef.current[type];
      if (claimedId === null) {
        // Already finalized by another path — skip.
        return false;
      }
      recordingIdRef.current[type] = null;

      try {
        const result = await endRecording({ sessionId: activeSessionId, type }).unwrap();
        if (result.integrity && result.integrity.isValid === false) {
          console.warn(`Recording integrity check failed for ${type}`, {
            duplicateChunks: result.integrity.duplicateChunks || [],
            missingChunks: result.integrity.missingChunks || [],
          });
          toast.error("Recording integrity check found issues and was flagged for review.");
        }
        return true;
      } catch (error) {
        recordingIdRef.current[type] = claimedId;
        console.warn(`Failed to finalize ${type} recording`, error);
        return false;
      }
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

  // ── Cleanup when interview ends ─────────────────────────────────────
  useEffect(() => {
    // Skip: interview still active or no recording has started yet.
    if (isInterviewActive || !hasRecordingStartedRef.current) {
      if (isInterviewActive) {
        uploadIssueToastShownRef.current = false;
      }
      return;
    }

    uploadIssueToastShownRef.current = false;
    isStreamingRef.current = false;

    // Finalize webcam recording (atomic — won't double-call if already done)
    void finalizeRecording("webcam").catch((err) => {
      console.warn("Failed to finalize webcam recording", err);
    });

    // Finalize screen recording (atomic — won't double-call if already done)
    void finalizeRecording("screen").catch((err) => {
      console.warn("Failed to finalize screen recording", err);
    });

    // Stop MediaRecorders if still running
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
    if (screenRecorderRef.current && screenRecorderRef.current.state !== "inactive") {
      screenRecorderRef.current.stop();
    }

    // Stop tracks we own (not parent-provided streams)
    if (streamRef.current && streamRef.current !== initialStream) {
      stopTracks(streamRef.current);
    }
    streamRef.current = null;

    const currentScreenStream = screenShareStreamRef.current;
    if (currentScreenStream && currentScreenStream !== initialScreenStream) {
      stopTracks(currentScreenStream);
    }
    screenShareStreamRef.current = null;
    setScreenShareStream(null);

    pendingChunksRef.current.webcam.clear();
    pendingChunksRef.current.screen.clear();

    if (videoRef.current) videoRef.current.srcObject = null;
    if (screenVideoRef.current) screenVideoRef.current.srcObject = null;
  }, [isInterviewActive, finalizeRecording, initialStream, initialScreenStream]);

  // ── Webcam + recording setup ────────────────────────────────────────
  useEffect(() => {
    if (!isInterviewActive) {
      return;
    }

    let isActive = true;
    let keepaliveInterval: NodeJS.Timeout | null = null;

    // Auto-start screen sharing when interview becomes active
    const startScreenSharing = async () => {
      // Use ref to avoid stale closure on screenShareStream state
      if (screenShareStreamRef.current || initialScreenStream) return;
      if (!canScreenShare) {
        toast.error("Screen capture is not supported.");
        return;
      }

      try {
        onScreenShareStart?.();
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: {
            width: { ideal: 854 },
            height: { ideal: 480 },
            frameRate: { ideal: 10 }, // reduced fps saves storage; UI/text still readable
          },
          audio: true,
        });
        const [screenTrack] = stream.getVideoTracks();
        if (screenTrack) {
          screenTrack.addEventListener("ended", () => {
            screenShareStreamRef.current = null;
            setScreenShareStream((prev) => {
              stopTracks(prev);
              return null;
            });
          });
        }
        screenShareStreamRef.current = stream;
        setScreenShareStream(stream);
      } catch (error) {
        toast.error("You should allow access to your screen.");
      }
    };

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
            video: {
              width: { ideal: 854 },
              height: { ideal: 480 },
              frameRate: { ideal: 10 }, // 480p at 10 fps — good quality, lower storage
            },
            audio: true,
          });
        }

        if (!isActive) {
          if (stream !== initialStream) stopTracks(stream);
          return;
        }

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
          hasRecordingStartedRef.current = true;
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
        const recorder = new MediaRecorder(stream, {
          mimeType: mimeType || undefined,
          videoBitsPerSecond: 300_000, // 300 kbps for 480p webcam
        });

        recorderRef.current = recorder;

        recorder.onstart = () => {
          setIsRecording(true);
          onRecordingStart?.();
          keepaliveInterval = setInterval(() => {
            void sendKeepalive();
          }, 30_000);
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

          if (pendingChunksRef.current.webcam.size > 0) {
            notifyUploadIssue("Some webcam recording chunks could not be uploaded.");
          }

          // NOTE: finalizeRecording("webcam") is handled by the isInterviewActive
          // cleanup effect to prevent double-calling /recordings/end.
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

  // ── Screen recording setup ─────────────────────────────────────────
  useEffect(() => {
    if (!screenShareStream) {
      // screenShareStream became null — finalize atomically (no double call).
      void finalizeRecording("screen").catch((err) => {
        console.warn("Failed to finalize screen recording on stream end", err);
      });

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
        hasRecordingStartedRef.current = true;
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
    const recorder = new MediaRecorder(screenShareStream, {
      mimeType: mimeType || undefined,
      videoBitsPerSecond: 300_000, // 300 kbps — reduced bitrate, UI/text still legible at 480p
    });

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
      // NOTE: finalizeRecording("screen") is handled either by the
      // screenShareStream-becomes-null path above, or by the isInterviewActive
      // cleanup effect — both are atomic, so only one will actually call the API.
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
    finalizeRecording,
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

    screenShareStreamRef.current = null;
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
        video: {
          width: { ideal: 640 },
          height: { ideal: 360 },
          frameRate: { ideal: 15 },
        },
        audio: true,
      });
      const [screenTrack] = stream.getVideoTracks();

      if (screenTrack) {
        screenTrack.addEventListener("ended", stopScreenShare, { once: true });
      }

      screenShareStreamRef.current = stream;
      setScreenShareStream(stream);
    } catch (error) {
      toast.error("You should allow access to your screen.");
    }
  }, [canScreenShare, onScreenShareStart, stopScreenShare]);

  return null;
};

export default WebcamFeed;
