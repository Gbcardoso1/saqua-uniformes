"use client"

/**
 * Camada decorativa sazonal de Halloween.
 * Fica atrás de todo o conteúdo, sem capturar cliques.
 *
 * variant="full"   -> home: lua, névoa, morcegos, abóboras e bruma.
 * variant="subtle" -> painel admin: névoa discreta e morcegos ocasionais.
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
        {/* Névoa atravessando o céu */}
        <div
          className="animate-cloud-drift absolute top-24 left-0"
          style={{ animationDuration: "55s" }}
        >
          <Cloud className="w-24 text-slate-950/80" />
        </div>
        <div
          className="animate-cloud-drift absolute top-44 left-0"
          style={{ animationDuration: "80s", animationDelay: "-30s" }}
        >
          <Cloud className="w-16 text-slate-950/65" />
        </div>

        {/* Morcegos cruzando devagar */}
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

        {/* Abóbora flutuando no canto */}
        <div className="absolute bottom-24 right-6 animate-bob-float md:right-12">
          <Pumpkin className="w-10 opacity-85 md:w-12" />
        </div>

        {/* Ondas no rodapé, em tom da cor primária (bem mais visíveis) */}
        <div className="absolute bottom-0 left-0 right-0 h-32">
          <WaveLayer
            className="text-red-950/45"
            durationSeconds={16}
            heightClass="h-28"
          />
          <WaveLayer
            className="text-red-900/55"
            durationSeconds={11}
            heightClass="h-20"
          />
          <WaveLayer
            className="text-red-800/65"
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
      {/* Lua cheia com brilho no canto superior direito */}
      <div className="absolute -right-20 -top-20 animate-sun-pulse">
        <div className="relative h-80 w-80">
          <div className="animate-sun-spin absolute inset-0">
            <SunRays />
          </div>
          <div className="absolute inset-[28%] rounded-full bg-violet-500/30 blur-[12px]" />
          <div className="absolute inset-[34%] rounded-full bg-slate-100 shadow-[0_0_34px_rgba(226,232,240,0.8)]" />
        </div>
      </div>

      {/* Névoa flutuando */}
      <div
        className="animate-cloud-drift absolute top-24 left-0"
        style={{ animationDuration: "42s" }}
      >
        <Cloud className="w-28 text-slate-950 opacity-90" />
      </div>
      <div
        className="animate-cloud-drift absolute top-44 left-0"
        style={{ animationDuration: "60s", animationDelay: "-15s" }}
      >
        <Cloud className="w-20 text-slate-950 opacity-75" />
      </div>
      <div
        className="animate-cloud-drift absolute top-14 left-0"
        style={{ animationDuration: "75s", animationDelay: "-40s" }}
      >
        <Cloud className="w-36 text-slate-950 opacity-65" />
      </div>

      {/* Morcegos voando */}
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

      {/* Ícones de Halloween, menores que as decorações principais */}
      <img
        src="/halloween-spiderweb.png"
        alt=""
        className="animate-bob-float absolute top-32 right-[18%] w-16 opacity-70 md:w-20"
        style={{ animationDelay: "-2s" }}
      />
      <img
        src="/halloween-ghost.png"
        alt=""
        className="animate-bob-float absolute top-64 left-[12%] w-16 opacity-75 md:w-20"
        style={{ animationDelay: "-4s" }}
      />
      <img
        src="/halloween-bats.png"
        alt=""
        className="animate-bob-float absolute top-24 left-[32%] w-16 opacity-75 md:w-20"
        style={{ animationDelay: "-1s" }}
      />
      <img
        src="/halloween-pumpkin.png"
        alt=""
        className="animate-bob-float absolute bottom-32 right-[10%] w-16 opacity-80 md:w-20"
        style={{ animationDelay: "-3s" }}
      />

      {/* Bruma rasteira no rodapé */}
      <div className="absolute bottom-0 left-0 right-0 h-40">
        <WaveLayer
          className="text-[#031d36]/70"
          durationSeconds={12}
          heightClass="h-32"
        />
        <WaveLayer
          className="text-[#042f55]/80"
          durationSeconds={9}
          heightClass="h-24"
        />
        <WaveLayer
          className="text-[#06446e]/85"
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
      <circle cx="50" cy="50" r="38" fill="none" stroke="rgb(251 146 60 / 0.35)" strokeWidth="2" strokeDasharray="3 6" />
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
    <svg viewBox="0 0 80 42" className={`animate-gull-flap ${className ?? ""}`} fill="currentColor">
      <path d="M2 20 Q13 7 25 16 L40 8 L55 16 Q67 7 78 20 L61 18 L55 34 L40 24 L25 34 L19 18 Z" />
      <circle cx="33" cy="17" r="1.5" fill="rgb(24 24 27)" />
      <circle cx="47" cy="17" r="1.5" fill="rgb(24 24 27)" />
    </svg>
  )
}

function Pumpkin({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className}>
      <path d="M40 8 C61 8 72 25 68 47 C64 67 52 75 40 75 C28 75 16 67 12 47 C8 25 19 8 40 8Z" fill="#f97316" stroke="#7c2d12" strokeWidth="3" />
      <path d="M25 22 Q31 17 36 23 L32 30 L23 30Z M44 23 Q49 17 55 22 L57 30 L47 30Z" fill="#18181b" />
      <path d="M29 49 Q40 58 51 49" fill="none" stroke="#18181b" strokeWidth="3" strokeLinecap="round" />
      <path d="M34 9 Q40 1 46 9" fill="none" stroke="#65a30d" strokeWidth="5" strokeLinecap="round" />
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
