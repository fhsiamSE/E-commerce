import { useState } from "react";

const Loader = ({
  label = "Loading...",
  fullScreen = true,
  size = 150,
  className = "",
  inline = false,
  variant = "video",
}) => {
  const [videoFailed, setVideoFailed] = useState(false);

  const startVideo = (event) => {
    event.currentTarget.play().catch(() => {
      setVideoFailed(true);
    });
  };

  const spinner = (
    <span
      className="h-6 w-6 shrink-0 animate-spin rounded-full border-2 border-stone-200 border-t-stone-700"
      style={{ width: Math.min(size, 24), height: Math.min(size, 24) }}
      aria-hidden="true"
    />
  );

  const loaderVisual = (
    variant === "spinner" || videoFailed ? (
      spinner
    ) : (
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        width={size}
        height={size}
        onCanPlay={startVideo}
        onError={() => setVideoFailed(true)}
        className="shrink-0 object-contain"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        <source src="/videos/loading.mp4" type="video/mp4" />
      </video>
    )
  );

  if (inline) {
    return (
      <span
        className={`inline-flex items-center justify-center gap-2 ${className}`}
        role="status"
        aria-live="polite"
      >
        {loaderVisual}
        {label && <span>{label}</span>}
      </span>
    );
  }

  return (
    <div
      className={`${fullScreen ? "flex min-h-screen" : "flex min-h-48"} items-center justify-center ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center justify-center gap-2">
        {loaderVisual}
        {label && <p className="text-sm text-stone-500">{label}</p>}
      </div>
    </div>
  );
};

export default Loader;