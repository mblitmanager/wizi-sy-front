interface ProgressBarProps {
  duration: number; // Durée totale en secondes
  currentTime: number; // Temps écoulé en secondes
  color?: string;
  height?: number;
}

export function ProgressBar({
  duration,
  currentTime,
  color = "bg-[#10b981]",
  height = 4,
}: ProgressBarProps) {
  const progress = (currentTime / duration) * 100;

  return (
    <div
      className={`w-full bg-gray-200 rounded-full`}
      style={{ height: `${height}px` }}>
      <div
        className={`h-full rounded-full transition-all duration-1000 ${color}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
