import { useEffect, useRef, useState } from "react";
import { Mail, Star, RotateCcw, ChevronDown, ChevronUp, X } from "lucide-react";
import SectionShell from "./SectionShell";
import { SKILLS, SORTED_SKILLS, SKILL_COUNTS as COUNTS } from "./Skills";

// Skill yang tampil lebih dulu. Sisanya muncul lewat tombol "Lihat semua".
// Ubah daftar nama ini (harus sama persis dengan nama di Skills.jsx) untuk mengatur pilihanmu.
const FEATURED = new Set([
  "Python",
  "JavaScript",
  "Laravel",
  "Tailwind CSS",
  "HTML",
  "CSS",
  "TypeScript",
  "PHP",
  "Node.js",
  "MySQL",
  "Git & GitHub",
  "Figma",
]);
const FEATURED_SKILLS = SORTED_SKILLS.filter((s) => FEATURED.has(s.name));

const RARITY_STYLE = {
  SSR: {
    stars: 3,
    label: "Andalan utama",
    glow: "drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]",
    chipGlow: "drop-shadow-[0_0_7px_rgba(244,114,182,0.65)]",
    border: "border-pink-400",
    badge: "bg-pink-400 text-white",
    star: "fill-pink-400 text-pink-400",
  },
  SR: {
    stars: 2,
    label: "Sering dipakai",
    glow: "drop-shadow-[0_0_12px_rgba(251,191,36,0.75)]",
    chipGlow: "drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]",
    border: "border-amber-400",
    badge: "bg-amber-400 text-white",
    star: "fill-amber-400 text-amber-400",
  },
  Normal: {
    stars: 1,
    label: "Pernah dipakai",
    glow: "drop-shadow-[0_0_12px_rgba(14,165,233,0.65)]",
    chipGlow: "drop-shadow-[0_0_6px_rgba(14,165,233,0.55)]",
    border: "border-sky-400",
    badge: "bg-sky-500 text-white",
    star: "fill-sky-400 text-sky-400",
  },
};

const FILTERS = ["Semua", "Frontend", "Bahasa", "Backend", "Database", "Tools"];

// Sudut miring kecil untuk kartu mungil
const CHAMFER_SM = {
  clipPath:
    "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
};

function Stars({ count, className, size }) {
  return (
    <div className="flex gap-0.5" role="img" aria-label={`${count} bintang`}>
      {Array.from({ length: count }).map((_, n) => (
        <Star key={n} size={size} className={className} />
      ))}
    </div>
  );
}

export default function GachaSkills() {
  // 'idle' | 'shaking' | 'revealed'
  const [phase, setPhase] = useState("idle");
  const [filter, setFilter] = useState("Semua");
  const [showAll, setShowAll] = useState(false);
  const [selected, setSelected] = useState(null);
  const topRef = useRef(null);
  const closeRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (phase !== "shaking") return;
    const timer = setTimeout(() => setPhase("revealed"), 1500);
    return () => clearTimeout(timer);
  }, [phase]);

  // Dialog detail: fokus ke tombol tutup, Esc menutup, fokus kembali ke kartu
  useEffect(() => {
    if (!selected) return;
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && closeDetail();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const openDetail = (skill) => {
    triggerRef.current = document.activeElement;
    setSelected(skill);
  };
  const closeDetail = () => {
    setSelected(null);
    triggerRef.current?.focus?.();
  };

  // Filter kategori menampilkan semua skill di kategori itu; "Semua" mengikuti tombol lihat semua
  const visible =
    filter !== "Semua"
      ? SORTED_SKILLS.filter((s) => s.cat === filter)
      : showAll
        ? SORTED_SKILLS
        : FEATURED_SKILLS;

  const hiddenCount = SKILLS.length - FEATURED_SKILLS.length;

  const toggleShowAll = () => {
    const collapsing = showAll;
    setShowAll((v) => !v);
    if (collapsing) {
      requestAnimationFrame(() =>
        topRef.current?.scrollIntoView({ block: "start", behavior: "smooth" }),
      );
    }
  };

  const reset = () => {
    setPhase("idle");
    setFilter("Semua");
    setShowAll(false);
    setSelected(null);
    // Setelah konten memendek, kembalikan tampilan ke awal section Gacha
    requestAnimationFrame(() => {
      document
        .getElementById("skills")
        ?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  };

  const sel = selected ? RARITY_STYLE[selected.rarity] : null;

  return (
    <SectionShell id="skills" title="GACHA KEAHLIAN">
      <div className="flex min-h-96 flex-col items-center justify-center">
        <p className="mb-6 text-center text-muted">
          {phase === "revealed"
            ? `Selamat, Sensei! Kamu mendapat ${SKILLS.length} skill. Ketuk kartu untuk melihat detailnya.`
            : "Klik amplop untuk membuka skill saya."}
        </p>

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
          <div
            ref={topRef}
            className="flex w-full scroll-mt-24 flex-col items-center"
          >
            {/* Ringkasan rarity */}
            <ul className="mb-5 flex flex-wrap justify-center gap-2 text-xs font-bold sm:gap-3 sm:text-sm">
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

            {/* Filter kategori: satu baris yang bisa digeser di HP */}
            <div
              role="group"
              aria-label="Filter kategori skill"
              className="-mx-6 mb-6 flex w-[calc(100%+3rem)] gap-2 overflow-x-auto px-6 pb-1 [scrollbar-none] sm:mx-0 sm:w-full sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className={`shrink-0 rounded-full border-2 border-sky-500 px-4 py-1 text-sm font-semibold whitespace-nowrap transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
                    filter === f
                      ? "bg-sky-500 text-white"
                      : "bg-surface text-sky-500 hover:bg-panel"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Kartu mungil */}
            <ul className="grid w-full max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {visible.map((skill, i) => {
                const s = RARITY_STYLE[skill.rarity];
                return (
                  <li
                    key={skill.name}
                    className={`animate-pop-in ${s.chipGlow}`}
                    style={{ animationDelay: `${Math.min(i * 45, 600)}ms` }}
                  >
                    <button
                      type="button"
                      onClick={() => openDetail(skill)}
                      style={CHAMFER_SM}
                      aria-label={`${skill.name}, ${skill.rarity}, ${s.stars} bintang. Ketuk untuk detail`}
                      title={skill.desc}
                      className={`flex h-full w-full flex-col gap-1 border-2 bg-surface p-2.5 text-left transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-sky-400 active:scale-[0.97] ${s.border}`}
                    >
                      <span className="flex items-center justify-between gap-1">
                        <span
                          className={`px-1.5 py-px text-[11px] font-bold ${s.badge}`}
                        >
                          {skill.rarity}
                        </span>
                        <Stars count={s.stars} size={12} className={s.star} />
                      </span>
                      <span className="truncate text-sm leading-tight font-extrabold text-ink sm:text-base">
                        {skill.name}
                      </span>
                      <span className="text-[10px] font-bold tracking-wide text-faint uppercase">
                        {skill.cat}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Lihat semua / lebih sedikit (hanya saat filter "Semua") */}
            {filter === "Semua" && hiddenCount > 0 && (
              <button
                type="button"
                onClick={toggleShowAll}
                aria-expanded={showAll}
                className="mt-6 flex items-center gap-2 rounded-full border-2 border-sky-500 bg-surface px-6 py-2 text-sm font-semibold text-sky-500 transition hover:bg-sky-500 hover:text-white"
              >
                {showAll ? (
                  <>
                    <ChevronUp size={18} /> Tampilkan lebih sedikit
                  </>
                ) : (
                  <>
                    <ChevronDown size={18} /> Lihat semua ({SKILLS.length})
                  </>
                )}
              </button>
            )}

            <button
              onClick={reset}
              className="mt-8 flex items-center gap-2 rounded-full border-2 border-pink-400 bg-surface px-6 py-2 font-semibold text-pink-500 transition hover:bg-pink-400 hover:text-white"
            >
              <RotateCcw size={18} />
              Gacha Lagi
            </button>
          </div>
        )}
      </div>

      {/* Detail kartu */}
      {selected && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Detail skill ${selected.name}`}
        >
          <button
            type="button"
            tabIndex={-1}
            aria-label="Tutup detail"
            onClick={closeDetail}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <div
            className={`animate-pop-in relative w-full max-w-sm ${sel.glow}`}
          >
            <div
              className={`clip-chamfered flex flex-col gap-3 border-4 bg-surface p-6 pb-8 ${sel.border}`}
            >
              <div className="flex items-center justify-between">
                <span className={`px-3 py-0.5 text-sm font-bold ${sel.badge}`}>
                  {selected.rarity}
                </span>
                <Stars count={sel.stars} size={20} className={sel.star} />
              </div>
              <h3 className="text-3xl font-extrabold text-ink">
                {selected.name}
              </h3>
              <p className="text-xs font-bold tracking-wide text-faint uppercase">
                {selected.cat} · {sel.label}
              </p>
              <p className="text-base text-muted">{selected.desc}</p>
              <button
                ref={closeRef}
                type="button"
                onClick={closeDetail}
                className="mt-2 flex items-center justify-center gap-2 bg-sky-500 px-4 py-2 font-bold text-white transition hover:bg-sky-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
              >
                <X size={18} />
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </SectionShell>
  );
}
