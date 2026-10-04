import { useEffect, useState } from "react";
import { Mail, Star, RotateCcw } from "lucide-react";
import SectionShell from "./SectionShell";
import {
  SKILLS,
  SORTED_SKILLS,
  SKILL_COUNTS as COUNTS,
  getSkillIcon,
} from "./Skills";

const RARITY_STYLE = {
  SSR: {
    stars: 3,
    glow: "drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]",
    border: "border-pink-400",
    badge: "bg-pink-400 text-white",
    star: "fill-pink-400 text-pink-400",
  },
  SR: {
    stars: 2,
    glow: "drop-shadow-[0_0_12px_rgba(251,191,36,0.75)]",
    border: "border-amber-400",
    badge: "bg-amber-400 text-white",
    star: "fill-amber-400 text-amber-400",
  },
  Normal: {
    stars: 1,
    glow: "drop-shadow-[0_0_12px_rgba(14,165,233,0.65)]",
    border: "border-sky-400",
    badge: "bg-sky-500 text-white",
    star: "fill-sky-400 text-sky-400",
  },
};

const FILTERS = ["Semua", "Frontend", "Bahasa", "Backend", "Database", "Tools"];

export default function GachaSkills() {
  // 'idle' | 'shaking' | 'revealed'
  const [phase, setPhase] = useState("idle");
  const [filter, setFilter] = useState("Semua");

  useEffect(() => {
    if (phase !== "shaking") return;
    const timer = setTimeout(() => setPhase("revealed"), 1500);
    return () => clearTimeout(timer);
  }, [phase]);

  const visible =
    filter === "Semua"
      ? SORTED_SKILLS
      : SORTED_SKILLS.filter((s) => s.cat === filter);

  const reset = () => {
    setPhase("idle");
    setFilter("Semua");
    // Setelah konten memendek, kembalikan tampilan ke awal section Gacha
    requestAnimationFrame(() => {
      document
        .getElementById("skills")
        ?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  };
  return (
    <SectionShell id="skills" title="GACHA KEAHLIAN">
      <div className="flex min-h-96 flex-col items-center justify-center">
        <p className="mb-6 text-center text-slate-500">
          {phase === "revealed"
            ? `Selamat, Sensei! Kamu mendapat ${SKILLS.length} skill dari hasil gacha-mu.`
            : "Klik amplop untuk membuka skill saya."}
        </p>

        {phase === "revealed" && (
          <>
            {/* Ringkasan rarity */}
            <ul className="mb-6 flex flex-wrap justify-center gap-3 text-sm font-bold">
              <li className="bg-pink-400 px-3 py-1 text-white">
                SSR × {COUNTS.SSR}
              </li>
              <li className="bg-amber-400 px-3 py-1 text-white">
                SR × {COUNTS.SR}
              </li>
              <li className="bg-sky-500 px-3 py-1 text-white">
                Normal × {COUNTS.Normal}
              </li>
            </ul>

            {/* Filter kategori */}
            <div
              role="group"
              aria-label="Filter kategori skill"
              className="mb-10 flex flex-wrap justify-center gap-2"
            >
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full border-2 border-sky-500 px-4 py-1 text-sm font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
                    filter === f
                      ? "bg-sky-500 text-white"
                      : "bg-white text-sky-500 hover:bg-sky-50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </>
        )}

        {phase !== "revealed" && (
          <button
            onClick={() => phase === "idle" && setPhase("shaking")}
            disabled={phase === "shaking"}
            aria-label="Buka amplop gacha"
            className={`rounded-full p-6 text-sky-500 transition hover:scale-105 focus-visible:outline-4 focus-visible:outline-sky-500 ${
              phase === "shaking" ? "animate-shake" : ""
            }`}
          >
            <Mail
              size={180}
              strokeWidth={1.4}
              className="drop-shadow-[0_0_18px_rgba(14,165,233,0.5)]"
            />
          </button>
        )}

        {phase === "revealed" && (
          <>
            <div className="grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((skill, i) => {
                const s = RARITY_STYLE[skill.rarity];
                const icon = getSkillIcon(skill);
                return (
                  <div
                    key={skill.name}
                    className={`animate-pop-in ${s.glow}`}
                    style={{ animationDelay: `${Math.min(i * 70, 1000)}ms` }}
                  >
                    <div
                      className={`clip-chamfered flex h-full flex-col gap-2.5 border-4 bg-white p-5 ${s.border}`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-3 py-0.5 text-sm font-bold ${s.badge}`}
                        >
                          {skill.rarity}
                        </span>
                        <div
                          className="flex gap-0.5"
                          aria-label={`${s.stars} bintang`}
                        >
                          {Array.from({ length: s.stars }).map((_, n) => (
                            <Star key={n} size={18} className={s.star} />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {icon && (
                          <img
                            src={icon}
                            alt=""
                            className="h-9 w-9 shrink-0 object-contain"
                          />
                        )}
                        <h3 className="text-xl font-extrabold text-slate-800">
                          {skill.name}
                        </h3>
                      </div>
                      <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">
                        {skill.cat}
                      </p>
                      <p className="pb-3 text-sm text-slate-500">
                        {skill.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={reset}
              className="mt-12 flex items-center gap-2 rounded-full border-2 border-sky-500 bg-white px-6 py-2 font-semibold text-sky-500 transition hover:bg-sky-500 hover:text-white"
            >
              <RotateCcw size={18} />
              Gacha Lagi
            </button>
          </>
        )}
      </div>
    </SectionShell>
  );
}
