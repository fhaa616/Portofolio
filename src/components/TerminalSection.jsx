import { Fragment, useEffect, useRef, useState } from "react";
import {
  Terminal,
  File,
  Folder,
  Gift,
  Trash2,
  Minus,
  Square,
  X,
  Star,
  Mail,
  MessageCircle,
} from "lucide-react";
import SectionShell from "./SectionShell";
import { SKILLS, SORTED_SKILLS } from "./Skills";
import hoshinoAvatar from "../assets/fotoku.jpeg";

const PATH = "C:\\Users\\Alfha";
const EMAIL = "alfhafairuz08@gmail.com";
const LOCATION = "Balikpapan";

// Perangkat sentuh (HP/tablet): jangan paksa keyboard muncul
const isTouch = () => window.matchMedia("(pointer: coarse)").matches;

// ---------- Konten ----------
const FILES = {
  "about.txt": [
    "Halo! Aku Awang Alfha Fairuz Amien, kalian bisa panggil aku Alfha atau Fhaa, mahasiswa Prodi Informatika Institut Teknologi Kalimantan.",
    "Suka membangun web interaktif dengan React, Vite, dan Tailwind CSS.",
    "Portofolio ini terinspirasi dari UI game bertema Blue Archive.",
  ],
  "skills.txt": [
    "Skill            Rarity    Keterangan",
    "-----            ------    ----------",
    "Python           SSR       Scripting, otomasi, dan olah data",
    "JavaScript       SSR       React, Vite, dan web interaktif",
    "C++              Normal    Struktur data dan algoritma",
  ],
  "education.txt": [
    "Riwayat Pendidikan:",
    "-------------------",
    "[ 2026 - Sekarang ] Mahasiswa Program Studi Informatika",
    "                    Institut Teknologi Kalimantan (ITK), Balikpapan",
    "",
    "[ 2023 - 2026     ] Sekolah Menengah Kejuruan (SMK)",
    "                    Jurusan [Pengambangan Perangkat Lunak dan Gim], [SMKN 7 Samarinda]",
  ],
  "projects.txt": [
    "[1] Portofolio interaktif  (React, Vite, Tailwind CSS, lucide-react)",
    "[2] Proyek berikutnya      (segera hadir)",
  ],
  "contact.txt": [
    "Kirim pesan lewat MomoTalk di bagian paling bawah halaman ini.",
    "Fhaa akan membalas ke emailmu.",
  ],
};

const HELP_ITEMS = [
  ["help", "Tampilkan daftar perintah"],
  ["whoami", "Tampilkan identitas pemilik portofolio"],
  ["about", "Tentang Saya"],
  ["skills", "Daftar keahlian beserta rarity-nya"],
  ["education", "Riwayat pendidikan"],
  ["projects", "Daftar proyek"],
  ["contact", "Cara menghubungi Saya"],
  ["ls", "Daftar file di folder portofolio"],
  ["cat <file>", "Baca isi file, contoh: cat about.txt"],
  ["echo <teks>", "Cetak teks ke layar"],
  ["date", "Tampilkan tanggal dan waktu sekarang"],
  ["gacha", "Tarik satu skill secara acak"],
  ["clear", "Bersihkan layar terminal"],
];

// Alias gaya PowerShell -> command utama
const ALIASES = {
  "get-help": "help",
  "get-date": "date",
  "clear-host": "clear",
  cls: "clear",
  dir: "ls",
  "get-childitem": "ls",
  type: "cat",
  "get-content": "cat",
  "write-host": "echo",
  "write-output": "echo",
};

// Jumlah bintang per rarity. SAMA dengan GachaSkills (SSR 3, SR 2, Normal 1),
// dipakai oleh perintah `gacha` dan kartu `skills`.
const RARITY_STARS = { SSR: 3, SR: 2, Normal: 1 };

const GACHA_POOL = SKILLS.map(({ name, rarity }) => ({
  name,
  rarity,
  stars: RARITY_STARS[rarity],
}));

const WELCOME = [
  "Windows PowerShell",
  "Copyright (C) Alfha OS Corporation. All rights reserved.",
  "",
  "Uhe~ Selamat datang di Alfha OS v1.0-LTS (React desktop environment).",
  " * Ketik 'help' untuk daftar perintah simulasi interaktif.",
  " * Atau gunakan tombol di sebelah kiri dan chip di bawah untuk jalan pintas cepat.",
];

const CHIPS = [
  "help",
  "whoami",
  "about",
  "skills",
  "education",
  "projects",
  "contact",
  "ls",
  "gacha",
];

const SIDEBAR = [
  {
    key: "terminal",
    label: "Fokus ke terminal",
    Icon: Terminal,
    style: "bg-sky-500 text-white",
  },
  {
    key: "about",
    label: "Jalankan about",
    Icon: File,
    style: "bg-pink-400 text-white",
  },
  {
    key: "ls",
    label: "Jalankan ls",
    Icon: Folder,
    style: "bg-white text-sky-500",
  },
  {
    key: "gacha",
    label: "Jalankan gacha",
    Icon: Gift,
    style: "bg-sky-100 text-sky-600",
  },
  {
    key: "clear",
    label: "Bersihkan layar (clear)",
    Icon: Trash2,
    style: "bg-pink-100 text-pink-500",
  },
];

// ---------- Data & komponen kartu (output berupa JSX) ----------
const BRUTAL =
  "border-4 border-black bg-white text-slate-900 shadow-[6px_6px_0_0_#000]";

const ABOUT_ROWS = [
  ["OS", "Alfha OS LTS"],
  ["Host", "Alfha"],
  ["Role", "Frontend Developer"],
  ["Education", "Mahasiswa Informatika ITK"],
  ["Location", LOCATION],
];

// Warna lencana rarity pada kartu `skills`
const TERMINAL_BADGE = {
  SSR: "bg-pink-400 text-white",
  SR: "bg-amber-400 text-slate-900",
  Normal: "bg-sky-400 text-white",
};

function AboutCard() {
  return (
    <div className={`${BRUTAL} my-2 p-4`}>
      <div className="flex flex-col gap-4 sm:flex-row">
        <img
          src={hoshinoAvatar}
          alt="Takanashi Hoshino"
          className="h-24 w-24 shrink-0 border-2 border-black object-cover sm:h-32 sm:w-32"
        />
        <dl className="grid flex-1 grid-cols-[auto_1fr] content-start gap-x-3 gap-y-1 text-sm">
          {ABOUT_ROWS.map(([key, value]) => (
            <Fragment key={key}>
              <dt className="font-extrabold text-pink-500">{key}:</dt>
              <dd className="font-bold">{value}</dd>
            </Fragment>
          ))}
        </dl>
      </div>
      <p className="mt-4 border-t-4 border-black pt-3 text-sm font-bold">
        "Uhe~ Selamat datang, Sensei! Aku Awang Alfha Fairuz Amien, mahasiswa
        Informatika ITK yang punya passion besar di dunia frontend
        development—plus sedikit racikan backend tipis-tipis di balik layar biar
        aplikasinya tidak cuma cantik, tapi juga berfungsi maksimal. Aku sangat
        menikmati proses menerjemahkan ide-ide out-of-the-box menjadi antarmuka
        web yang interaktif, dinamis, dan nyaman dilihat mata. Kode yang baik
        itu seperti taktik yang rapi! Silakan jelajahi terminal ini—ketik
        'skills' untuk melihat tech stack andalanku, atau 'contact' untuk
        berkolaborasi dalam proyek seru selanjutnya."
      </p>
    </div>
  );
}

// Kartu skill: tanpa logo, bintang mengikuti rarity (sama dengan GachaSkills)
function SkillsCard() {
  return (
    <div className="my-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {SORTED_SKILLS.map((skill) => {
        const stars = RARITY_STARS[skill.rarity];
        return (
          <div
            key={skill.name}
            className="flex flex-col gap-1 border-4 border-black bg-white p-2.5 text-slate-900 shadow-[4px_4px_0_0_#000]"
          >
            <div className="flex items-center justify-between gap-1">
              <span
                className={`border-2 border-black px-1.5 text-xs font-extrabold ${TERMINAL_BADGE[skill.rarity]}`}
              >
                {skill.rarity}
              </span>
              <div
                className="flex gap-0.5"
                role="img"
                aria-label={`${stars} bintang`}
              >
                {Array.from({ length: stars }).map((_, n) => (
                  <Star
                    key={n}
                    size={14}
                    strokeWidth={2.5}
                    className="fill-yellow-300 text-black"
                  />
                ))}
              </div>
            </div>
            <p className="text-base leading-tight font-black">{skill.name}</p>
            <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">
              {skill.cat}
            </p>
          </div>
        );
      })}
    </div>
  );
}

const BUTTON_BRUTAL =
  "flex items-center justify-center gap-2 border-4 border-black px-4 py-2 text-sm font-extrabold text-slate-900 shadow-[4px_4px_0_0_#000] transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:translate-x-1 active:translate-y-1";

function ContactCard() {
  const goToMomoTalk = (e) => {
    e.stopPropagation(); // supaya klik tidak memindahkan fokus kembali ke input terminal
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={`${BRUTAL} my-2 p-4`}>
      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
        <dt className="font-extrabold text-pink-500">Location:</dt>
        <dd className="font-bold">{LOCATION}</dd>
        <dt className="font-extrabold text-pink-500">Email:</dt>
        <dd className="font-bold break-all">{EMAIL}</dd>
      </dl>
      <div className="mt-4 flex flex-col gap-3 border-t-4 border-black pt-4 sm:flex-row">
        <a
          href={`mailto:${EMAIL}`}
          onClick={(e) => e.stopPropagation()}
          className={`${BUTTON_BRUTAL} bg-sky-400`}
        >
          <Mail size={18} strokeWidth={2.5} />
          Kirim Email
        </a>
        <button
          type="button"
          onClick={goToMomoTalk}
          className={`${BUTTON_BRUTAL} bg-pink-400`}
        >
          <MessageCircle size={18} strokeWidth={2.5} />
          MomoTalk
        </button>
      </div>
    </div>
  );
}

// ---------- Interpreter ----------
// Mengembalikan { output: (string | JSX)[], error?: boolean } atau { clear: true }
function execute(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return { output: [] };

  const [name, ...args] = trimmed.split(/\s+/);
  const lower = name.toLowerCase();
  const cmd = ALIASES[lower] ?? lower;

  switch (cmd) {
    case "clear":
      return { clear: true };
    case "help":
      return {
        output: [
          "Daftar perintah yang tersedia:",
          "",
          ...HELP_ITEMS.map(([n, d]) => `  ${n.padEnd(14)}${d}`),
        ],
      };
    case "whoami":
      return {
        output: [
          "Alfha, Mahasiswa Informatika Institut, Teknologi Kalimantan.",
        ],
      };
    case "about":
      return { output: [<AboutCard />] };
    case "skills":
      return { output: [<SkillsCard />] };
    case "contact":
      return { output: [<ContactCard />] };
    case "education":
    case "projects":
      return { output: FILES[`${cmd}.txt`] };
    case "ls":
      return {
        output: [
          `    Directory: ${PATH}\\Portofolio`,
          "",
          "Mode     Name",
          "----     ----",
          ...Object.keys(FILES).map((f) => `-a---    ${f}`),
        ],
      };
    case "cat": {
      if (args.length === 0) {
        return {
          output: ["cat : Nama file belum diisi. Contoh: cat about.txt"],
          error: true,
        };
      }
      const fileName = args[0].toLowerCase().endsWith(".txt")
        ? args[0].toLowerCase()
        : `${args[0].toLowerCase()}.txt`;
      if (!FILES[fileName]) {
        return {
          output: [
            `cat : Cannot find path '${PATH}\\Portofolio\\${args[0]}' because it does not exist.`,
          ],
          error: true,
        };
      }
      return { output: FILES[fileName] };
    }
    case "echo":
      return { output: [args.join(" ")] };
    case "date":
      return {
        output: [
          new Date().toLocaleString("id-ID", {
            dateStyle: "full",
            timeStyle: "medium",
          }),
        ],
      };
    case "gacha": {
      const pick = GACHA_POOL[Math.floor(Math.random() * GACHA_POOL.length)];
      return {
        output: [
          "Membuka amplop...",
          `${"★".repeat(pick.stars)}  [${pick.rarity}] ${pick.name}`,
          pick.rarity === "SSR"
            ? "Wah, SSR! Beruntung sekali, Sensei!"
            : pick.rarity === "SR"
              ? "Lumayan, SR! Skill yang sering dipakai Alfha."
              : "Normal, tapi tetap andalan!",
        ],
      };
    }
    default:
      return {
        output: [
          `${name} : The term '${name}' is not recognized as the name of a cmdlet, function, script file, or operable program.`,
          "Ketik 'help' untuk melihat daftar perintah.",
        ],
        error: true,
      };
  }
}

// ---------- Tampilan kecil ----------
// Di HP path disingkat jadi "PS>" supaya ruang ketik tidak habis
function Prompt() {
  return (
    <span className="whitespace-pre">
      <span className="font-bold text-sky-300">PS </span>
      <span className="text-slate-100">
        <span className="hidden sm:inline">{PATH}</span>&gt;{" "}
      </span>
    </span>
  );
}

function CommandText({ text }) {
  const [first, ...rest] = text.split(" ");
  return (
    <>
      <span className="text-yellow-300">{first}</span>
      {rest.length > 0 && (
        <span className="text-slate-100"> {rest.join(" ")}</span>
      )}
    </>
  );
}

// ---------- Komponen utama ----------
export default function TerminalSection() {
  // Setiap entri: { id, command, output: (string | JSX)[], error?: boolean }
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const lastEntryRef = useRef(null);
  const cmdHistoryRef = useRef([]); // untuk navigasi panah atas/bawah
  const cmdIndexRef = useRef(0);

  // Setelah command dijalankan:
  // - output pendek  -> gulir ke bawah (baris prompt terlihat)
  // - output panjang -> gulir ke AWAL output (mis. `skills` dibaca dari atas)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const last = lastEntryRef.current;

    if (!last) {
      el.scrollTo({ top: 0 });
      return;
    }

    const top =
      last.getBoundingClientRect().top -
      el.getBoundingClientRect().top +
      el.scrollTop;
    const isTall = last.offsetHeight + 80 > el.clientHeight;
    el.scrollTo({
      top: isTall ? Math.max(top - 8, 0) : el.scrollHeight,
      behavior: "smooth",
    });
  }, [history]);

  const runCommand = (raw) => {
    const result = execute(raw);

    if (raw.trim()) {
      cmdHistoryRef.current.push(raw);
    }
    cmdIndexRef.current = cmdHistoryRef.current.length;

    if (result.clear) {
      setHistory([]);
      return;
    }
    setHistory((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        command: raw,
        output: result.output,
        error: result.error,
      },
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    runCommand(input);
    setInput("");
    // Di HP: tutup keyboard setelah Enter supaya output terlihat penuh
    if (isTouch()) inputRef.current?.blur();
  };

  // Panah atas/bawah: menelusuri command sebelumnya
  const handleKeyDown = (e) => {
    const list = cmdHistoryRef.current;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdIndexRef.current > 0) {
        cmdIndexRef.current -= 1;
        setInput(list[cmdIndexRef.current]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cmdIndexRef.current < list.length - 1) {
        cmdIndexRef.current += 1;
        setInput(list[cmdIndexRef.current]);
      } else {
        cmdIndexRef.current = list.length;
        setInput("");
      }
    }
  };

  const handleShortcut = (cmd) => {
    if (cmd === "terminal") {
      inputRef.current?.focus();
      return;
    }
    runCommand(cmd);
    // Di desktop fokus kembali ke input; di HP biarkan keyboard tertutup
    if (!isTouch()) inputRef.current?.focus();
  };

  return (
    <SectionShell id="terminal" title="TENTANG SAYA" fit>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        {/* Navigasi cepat: baris di HP, kolom di layar lebar */}
        <nav
          aria-label="Navigasi cepat terminal"
          className="flex flex-row justify-center gap-2 sm:flex-col sm:justify-start sm:gap-3"
        >
          {SIDEBAR.map(({ key, label, Icon, style }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleShortcut(key)}
              aria-label={label}
              title={label}
              className={`flex h-11 w-11 items-center justify-center border-2 border-sky-500 drop-shadow-[0_0_8px_rgba(14,165,233,0.45)] transition hover:scale-110 hover:drop-shadow-[0_0_12px_rgba(244,114,182,0.8)] active:scale-95 sm:h-14 sm:w-14 ${style}`}
            >
              <Icon size={22} strokeWidth={2.5} />
            </button>
          ))}
        </nav>

        <div className="min-w-0 flex-1">
          {/* Jendela PowerShell */}
          <div className="drop-shadow-[0_8px_20px_rgba(14,165,233,0.35)]">
            <div className="clip-chamfered overflow-hidden border-4 border-sky-400 bg-[#012456]">
              {/* Title bar */}
              <div className="flex items-center justify-between bg-sky-500 px-3 py-2 text-white">
                <div className="flex min-w-0 items-center gap-2">
                  <Terminal size={16} />
                  <p className="truncate font-mono text-xs font-bold sm:text-sm">
                    Windows PowerShell - Alfha@Portofolio
                  </p>
                </div>
                <div className="flex gap-3" aria-hidden="true">
                  <Minus size={16} />
                  <Square size={14} />
                  <X size={16} />
                </div>
              </div>

              {/* Isi terminal. Tinggi mengikuti tinggi layar agar tidak kepotong */}
              <div
                ref={scrollRef}
                onClick={() => {
                  if (!isTouch()) inputRef.current?.focus();
                }}
                className="h-[min(28rem,55vh)] min-h-72 cursor-text overflow-y-auto p-3 pb-8 font-mono text-xs text-slate-100 sm:p-4 sm:pb-8 sm:text-base"
              >
                {/* Pesan sambutan statis */}
                <div className="mb-4 text-slate-200">
                  {WELCOME.map((line, i) => (
                    <p
                      key={i}
                      className="min-h-[1.5em] whitespace-pre-wrap wrap-break-word"
                    >
                      {line}
                    </p>
                  ))}
                </div>

                {/* Riwayat command */}
                {history.map((entry, idx) => (
                  <div
                    key={entry.id}
                    ref={idx === history.length - 1 ? lastEntryRef : null}
                    className="mb-3"
                  >
                    <p className="wrap-break-word">
                      <Prompt />
                      <CommandText text={entry.command} />
                    </p>
                    {entry.output.map((line, i) =>
                      typeof line === "string" ? (
                        <p
                          key={i}
                          className={`min-h-[1.5em] whitespace-pre-wrap wrap-break-word ${
                            entry.error ? "text-red-400" : "text-slate-100"
                          }`}
                        >
                          {line}
                        </p>
                      ) : (
                        // Output JSX (kartu): render langsung
                        <Fragment key={i}>{line}</Fragment>
                      ),
                    )}
                  </div>
                ))}

                {/* Baris input aktif */}
                <form onSubmit={handleSubmit} className="flex items-baseline">
                  <label htmlFor="terminal-input">
                    <Prompt />
                  </label>
                  {/* text-base (16px) mencegah iPhone memperbesar halaman saat input difokus */}
                  <input
                    id="terminal-input"
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    enterKeyHint="go"
                    autoComplete="off"
                    autoCapitalize="off"
                    autoCorrect="off"
                    spellCheck={false}
                    className="min-w-0 flex-1 bg-transparent text-base text-yellow-300 caret-white outline-hidden"
                  />
                </form>
              </div>
            </div>
          </div>

          {/* Chip perintah cepat */}
          <div className="mt-4 flex flex-wrap gap-2">
            {CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => handleShortcut(c)}
                className="rounded-full border-2 border-sky-500 bg-white px-3 py-0.5 font-mono text-xs font-semibold text-sky-600 transition hover:bg-sky-500 hover:text-white sm:px-4 sm:py-1 sm:text-sm"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
