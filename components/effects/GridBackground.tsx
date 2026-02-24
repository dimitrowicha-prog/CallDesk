'use client';

export function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <svg className="absolute inset-0 h-full w-full opacity-20">
        <defs>
          <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3">
              <animate attributeName="stop-color" values="#3b82f6; #8b5cf6; #3b82f6" dur="8s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3">
              <animate attributeName="stop-color" values="#8b5cf6; #3b82f6; #8b5cf6" dur="8s" repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-gradient)" />
      </svg>

      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/50 to-transparent animate-pulse" />
      <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500/50 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500/50 to-transparent animate-pulse" style={{ animationDelay: '2s' }} />
    </div>
  );
}
