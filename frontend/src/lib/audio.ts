export class MicPermissionDeniedError extends Error {
  constructor() {
    super("Microphone access was denied.");
    this.name = "MicPermissionDeniedError";
  }
}

export class MicUnavailableError extends Error {
  constructor(message = "No microphone is available on this device.") {
    super(message);
    this.name = "MicUnavailableError";
  }
}

export interface ActiveRecording {
  /** Stops recording and resolves with the captured audio as a Blob. */
  stop: () => Promise<Blob>;
  /** Stops recording and releases the microphone without keeping the audio. */
  cancel: () => void;
}

const preferredMimeTypes = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
];

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  return preferredMimeTypes.find((type) => MediaRecorder.isTypeSupported(type));
}

/**
 * Requests real microphone access and starts recording immediately
 * (push-to-talk: call `startRecording()` on press, `stop()` on release).
 * Never fabricates audio — this always captures actual microphone input.
 */
export async function startRecording(): Promise<ActiveRecording> {
  if (
    typeof navigator === "undefined" ||
    !navigator.mediaDevices?.getUserMedia
  ) {
    throw new MicUnavailableError("This browser does not support audio recording.");
  }

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  } catch (err) {
    if (err instanceof DOMException && err.name === "NotAllowedError") {
      throw new MicPermissionDeniedError();
    }
    throw new MicUnavailableError();
  }

  const mimeType = pickMimeType();
  const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  const chunks: BlobPart[] = [];

  recorder.addEventListener("dataavailable", (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  });

  recorder.start();

  const releaseStream = () => {
    stream.getTracks().forEach((track) => track.stop());
  };

  return {
    stop: () =>
      new Promise<Blob>((resolve) => {
        recorder.addEventListener(
          "stop",
          () => {
            releaseStream();
            resolve(new Blob(chunks, { type: mimeType ?? "audio/webm" }));
          },
          { once: true },
        );
        recorder.stop();
      }),
    cancel: () => {
      if (recorder.state !== "inactive") recorder.stop();
      releaseStream();
    },
  };
}
