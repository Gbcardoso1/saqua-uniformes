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

const holidayIcons = [
  { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/presente-QPN3ehH18wdLkTD8RTkEsytWa0pvjD.png", size: "size-12", left: "3%", top: "42%", rotation: "-8deg" },
  { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/homem-biscoito-LZm8JvnIRjYlBlIo6rEla1y9ay53Np.png", size: "size-11", left: "10%", top: "58%", rotation: "7deg" },
  { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/meia-Vjm7rQkSakvwhALSo1j2zXRwQrvxkj.png", size: "size-11", left: "91%", top: "43%", rotation: "-10deg" },
  { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/papai-noel-1qfgzjBBxqCjKErEoNtYvc0b9Luql9.png", size: "size-12", left: "96%", top: "59%", rotation: "6deg" },
  { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sino-de-natal-YkeeTMZLp62T9wV36ktX7l4djsxRWs.png", size: "size-11", left: "4%", top: "75%", rotation: "-7deg" },
  { src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/boneco-de-neve-TQlgslq7YdozU7NH63tmq4PamalCGd.png", size: "size-11", left: "94%", top: "77%", rotation: "8deg" },
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

      <div className="absolute inset-x-0 top-[4.25rem] flex items-center justify-center gap-2 lg:hidden">
        {holidayIcons.map((icon, index) => (
          <img
            key={icon.src}
            src={icon.src}
            alt=""
            className="size-6 animate-holiday-icon drop-shadow-[0_2px_5px_rgba(4,25,18,.4)] sm:size-7"
            style={{ animationDelay: `${index * -0.8}s` }}
          />
        ))}
      </div>

      <div
        className="animate-santa-sleigh-crossing pointer-events-none absolute left-0 top-[24%] w-[106px] opacity-95 drop-shadow-[0_4px_8px_rgba(4,25,18,.4)] sm:w-32 md:w-40"
        style={{ animationDelay: "-11s" }}
      >
        <img src="/santa-sleigh-icon.png" alt="" className="h-auto w-full" />
      </div>

      {holidayIcons.map((icon, index) => (
        <span
          key={icon.src}
          className="absolute hidden lg:block"
          style={{
            left: icon.left,
            top: icon.top,
            transform: `translate(-50%, -50%) rotate(${icon.rotation})`,
          }}
        >
          <img
            src={icon.src}
            alt=""
            className={`${icon.size} animate-holiday-icon opacity-90 drop-shadow-[0_3px_8px_rgba(4,25,18,.35)]`}
            style={{ animationDelay: `${index * -0.8}s` }}
          />
        </span>
      ))}

      {!subtle && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 22 }, (_, index) => (
            <span
              key={index}
              className="holiday-star animate-holiday-star absolute"
              style={{
                left: `${(index * 43 + 9) % 100}%`,
                top: `${(index * 61 + 7) % 92 + 4}%`,
                width: `${index % 3 === 0 ? 10 : 7}px`,
                height: `${index % 3 === 0 ? 10 : 7}px`,
                animationDelay: `${-((index * 1.3) % 7)}s`,
              }}
            />
          ))}
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
