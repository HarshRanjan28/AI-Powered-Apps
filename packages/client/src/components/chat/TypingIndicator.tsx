export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-2">
      <Dot />
      <Dot className="animation-delay-200" />
      <Dot className="animation-delay-400" />
    </div>
  );
}

type DotProps = {
  className?: string;
};

function Dot({ className }: DotProps) {
  return (
    <div
      className={`w-3 h-3 bg-gray-400 rounded-full animate-pulse ${className}`}
    ></div>
  );
}
