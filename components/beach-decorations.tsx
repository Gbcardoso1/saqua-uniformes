"use client"

const ornaments = [
  { left: "8%", delay: "-2s", color: "text-[#c84b4b]", size: "size-3" },
  { left: "19%", delay: "-5s", color: "text-[#d8b56d]", size: "size-2.5" },
  { left: "33%", delay: "-1s", color: "text-[#f2eee4]", size: "size-3.5" },
  { left: "47%", delay: "-4s", color: "text-[#c84b4b]", size: "size-2.5" },
  { left: "63%", delay: "-3s", color: "text-[#d8b56d]", size: "size-3" },
  { left: "78%", delay: "-6s", color: "text-[#f2eee4]", size: "size-2.5" },
  { left: "91%", delay: "-2.5s", color: "text-[#c84b4b]", size: "size-3.5" },
]

function SkatingSanta() {
  return (
    <svg viewBox="0 0 96 100" className="h-auto w-full" fill="none" aria-hidden="true">
      <path d="M29 91c15 5 36 5 52 0" stroke="#dff7ff" strokeWidth="3" strokeLinecap="round" />
      <path d="m38 85-5 8m37-8 5 8" stroke="#d8b56d" strokeWidth="3" strokeLinecap="round" />
      <path d="M36 54c2-15 22-19 31-6l7 28H32l4-22Z" fill="#b83e37" stroke="#f2eee4" strokeWidth="2" />
      <path d="M34 74h39v9H34z" fill="#f2eee4" />
      <path d="M42 48c-4-11 3-22 14-22 10 0 17 8 16 18l-8 10H44l-2-6Z" fill="#f2eee4" />
      <path d="M42 31c3-13 20-16 30-7l-3 8H45Z" fill="#c84b4b" /><path d="M43 33h27" stroke="#f2eee4" strokeWidth="4" strokeLinecap="round" /><circle cx="72" cy="24" r="4" fill="#f2eee4" />
      <circle cx="57" cy="39" r="1.5" fill="#173d31" /><path d="M61 44h4" stroke="#c84b4b" strokeWidth="2" strokeLinecap="round" />
      <path d="M39 58 23 68m42-10 13 8" stroke="#f2eee4" strokeWidth="5" strokeLinecap="round" />
      <path d="M41 81 35 90m27-9 9 9" stroke="#f2eee4" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

function PenguinSkater() {
  return (
    <svg viewBox="0 0 56 68" className="h-auto w-full" fill="none" aria-hidden="true">
      <ellipse cx="28" cy="39" rx="19" ry="24" fill="#192b2c" />
      <ellipse cx="28" cy="42" rx="12" ry="17" fill="#f6f3e9" />
      <circle cx="28" cy="20" r="15" fill="#192b2c" />
      <ellipse cx="28" cy="23" rx="10" ry="9" fill="#f6f3e9" />
      <circle cx="24" cy="21" r="1.5" fill="#192b2c" /><circle cx="32" cy="21" r="1.5" fill="#192b2c" />
      <path d="m26 25 2 3 3-3" fill="#e39a43" />
      <path d="M11 34 2 42m43-8 8 7" stroke="#192b2c" strokeWidth="4" strokeLinecap="round" />
      <path d="m20 60-3 5m18-5 3 5" stroke="#e39a43" strokeWidth="4" strokeLinecap="round" />
      <path d="M12 66h13m6 0h13" stroke="#dff7ff" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export function BeachDecorations({
  variant = "full",
}: {
  variant?: "full" | "subtle"
}) {
  const subtle = variant === "subtle"

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-36 overflow-hidden">
        <svg className="absolute -top-7 left-0 h-24 w-full text-[#174b3b]/70" viewBox="0 0 1440 120" preserveAspectRatio="none" fill="none">
          <path d="M-20 4 C180 110 260 95 430 34 S700 104 870 32 1160 104 1460 10" stroke="currentColor" strokeWidth="5" />
          <path d="M-20 8 C180 114 260 99 430 38 S700 108 870 36 1160 108 1460 14" stroke="#d8b56d" strokeOpacity=".28" strokeWidth="1" />
        </svg>
        {ornaments.map((ornament, index) => (
          <span
            key={ornament.left}
            className={`animate-christmas-sway absolute top-5 ${ornament.color}`}
            style={{ left: ornament.left, animationDelay: ornament.delay }}
          >
            <span className="absolute left-1/2 top-[-18px] h-[18px] w-px bg-[#d8b56d]/65" />
            <span className={`block ${ornament.size} rounded-full bg-current shadow-[0_0_16px_currentColor] ring-1 ring-white/25`} />
            {index % 2 === 0 && <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-white/80 blur-[1px]" />}
          </span>
        ))}
      </div>

      <div className="absolute right-[7%] top-36 hidden md:block">
        <div className="relative flex flex-col items-center opacity-70">
          <span className="text-3xl text-[#d8b56d]">✦</span>
          <span className="-mt-1 h-0 w-0 border-x-[38px] border-b-[54px] border-x-transparent border-b-[#174b3b]/65" />
          <span className="-mt-3 h-0 w-0 border-x-[50px] border-b-[65px] border-x-transparent border-b-[#1f624b]/65" />
          <span className="-mt-4 h-0 w-0 border-x-[62px] border-b-[76px] border-x-transparent border-b-[#174b3b]/65" />
          <span className="-mt-1 h-8 w-4 bg-[#8a5a3b]/80" />
          <span className="absolute top-24 right-10 size-2 rounded-full bg-[#c84b4b] shadow-[0_0_12px_#c84b4b]" />
          <span className="absolute top-36 left-10 size-2 rounded-full bg-[#d8b56d] shadow-[0_0_12px_#d8b56d]" />
          <span className="absolute top-48 right-8 size-2 rounded-full bg-[#f2eee4] shadow-[0_0_12px_white]" />
        </div>
      </div>

      {!subtle && (
        <div className="animate-santa-sleigh absolute left-0 top-[27%] w-[220px] text-white drop-shadow-[0_8px_12px_rgba(4,25,18,.35)] md:top-[30%] md:w-[280px]"
          style={{ animationDelay: "-12s" }}>
          <svg viewBox="0 0 300 118" className="h-auto w-full" fill="none">
            <path d="M26 72c18-10 30-10 42 0 12-10 24-10 36 0" stroke="#f2eee4" strokeWidth="3" strokeLinecap="round" />
            <path d="M31 69l-5-8m17 9 1-10m16 12 6-8m20 7-3-9m18 12 6-9" stroke="#f2eee4" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="28" cy="58" r="3" fill="#d8b56d" /><circle cx="76" cy="58" r="3" fill="#d8b56d" />
            <path d="M66 78c12-13 32-13 44 0l-7 11H73l-7-11Z" fill="#7a3028" stroke="#f2eee4" strokeWidth="2" />
            <path d="M78 74c-1-13 11-23 24-21 9 1 15 7 17 14l-8 11H82l-4-4Z" fill="#f2eee4" />
            <circle cx="103" cy="64" r="2" fill="#173d31" /><path d="M107 69h7" stroke="#c84b4b" strokeWidth="2" strokeLinecap="round" />
            <path d="M79 55c5-10 22-14 34-6l-3 7H81Z" fill="#c84b4b" /><path d="M81 55h30" stroke="#f2eee4" strokeWidth="4" strokeLinecap="round" /><circle cx="114" cy="48" r="4" fill="#f2eee4" />
            <path d="M112 80h54l18 18H91c9-5 15-11 21-18Z" fill="#a93d36" stroke="#d8b56d" strokeWidth="3" />
            <path d="M88 99c28 8 67 8 100-1" stroke="#d8b56d" strokeWidth="4" strokeLinecap="round" />
            <path d="M131 77c-2-16 10-27 25-26 10 0 18 8 19 18l-9 11h-31l-4-3Z" fill="#f2eee4" />
            <path d="M133 56c8-11 25-13 37-5l-3 7h-32Z" fill="#c84b4b" /><path d="M136 58h32" stroke="#f2eee4" strokeWidth="4" strokeLinecap="round" /><circle cx="171" cy="49" r="4" fill="#f2eee4" />
            <path d="M158 77c12-3 21-1 28 5l-8 10h-25Z" fill="#f2eee4" />
            <path d="M173 69c9-7 19-8 28-2l-6 11h-17" fill="#c84b4b" />
            <path d="M192 81c18-5 34-3 48 4" stroke="#d8b56d" strokeWidth="2" strokeDasharray="3 6" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {!subtle && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 24 }, (_, index) => (
            <span
              key={index}
              className="animate-christmas-snow absolute top-[-5%] block size-1 rounded-full bg-white/75 shadow-[0_0_8px_rgba(255,255,255,.8)]"
              style={{
                left: `${(index * 37 + 11) % 100}%`,
                animationDelay: `${-((index * 1.7) % 12)}s`,
                animationDuration: `${9 + (index % 7)}s`,
                opacity: 0.35 + (index % 5) * 0.12,
              }}
            />
          ))}
        </div>
      )}

      {!subtle && (
        <div className="absolute inset-x-0 bottom-0 h-[34%] overflow-hidden">
          <svg className="absolute inset-x-0 bottom-0 h-full w-full opacity-35" viewBox="0 0 1440 300" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 170 42 78l42 92 25-54 35 54 48-108 48 108 36-67 34 67 49-123 49 123 35-71 39 71 47-100 46 100 42-62 42 62 42-114 45 114 38-70 42 70 39-111 44 111 35-64 42 64 42-121 48 121 38-69 43 69 42-104 43 104 36-59 39 59 46-112 45 112 38-69 47 69 43-104 43 104V300H0Z" fill="#0b3028" />
            <path d="M0 218 38 127l38 91 24-48 29 48 42-106 45 106 31-61 31 61 45-99 43 99 33-56 38 56 40-94 42 94 35-52 38 52 40-101 43 101 35-57 38 57 42-97 43 97 36-55 40 55 42-92 43 92 39-54 37 54 45-98 45 98 41-57 46 57v82H0Z" fill="#123d32" />
          </svg>
          <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-b from-[#effaff]/75 via-[#dceff0]/90 to-[#a9d6da]/75 shadow-[0_-8px_24px_rgba(226,245,248,.35)]" />
          <div className="animate-ice-skater absolute bottom-5 left-0 w-20 text-white drop-shadow-[0_4px_8px_rgba(7,33,29,.45)] md:w-24">
            <SkatingSanta />
          </div>
          <div className="animate-ice-skater-delayed absolute bottom-5 left-0 w-12 text-[#f6f3e9] drop-shadow-[0_4px_8px_rgba(7,33,29,.45)] md:w-14">
            <PenguinSkater />
          </div>
          <div className="animate-ice-skater-third absolute bottom-5 left-0 w-11 text-[#f6f3e9] drop-shadow-[0_4px_8px_rgba(7,33,29,.45)] md:w-12">
            <PenguinSkater />
          </div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#103b30]/30 to-transparent" />
      <div className="absolute bottom-5 left-6 hidden items-end gap-1 opacity-45 md:flex">
        <span className="h-8 w-3 -rotate-12 rounded-t-full bg-[#174b3b]" />
        <span className="h-12 w-3 rotate-12 rounded-t-full bg-[#1f624b]" />
        <span className="h-7 w-3 -rotate-6 rounded-t-full bg-[#174b3b]" />
      </div>
    </div>
  )
}
