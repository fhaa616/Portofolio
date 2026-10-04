// Sumber data skill tunggal: dipakai oleh GachaSkills dan perintah `skills` di Terminal.
// rarity: SSR | SR | Normal
// cat: Frontend | Bahasa | Backend | Database | Tools
export const SKILLS = [
  // ---- SSR: andalan utama ----
  { name: "Python", cat: "Bahasa", rarity: "SSR", desc: "Scripting, otomasi, dan olah data." },
  { name: "JavaScript", cat: "Bahasa", rarity: "SSR", desc: "React, Vite, dan web interaktif." },
  { name: "Laravel", cat: "Backend", rarity: "SSR", desc: "Backend PHP: routing, Eloquent, dan REST API." },
  { name: "Tailwind CSS", cat: "Frontend", rarity: "SSR", desc: "Styling utility-first untuk UI responsif." },

  // ---- SR: sering dipakai ----
  { name: "HTML", cat: "Frontend", rarity: "SR", desc: "Struktur halaman web yang rapi dan semantik." },
  { name: "CSS", cat: "Frontend", rarity: "SR", desc: "Layout, animasi, dan tampilan responsif." },
  { name: "Bootstrap", cat: "Frontend", rarity: "SR", desc: "Menyusun UI cepat dengan komponen siap pakai." },
  { name: "TypeScript", cat: "Bahasa", rarity: "SR", desc: "JavaScript dengan tipe data yang lebih aman." },
  { name: "Java", cat: "Bahasa", rarity: "SR", desc: "Pemrograman berorientasi objek." },
  { name: "PHP", cat: "Bahasa", rarity: "SR", desc: "Dasar pemrograman web sisi server." },
  { name: "Node.js", cat: "Backend", rarity: "SR", desc: "Menjalankan JavaScript di sisi server." },
  { name: "MySQL", cat: "Database", rarity: "SR", desc: "Basis data relasional: query dan desain tabel." },
  { name: "Git & GitHub", cat: "Tools", rarity: "SR", desc: "Version control dan kolaborasi kode." },
  { name: "Figma", cat: "Tools", rarity: "SR", desc: "Desain UI dan prototipe." },

  // ---- Normal: pernah dipakai ----
  { name: "React", cat: "Frontend", rarity: "Normal", desc: "Komponen, hooks, dan state." },
  { name: "Next.js", cat: "Frontend", rarity: "Normal", desc: "React dengan routing dan rendering di server." },
  { name: "Vite", cat: "Frontend", rarity: "Normal", desc: "Build tool cepat untuk proyek frontend." },
  { name: "PostgreSQL", cat: "Database", rarity: "Normal", desc: "Database relasional untuk aplikasi web." },
  { name: "MongoDB", cat: "Database", rarity: "Normal", desc: "Database NoSQL berbasis dokumen." },
  { name: "Firebase", cat: "Database", rarity: "Normal", desc: "Autentikasi dan database realtime." },
  { name: "Supabase", cat: "Database", rarity: "Normal", desc: "Backend siap pakai berbasis PostgreSQL." },
  { name: "REST API", cat: "Backend", rarity: "Normal", desc: "Merancang dan memakai endpoint HTTP." },
  { name: "Docker", cat: "Tools", rarity: "Normal", desc: "Container untuk menjalankan aplikasi." },
  { name: "Postman", cat: "Tools", rarity: "Normal", desc: "Menguji dan mendokumentasikan API." },
];

const RARITY_ORDER = { SSR: 0, SR: 1, Normal: 2 };

// Urut dari rarity tertinggi (sort stabil, urutan di dalam rarity tetap)
export const SORTED_SKILLS = [...SKILLS].sort(
  (a, b) => RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity],
);

export const SKILL_COUNTS = SKILLS.reduce(
  (acc, s) => ({ ...acc, [s.rarity]: (acc[s.rarity] ?? 0) + 1 }),
  {},
);

// ---------- Ikon dari src/assets ----------
// Semua gambar di src/assets (termasuk subfolder) dipindai otomatis.
// Ikon dicocokkan lewat NAMA FILE, mis. python.svg, tailwind-css.png, nodejs.webp.
const ICON_FILES = import.meta.glob("../assets/**/*.{png,jpg,jpeg,webp,svg,gif}", {
  eager: true,
  import: "default",
});

const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const ICONS = Object.fromEntries(
  Object.entries(ICON_FILES).map(([path, url]) => {
    const file = path.split("/").pop().replace(/\.[^.]+$/, "");
    return [normalize(file).replace(/(logo|icon)$/, ""), url];
  }),
);

// Nama file alternatif yang juga dianggap cocok
const ALT_KEYS = {
  JavaScript: ["js"],
  TypeScript: ["ts"],
  "Tailwind CSS": ["tailwind"],
  HTML: ["html5"],
  CSS: ["css3"],
  "Node.js": ["node"],
  "Next.js": ["next"],
  PostgreSQL: ["postgres"],
  MongoDB: ["mongo"],
  "Git & GitHub": ["github", "git"],
  "REST API": ["api", "rest"],
};

export function getSkillIcon(skill) {
  const keys = [normalize(skill.name), ...(ALT_KEYS[skill.name] ?? [])];
  for (const k of keys) if (ICONS[k]) return ICONS[k];
  return null;
}