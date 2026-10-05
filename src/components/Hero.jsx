import { ChevronDown } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  HALO HOSHINO                                                       */
/*  Cincin luar & tengah TERPUTUS di sisi kiri-kanan, cincin dalam     */
/*  tebal berlubang, dan garis horizontal di tiap sisi.                */
/*  Gaya outline: tiap bentuk digambar 2x (garis tepi + isi terang).   */
/*  Warna dari variabel CSS (index.css):                               */
/*   - mode terang : mauve keabu-abuan                                 */
/*   - mode gelap  : halo putih berkontur pink bercahaya (seperti ref) */
/* ------------------------------------------------------------------ */

const CX = 170;
const CY = 110;

// Busur lingkaran. Sudut dalam derajat, 0 = kanan, 90 = atas (seperti matematika).
function arc(r, from, to) {
  const rad = (d) => (d * Math.PI) / 180;
  const x1 = CX + r * Math.cos(rad(from));
  const y1 = CY - r * Math.sin(rad(from));
  const x2 = CX + r * Math.cos(rad(to));
  const y2 = CY - r * Math.sin(rad(to));
  const large = Math.abs(from - to) > 180 ? 1 : 0;
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`;
}

// Cincin yang punya celah di kiri-kanan: busur atas + busur bawah
const SPLIT_RINGS = [
  { r: 84, width: 6, top: [166, 14], bottom: [-24, -156], delay: "0s" },
  { r: 64, width: 5, top: [160, 20], bottom: [-20, -160], delay: "0.35s" },
];

// [x1, x2, y, tebal] -> garis horizontal di sisi kiri & kanan
const WINGS = {
  left: [
    [14, 70, CY - 4, 5],
    [34, 62, CY + 16, 3.5],
  ],
  right: [
    [270, 326, CY - 4, 5],
    [278, 306, CY + 16, 3.5],
  ],
};

// Satu elemen digambar dua kali: kontur dulu, lalu isi di atasnya
function Outlined({ children }) {
  return (
    <>
      <g
        strokeLinecap="round"
        fill="none"
        style={{ stroke: "var(--halo-edge)" }}
      >
        {children(3.2)}
      </g>
      <g
        strokeLinecap="round"
        fill="none"
        style={{ stroke: "var(--halo-fill)" }}
      >
        {children(0)}
      </g>
    </>
  );
}

function HoshinoHalo() {
  return (
    <svg
      viewBox="0 20 340 180"
      aria-hidden="true"
      className="h-auto w-full overflow-visible"
      style={{ filter: "drop-shadow(0 0 14px var(--halo-glow))" }}
    >
      {/* Orbit tipis berputar pelan, kesan "energi" di sekitar halo */}
      <circle
        cx={CX}
        cy={CY}
        r="100"
        fill="none"
        strokeWidth="1.5"
        strokeDasharray="3 11"
        strokeLinecap="round"
        className="halo-orbit"
        opacity="0.7"
        style={{ stroke: "var(--halo-edge)" }}
      />

      {/* Cincin luar & tengah (terputus di sisi) */}
      {SPLIT_RINGS.map(({ r, width, top, bottom, delay }) => (
        <g key={r} className="halo-ring" style={{ animationDelay: delay }}>
          <Outlined>
            {(extra) => (
              <>
                <path d={arc(r, ...top)} strokeWidth={width + extra} />
                <path d={arc(r, ...bottom)} strokeWidth={width + extra} />
              </>
            )}
          </Outlined>
        </g>
      ))}

      {/* Cincin dalam: tebal, lalu lingkaran kecil berlubang di tengah */}
      <g className="halo-ring" style={{ animationDelay: "0.7s" }}>
        <Outlined>
          {(extra) => (
            <>
              <circle cx={CX} cy={CY} r="36" strokeWidth={14 + extra} />
              <circle cx={CX} cy={CY} r="17" strokeWidth={3 + extra} />
            </>
          )}
        </Outlined>
      </g>

      {/* Garis sayap kiri & kanan, bergerak berlawanan arah */}
      {["left", "right"].map((side) => (
        <g key={side} className={`halo-wing-${side}`}>
          <Outlined>
            {(extra) =>
              WINGS[side].map(([x1, x2, y, w]) => (
                <line
                  key={`${side}-${y}`}
                  x1={x1}
                  x2={x2}
                  y1={y}
                  y2={y}
                  strokeWidth={w + extra}
                />
              ))
            }
          </Outlined>
        </g>
      ))}
    </svg>
  );
}

/* Partikel kecil yang melayang naik di sekitar halo */
const SPARKS = [
  { left: "8%", top: "70%", size: 6, delay: "0s", dur: "5s" },
  { left: "22%", top: "85%", size: 4, delay: "1.2s", dur: "6s" },
  { left: "78%", top: "80%", size: 5, delay: "0.6s", dur: "5.5s" },
  { left: "92%", top: "65%", size: 4, delay: "2s", dur: "6.5s" },
  { left: "50%", top: "95%", size: 3, delay: "3s", dur: "7s" },
];

// Satu baris saja: semua kata ada di dalam satu array
const NAME_LINES = [
  [
    { text: "Awang", accent: false },
    { text: "Alfha", accent: true },
    { text: "Fairuz", accent: false },
    { text: "Amien", accent: false },
  ],
];

export default function Hero() {
  const handleExplore = () => {
    document.getElementById("terminal")?.scrollIntoView({ behavior: "smooth" });
  };

  let wordIndex = 0;

  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-6 pt-28 pb-10"
    >
      <style>{`
        /* ---------- Halo ---------- */
        .halo-ring {
          transform-box: view-box;
          transform-origin: ${CX}px ${CY}px;
          animation: halo-pulse 3.2s ease-in-out infinite;
        }
        .halo-orbit {
          transform-box: view-box;
          transform-origin: ${CX}px ${CY}px;
          animation: halo-spin 40s linear infinite;
        }
        .halo-wing-left  { animation: wing-left 3.2s ease-in-out infinite; animation-delay: 1s; }
        .halo-wing-right { animation: wing-right 3.2s ease-in-out infinite; animation-delay: 1s; }

        .halo-enter { animation: halo-in 1.2s cubic-bezier(.2,.8,.2,1) both; }
        .halo-float { animation: halo-float 7s ease-in-out infinite; }

        @keyframes halo-in {
          from { opacity: 0; transform: translate(-50%, -50%) scale(.55) rotate(-8deg); }
          to   { opacity: .8; transform: translate(-50%, -50%) scale(1) rotate(0); }
        }
        @keyframes halo-float {
          0%, 100% { transform: translateY(-6px); }
          50%      { transform: translateY(8px); }
        }
        @keyframes halo-pulse {
          0%, 100% { opacity: 1;   transform: scale(1); }
          50%      { opacity: .6;  transform: scale(1.035); }
        }
        @keyframes halo-spin { to { transform: rotate(360deg); } }
        @keyframes wing-left {
          0%, 100% { transform: translateX(0);   opacity: 1; }
          50%      { transform: translateX(-9px); opacity: .55; }
        }
        @keyframes wing-right {
          0%, 100% { transform: translateX(0);  opacity: 1; }
          50%      { transform: translateX(9px); opacity: .55; }
        }

        /* ---------- Langit malam (hanya mode gelap) ---------- */
        .night-stars, .night-stars::after {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-repeat: no-repeat;
        }
        .night-stars {
          background-image:
            radial-gradient(1.6px 1.6px at 8% 14%, #fff 50%, transparent 52%),
            radial-gradient(1.2px 1.2px at 21% 62%, #bae6fd 50%, transparent 52%),
            radial-gradient(1.8px 1.8px at 33% 28%, #fff 50%, transparent 52%),
            radial-gradient(1.2px 1.2px at 47% 80%, #fbcfe8 50%, transparent 52%),
            radial-gradient(1.6px 1.6px at 62% 18%, #fff 50%, transparent 52%),
            radial-gradient(1.2px 1.2px at 74% 70%, #bae6fd 50%, transparent 52%),
            radial-gradient(1.8px 1.8px at 88% 36%, #fff 50%, transparent 52%),
            radial-gradient(1.2px 1.2px at 94% 84%, #fbcfe8 50%, transparent 52%);
          animation: stars-twinkle 4s ease-in-out infinite alternate;
        }
        .night-stars::after {
          content: '';
          background-image:
            radial-gradient(1.4px 1.4px at 14% 40%, #fff 50%, transparent 52%),
            radial-gradient(1.8px 1.8px at 28% 90%, #fbcfe8 50%, transparent 52%),
            radial-gradient(1.2px 1.2px at 41% 12%, #bae6fd 50%, transparent 52%),
            radial-gradient(1.6px 1.6px at 56% 52%, #fff 50%, transparent 52%),
            radial-gradient(1.2px 1.2px at 69% 8%, #fff 50%, transparent 52%),
            radial-gradient(1.8px 1.8px at 81% 58%, #bae6fd 50%, transparent 52%),
            radial-gradient(1.4px 1.4px at 97% 20%, #fff 50%, transparent 52%);
          animation: stars-twinkle 5s ease-in-out 1.5s infinite alternate-reverse;
        }
        @keyframes stars-twinkle {
          from { opacity: .25; }
          to   { opacity: 1; }
        }

        /* ---------- Teks ---------- */
        .word-reveal {
          display: inline-block;
          opacity: 0;
          animation: word-up .8s cubic-bezier(.2,.8,.2,1) forwards;
        }
        @keyframes word-up {
          from { opacity: 0; transform: translateY(28px) skewY(4deg); filter: blur(6px); }
          to   { opacity: 1; transform: translateY(0) skewY(0);       filter: blur(0); }
        }
        .accent-shine {
          background: linear-gradient(100deg, #0ea5e9 20%, #7dd3fc 45%, #f9a8d4 55%, #0ea5e9 80%);
          background-size: 250% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: shine 4.5s ease-in-out infinite;
        }
        @keyframes shine {
          0%   { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        .badge-in { opacity: 0; animation: badge-in .7s ease-out 1.1s forwards; }
        .cta-in   { opacity: 0; animation: badge-in .7s ease-out 1.4s forwards; }
        @keyframes badge-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ---------- Tombol ---------- */
        .cta-btn { position: relative; overflow: hidden; }
        .cta-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          width: 40%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,.45), transparent);
          transform: translateX(-160%) skewX(-20deg);
          animation: cta-sheen 3.6s ease-in-out 2.2s infinite;
        }
        @keyframes cta-sheen {
          0%        { transform: translateX(-160%) skewX(-20deg); }
          40%, 100% { transform: translateX(380%)  skewX(-20deg); }
        }
        .cta-icon { animation: cta-bob 1.6s ease-in-out infinite; }
        @keyframes cta-bob {
          0%, 100% { transform: translateY(-2px); }
          50%      { transform: translateY(3px); }
        }

        /* ---------- Partikel ---------- */
        .spark {
          position: absolute;
          border-radius: 9999px;
          background: #f9a8d4;
          opacity: 0;
          animation: spark-rise linear infinite;
        }
        @keyframes spark-rise {
          0%   { opacity: 0;  transform: translateY(0) scale(.6); }
          20%  { opacity: .9; }
          100% { opacity: 0;  transform: translateY(-220px) scale(1.1); }
        }

        /* ---------- Aksesibilitas: hormati preferensi kurangi gerakan ---------- */
        @media (prefers-reduced-motion: reduce) {
          .halo-ring, .halo-orbit, .halo-wing-left, .halo-wing-right,
          .halo-float, .accent-shine, .cta-btn::after, .cta-icon, .spark,
          .night-stars, .night-stars::after {
            animation: none !important;
          }
          .halo-enter, .word-reveal, .badge-in, .cta-in {
            animation: none !important;
            opacity: 1 !important;
          }
          .halo-enter { opacity: .8 !important; transform: translate(-50%, -50%) !important; }
        }
      `}</style>

      {/* Dekorasi latar */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="night-stars hidden dark:block" />
        <div className="absolute -top-24 right-[12%] h-40 w-40 animate-bounce rounded-full bg-sky-100 [animation-duration:4s] dark:bg-sky-400/10" />
        <div className="absolute -bottom-16 left-[10%] h-32 w-32 animate-pulse rounded-full bg-pink-100 dark:bg-pink-400/10" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Nama + halo tepat di belakangnya */}
        <div className="relative px-4">
          {/* Halo: wrapper luar = animasi masuk, wrapper dalam = melayang */}
          <div
            aria-hidden="true"
            className="halo-enter pointer-events-none absolute top-1/2 left-1/2 w-[min(95vw,760px,100vh)]"
          >
            <div className="halo-float">
              <HoshinoHalo />
            </div>
          </div>

          {/* Nama satu baris. Ukuran mengikuti lebar layar supaya tidak pernah turun baris */}
          <h1 className="relative text-[clamp(1.05rem,4.4vw,3rem)] leading-tight font-black tracking-tight whitespace-nowrap text-ink uppercase">
            {NAME_LINES.map((line, li) => (
              <span key={li} className="block">
                {line.map(({ text, accent }) => {
                  const delay = `${0.25 + wordIndex++ * 0.18}s`;
                  return (
                    <span
                      key={text}
                      className="word-reveal mr-[0.25em] last:mr-0"
                      style={{ animationDelay: delay }}
                    >
                      <span className={accent ? "accent-shine" : undefined}>
                        {text}
                      </span>
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>

          {/* Partikel melayang */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            {SPARKS.map((s, i) => (
              <span
                key={i}
                className="spark"
                style={{
                  left: s.left,
                  top: s.top,
                  width: s.size,
                  height: s.size,
                  animationDelay: s.delay,
                  animationDuration: s.dur,
                }}
              />
            ))}
          </div>
        </div>

        <p className="badge-in relative mt-8 border-2 border-sky-500 bg-surface px-5 py-1.5 text-base font-bold text-sky-600 sm:text-xl dark:text-sky-300">
          Mahasiswa Informatika ITK
        </p>

        {/* Wrapper membawa glow, elemen dalam membawa clip-path */}
        <div className="cta-in relative mt-8 inline-block drop-shadow-[0_6px_14px_rgba(14,165,233,0.45)]">
          <button
            onClick={handleExplore}
            className="cta-btn clip-chamfered flex items-center gap-2 bg-sky-500 py-3.5 pr-11 pl-7 text-base font-bold text-white transition hover:bg-sky-600 focus-visible:-outline-offset-4 focus-visible:outline-4 focus-visible:outline-slate-800 sm:text-lg dark:focus-visible:outline-white"
          >
            Mulai Eksplorasi
            <ChevronDown size={22} className="cta-icon" />
          </button>
        </div>
      </div>
    </section>
  );
}
