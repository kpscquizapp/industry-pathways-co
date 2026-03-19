import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { toast } from "sonner";

type WebcamFeedProps = {
  isInterviewActive: boolean;
  totalViolations: number;
  onScreenShareStart?: () => void;
  onRecordingStart?: () => void;
  onRecordingStop?: () => void;
  onCameraError?: () => void;
  sessionId: string;
};

const WebcamFeed = ({
  isInterviewActive,
  totalViolations,
  onScreenShareStart,
  onRecordingStart,
  onRecordingStop,
  onCameraError,
  sessionId,
}: WebcamFeedProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const screenVideoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const screenRecorderRef = useRef<MediaRecorder | null>(null);
  const screenRecordedChunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [screenShareStream, setScreenShareStream] =
    useState<MediaStream | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 24, y: 96 });
  const popupRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    originX: number;
    originY: number;
  } | null>(null);
  const canScreenShare = useMemo(
    () =>
      typeof navigator !== "undefined" &&
      !!navigator.mediaDevices?.getDisplayMedia,
    [],
  );
  const isScreenSharing = !!screenShareStream;

  const uploadRecording = useCallback(
    async (blob: Blob, recordingType: "webcam" | "screen") => {
      const baseType = blob.type ? blob.type.split(";")[0] : "";
      const normalizedType = baseType.startsWith("video/")
        ? baseType
        : "video/webm";
      const normalizedBlob = new Blob([blob], { type: normalizedType });
      const formData = new FormData();
      formData.append("sessionId", sessionId);
      formData.append("type", recordingType);
      const fileName =
        recordingType === "screen" ? "screen-recording.webm" : "recording.webm";
      formData.append("recording", normalizedBlob, fileName);

      try {
        const response = await fetch("/api/recordings/upload", {
          method: "POST",
          body: formData,
        });
        if (!response.ok) {
          let message = "Only video files allowed for recordings";
          try {
            const data = await response.json();
            if (typeof data?.message === "string" && data.message.trim())
              message = data.message;
            if (typeof data?.error === "string" && data.error.trim())
              message = data.error;
          } catch {
            const text = await response.text().catch(() => "");
            if (text.trim()) message = text;
          }
          toast.error(message);
        }
      } catch {
        toast.error("Only video files allowed for recordings");
      }
    },
    [sessionId],
  );

  useEffect(() => {
    if (!isInterviewActive) {
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
      }
      if (
        screenRecorderRef.current &&
        screenRecorderRef.current.state !== "inactive"
      ) {
        screenRecorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setScreenShareStream((prev) => {
        prev?.getTracks().forEach((track) => track.stop());
        return null;
      });
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      if (screenVideoRef.current) {
        screenVideoRef.current.srcObject = null;
      }
      return;
    }

    let isActive = true;

    async function getStream() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("MediaDevices API not available");
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
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
        recordedChunksRef.current = [];
        recorder.onstart = () => {
          setIsRecording(true);
          onRecordingStart?.();
        };
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            recordedChunksRef.current.push(e.data);
          }
        };

        if (!isActive) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        recorder.onstop = () => {
          setIsRecording(false);
          onRecordingStop?.();
          const recordedChunks = recordedChunksRef.current;
          recordedChunksRef.current = [];
          if (recordedChunks.length) {
            const fullRecording = new Blob(recordedChunks, {
              type: recordedChunks[0]?.type || "video/webm",
            });
            void uploadRecording(fullRecording, "webcam");
          }
        };

        recorder.start();
      } catch {
        setIsRecording(false);
        onCameraError?.();
        toast.error("You should allow access to your webcam.");
      }
    }

    getStream();

    return () => {
      isActive = false;
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [
    uploadRecording,
    isInterviewActive,
    onCameraError,
    onRecordingStart,
    onRecordingStop,
  ]);

  useEffect(() => {
    if (screenVideoRef.current) {
      screenVideoRef.current.srcObject = screenShareStream;
    }
  }, [screenShareStream]);

  useEffect(() => {
    if (!screenShareStream) {
      if (
        screenRecorderRef.current &&
        screenRecorderRef.current.state !== "inactive"
      ) {
        screenRecorderRef.current.stop();
      }
      screenRecorderRef.current = null;
      screenRecordedChunksRef.current = [];
      return;
    }

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
    screenRecordedChunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        screenRecordedChunksRef.current.push(e.data);
      }
    };
    recorder.onstop = () => {
      const recordedChunks = screenRecordedChunksRef.current;
      screenRecordedChunksRef.current = [];
      if (recordedChunks.length) {
        const fullRecording = new Blob(recordedChunks, {
          type: recordedChunks[0]?.type || "video/webm",
        });
        void uploadRecording(fullRecording, "screen");
      }
    };
    recorder.start();

    return () => {
      if (recorder.state !== "inactive") {
        recorder.stop();
      }
    };
  }, [screenShareStream, uploadRecording]);

  const stopScreenShare = useCallback(() => {
    if (
      screenRecorderRef.current &&
      screenRecorderRef.current.state !== "inactive"
    ) {
      screenRecorderRef.current.stop();
    }
    setScreenShareStream((prev) => {
      prev?.getTracks().forEach((track) => track.stop());
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
        screenTrack.addEventListener("ended", stopScreenShare);
      }
      setScreenShareStream(stream);
    } catch {
      toast.error("You should allow access to your screen.");
    }
  }, [canScreenShare, onScreenShareStart, stopScreenShare]);

  const handlePopupPointerDown = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      if (!popupRef.current) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      dragStateRef.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        originX: popupPosition.x,
        originY: popupPosition.y,
      };
    },
    [popupPosition],
  );

  const handlePopupPointerMove = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      const dragState = dragStateRef.current;
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      const deltaX = event.clientX - dragState.startX;
      const deltaY = event.clientY - dragState.startY;
      const nextX = dragState.originX + deltaX;
      const nextY = dragState.originY + deltaY;
      const popup = popupRef.current?.getBoundingClientRect();
      if (popup && typeof window !== "undefined") {
        const minX = 12;
        const minY = 12;
        const maxX = window.innerWidth - popup.width - 12;
        const maxY = window.innerHeight - popup.height - 12;
        setPopupPosition({
          x: Math.max(minX, Math.min(maxX, nextX)),
          y: Math.max(minY, Math.min(maxY, nextY)),
        });
        return;
      }
      setPopupPosition({ x: nextX, y: nextY });
    },
    [],
  );

  const handlePopupPointerUp = useCallback(
    (event: PointerEvent<HTMLButtonElement>) => {
      const dragState = dragStateRef.current;
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      dragStateRef.current = null;
    },
    [],
  );

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl bg-[#0b1220] shadow-[0_30px_80px_rgba(11,18,32,0.35)]">
        <div className="absolute left-4 top-4 z-10 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80">
            <span
              className={`h-2 w-2 rounded-full ${
                isRecording ? "bg-red-600" : "bg-white/30"
              }`}
            />
            {isRecording ? "Recording" : "Idle"}
          </div>
          <div className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80">
            Violations: {totalViolations}
          </div>
        </div>
        <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
          <button
            className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80 transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={isScreenSharing ? stopScreenShare : startScreenShare}
            disabled={!isInterviewActive || !canScreenShare}
          >
            {isScreenSharing ? "Stop Share" : "Share Screen"}
          </button>
        </div>

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="aspect-video w-full object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/50 via-transparent to-black/20" />

        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3">
          <div className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black">
            You
          </div>
          <div className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
            {isRecording ? "Camera On" : "Camera Off"}
          </div>
        </div>
      </div>
      {isScreenSharing ? (
        <div
          ref={popupRef}
          className="fixed z-50 w-72 overflow-hidden rounded-2xl border border-white/20 bg-black/90 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
          style={{
            left: `${popupPosition.x}px`,
            top: `${popupPosition.y}px`,
          }}
        >
          <button
            className="flex w-full items-center justify-between gap-2 bg-black/70 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/80"
            onPointerDown={handlePopupPointerDown}
            onPointerMove={handlePopupPointerMove}
            onPointerUp={handlePopupPointerUp}
            onPointerCancel={handlePopupPointerUp}
            type="button"
          >
            <span>Screen Share</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px]">
              Drag
            </span>
          </button>
          <video
            ref={screenVideoRef}
            autoPlay
            playsInline
            muted
            className="aspect-video w-full object-cover"
          />
        </div>
      ) : null}
    </>
  );
};

export default WebcamFeed;
