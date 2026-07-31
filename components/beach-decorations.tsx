"use client"

/**
 * Camada decorativa com tema da praia de Saquarema (capital do surfe).
 * Fica atrás de todo o conteúdo, sem capturar cliques.
 *
 * variant="full"   -> home: sol, nuvens, gaivotas, prancha e ondas.
 * variant="subtle" -> painel admin: apenas ondas discretas no rodapé e
 *                     uma gaivota ocasional, para não atrapalhar a leitura.
 */
export function BeachDecorations({
  variant = "full",
}: {
  variant?: "full" | "subtle"
}) {
  if (variant === "subtle") {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        {/* Nuvens leves atravessando o céu */}
        <div
          className="animate-cloud-drift absolute top-24 left-0"
          style={{ animationDuration: "55s" }}
        >
          <Cloud className="w-24 text-primary/15" />
        </div>
        <div
          className="animate-cloud-drift absolute top-44 left-0"
          style={{ animationDuration: "80s", animationDelay: "-30s" }}
        >
          <Cloud className="w-16 text-primary/10" />
        </div>

        {/* Gaivotas cruzando devagar */}
        <div
          className="animate-gull-fly absolute top-28 left-0"
          style={{ animationDuration: "40s" }}
        >
          <Gull className="w-9 text-primary/40" />
        </div>
        <div
          className="animate-gull-fly absolute top-40 left-0"
          style={{ animationDuration: "52s", animationDelay: "-20s" }}
        >
          <Gull className="w-7 text-primary/30" />
        </div>

        {/* Prancha de surfe boiando no canto */}
        <div className="absolute bottom-24 right-6 animate-bob-float md:right-12">
          <Surfboard className="w-10 opacity-70 md:w-12" />
        </div>

        {/* Ondas no rodapé, em tom da cor primária (bem mais visíveis) */}
        <div className="absolute bottom-0 left-0 right-0 h-32">
          <WaveLayer
            className="text-primary/20"
            durationSeconds={16}
            heightClass="h-28"
          />
          <WaveLayer
            className="text-primary/30"
            durationSeconds={11}
            heightClass="h-20"
          />
          <WaveLayer
            className="text-primary/40"
            durationSeconds={8}
            heightClass="h-12"
          />
        </div>
      </div>
    )
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Sol com raios girando no canto superior direito */}
      <div className="absolute -right-10 -top-10 animate-sun-pulse">
        <div className="relative h-48 w-48">
          <div className="animate-sun-spin absolute inset-0">
            <SunRays />
          </div>
          <div className="absolute inset-[30%] rounded-full bg-yellow-200/80 blur-[1px]" />
          <div className="absolute inset-[34%] rounded-full bg-yellow-100" />
        </div>
      </div>

      {/* Nuvens flutuando */}
      <div
        className="animate-cloud-drift absolute top-24 left-0"
        style={{ animationDuration: "42s" }}
      >
        <Cloud className="w-28 text-white opacity-80" />
      </div>
      <div
        className="animate-cloud-drift absolute top-44 left-0"
        style={{ animationDuration: "60s", animationDelay: "-15s" }}
      >
        <Cloud className="w-20 text-white opacity-60" />
      </div>
      <div
        className="animate-cloud-drift absolute top-14 left-0"
        style={{ animationDuration: "75s", animationDelay: "-40s" }}
      >
        <Cloud className="w-36 text-white opacity-50" />
      </div>

      {/* Gaivotas voando */}
      <div
        className="animate-gull-fly absolute top-36 left-0"
        style={{ animationDuration: "28s" }}
      >
        <Gull className="w-10 text-white/80" />
      </div>
      <div
        className="animate-gull-fly absolute top-52 left-0"
        style={{ animationDuration: "36s", animationDelay: "-12s" }}
      >
        <Gull className="w-8 text-white/70" />
      </div>

      {/* Prancha de surfe boiando */}
      <div className="absolute bottom-28 right-8 animate-bob-float md:right-16">
        <Surfboard className="w-12 opacity-90 md:w-16" />
      </div>

      {/* Ondas do mar no rodapé */}
      <div className="absolute bottom-0 left-0 right-0 h-40">
        <WaveLayer
          className="text-white/10"
          durationSeconds={12}
          heightClass="h-32"
        />
        <WaveLayer
          className="text-white/15"
          durationSeconds={9}
          heightClass="h-24"
        />
        <WaveLayer
          className="text-white/20"
          durationSeconds={6}
          heightClass="h-16"
        />
      </div>
    </div>
  )
}

function SunRays() {
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full">
      <g fill="none" stroke="rgb(254 240 138 / 0.7)" strokeWidth="3" strokeLinecap="round">
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180
          const x1 = 50 + Math.cos(angle) * 32
          const y1 = 50 + Math.sin(angle) * 32
          const x2 = 50 + Math.cos(angle) * 46
          const y2 = 50 + Math.sin(angle) * 46
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        })}
      </g>
    </svg>
  )
}

function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 60" className={className} fill="currentColor">
      <ellipse cx="40" cy="40" rx="30" ry="18" />
      <ellipse cx="65" cy="32" rx="26" ry="22" />
      <ellipse cx="88" cy="42" rx="24" ry="16" />
      <rect x="30" y="40" width="70" height="16" rx="8" />
    </svg>
  )
}

function Gull({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 30" className={`animate-gull-flap ${className ?? ""}`} fill="none">
      <path
        d="M4 20 Q18 4 30 18 Q42 4 56 20"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Surfboard({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 120" className={className}>
      <ellipse cx="20" cy="60" rx="16" ry="58" fill="#ffb347" />
      <ellipse cx="20" cy="60" rx="16" ry="58" fill="none" stroke="#e67e22" strokeWidth="2" />
      <line x1="20" y1="8" x2="20" y2="112" stroke="#e67e22" strokeWidth="2" />
      <path d="M20 30 L14 60 L20 90 L26 60 Z" fill="#ff6b6b" opacity="0.85" />
    </svg>
  )
}

function WaveLayer({
  className,
  durationSeconds,
  heightClass,
}: {
  className?: string
  durationSeconds: number
  heightClass: string
}) {
  return (
    <div className={`absolute bottom-0 left-0 right-0 ${heightClass} ${className ?? ""}`}>
      <div
        className="animate-wave-slide h-full w-[200%]"
        style={{ animationDuration: `${durationSeconds}s` }}
      >
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="h-full w-1/2 float-left"
          fill="currentColor"
        >
          <path d="M0 60 C240 100 480 20 720 60 C960 100 1200 20 1440 60 L1440 120 L0 120 Z" />
        </svg>
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="h-full w-1/2 float-left"
          fill="currentColor"
        >
          <path d="M0 60 C240 100 480 20 720 60 C960 100 1200 20 1440 60 L1440 120 L0 120 Z" />
        </svg>
      </div>
    </div>
  )
}
