const BAR_HEIGHTS = [10, 18, 26, 16, 22, 12, 20, 14];

export default function Waveform({ active = true }: { active?: boolean }) {
  return (
    <div className="flex h-8 items-center justify-center gap-1" role="presentation">
      {BAR_HEIGHTS.map((height, index) => (
        <span
          key={index}
          className={`w-1.5 rounded-full bg-primary-600 ${active ? "animate-waveform-bar" : ""}`}
          style={{
            height: `${height}px`,
            animationDelay: `${index * 90}ms`,
            transform: active ? undefined : "scaleY(0.3)",
          }}
        />
      ))}
    </div>
  );
}
