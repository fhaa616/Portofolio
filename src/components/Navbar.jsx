import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import NameTag from "./NameTag";
import ThemeToggle from "./ThemeToggle";

// Warna per menu mengikuti palet Hoshino: pink, biru, oranye
const NAV = [
  { id: "hero", label: "HOME", tone: "pink" },
  { id: "terminal", label: "TENTANG", tone: "sky" },
  { id: "skills", label: "KEAHLIAN", tone: "orange" },
  { id: "certificates", label: "SERTIFIKAT", tone: "pink" },
  { id: "contact", label: "KONTAK", tone: "sky" },
];

const TONE = {
  pink: {
    hover: "hover:bg-pink-400 hover:drop-shadow-[0_0_10px_rgba(244,114,182,0.8)]",
    on: "bg-pink-400",
  },
  sky: {
    hover: "hover:bg-sky-400 hover:drop-shadow-[0_0_10px_rgba(56,189,248,0.8)]",
    on: "bg-sky-400",
  },
  orange: {
    hover: "hover:bg-orange-400 hover:drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]",
    on: "bg-orange-400",
  },
};

export default function Navbar() {
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);
  const progressRef = useRef(null);

  // Garis progres scroll di dasar navbar (diubah langsung lewat ref, tanpa render ulang)
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${p})`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Menu yang aktif = section yang sedang melewati tengah layar
  useEffect(() => {
    const els = NAV.map((n) => document.getElementById(n.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Tutup menu HP dengan tombol Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const goTo = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const linkClass = (item) => {
    const isActive = active === item.id;
    return `block px-4 py-2 text-sm font-extrabold tracking-wide transition hover:-translate-y-0.5 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
      TONE[item.tone].hover
    } ${isActive ? `${TONE[item.tone].on} text-slate-900` : "text-ink-soft"}`;
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b-4 border-sky-400 bg-surface/90 shadow-[0_4px_14px_rgba(14,165,233,0.25)] backdrop-blur dark:shadow-[0_4px_22px_rgba(56,189,248,0.3)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        {/* Name tag */}
        <button
          type="button"
          onClick={() => goTo("hero")}
          aria-label="Kembali ke atas"
          className="transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-400"
        >
          <NameTag />
        </button>

        {/* Menu desktop */}
        <nav aria-label="Menu utama" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? "true" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(item.id);
                  }}
                  className={linkClass(item)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Tombol tema + hamburger (HP) */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            className="flex h-10 w-10 items-center justify-center border-2 border-sky-400 text-sky-500 transition hover:bg-sky-400 hover:text-slate-900 md:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menu HP */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t-2 border-line bg-surface px-6 py-4 md:hidden"
        >
          <ul className="flex flex-col gap-2">
            {NAV.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? "true" : undefined}
                  onClick={(e) => {
                    e.preventDefault();
                    goTo(item.id);
                  }}
                  className={linkClass(item)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Progres scroll */}
      <div
        ref={progressRef}
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-1 h-1 origin-left bg-pink-400"
        style={{ transform: "scaleX(0)" }}
      />
    </header>
  );
}