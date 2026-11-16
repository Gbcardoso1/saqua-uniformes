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

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#103b30]/30 to-transparent" />
      <div className="absolute bottom-5 left-6 hidden items-end gap-1 opacity-45 md:flex">
        <span className="h-8 w-3 -rotate-12 rounded-t-full bg-[#174b3b]" />
        <span className="h-12 w-3 rotate-12 rounded-t-full bg-[#1f624b]" />
        <span className="h-7 w-3 -rotate-6 rounded-t-full bg-[#174b3b]" />
      </div>
    </div>
  )
}
