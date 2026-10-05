import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Mail,
  Phone,
  Send,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { FaInstagram, FaDiscord, FaSteam } from "react-icons/fa";
import SectionShell from "./SectionShell";

const EMAIL = "alfhafairuz08@gmail.com";

// Access key Web3Forms (gratis di https://web3forms.com). Disimpan di file .env.local:
//   VITE_WEB3FORMS_KEY=kunci-kamu
// Kalau kosong, tombol Kirim membuka aplikasi email sebagai cadangan.
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;
const WEB3FORMS_URL = "https://api.web3forms.com/submit";

const CONTACTS = [
  {
    Icon: MapPin,
    label: "Lokasi",
    value: "Samarinda, Indonesia",
    href: null,
    color: "bg-sky-500",
  },
  {
    Icon: Mail,
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
    color: "bg-pink-400",
  },
  {
    Icon: Phone,
    label: "Telepon",
    value: "+62 82254334950",
    href: "tel:+6282254334950",
    color: "bg-sky-500",
  },
];

// Media sosial. Item dengan `href` membuka tautan,
// item dengan `copy` menyalin teksnya ke clipboard (Discord tidak punya link DM langsung).
const SOCIALS = [
  {
    id: "instagram",
    Icon: FaInstagram,
    label: "Instagram",
    handle: "@fhaa_turu",
    href: "https://instagram.com/fhaa_turu",
    color: "bg-pink-400",
    hover: "hover:border-pink-400",
  },
  {
    id: "discord",
    Icon: FaDiscord,
    label: "Discord",
    handle: "alfhaaaaaa",
    copy: "alfhaaaaaa",
    color: "bg-violet-500",
    hover: "hover:border-violet-400",
  },
  {
    id: "steam",
    Icon: FaSteam,
    label: "Steam",
    handle: "Keyshaaaa",
    href: "https://steamcommunity.com/id/Keyshaaaa/",
    color: "bg-sky-500",
    hover: "hover:border-sky-400",
  },
];

const REPLY_OK =
  "Pesan diterima, Sensei! Fhaa akan segera membalasnya ke emailmu.";
const REPLY_FAIL =
  "Maaf, Sensei... pesannya gagal terkirim. Coba lagi sebentar, atau kirim langsung lewat email di samping.";
const GREETING = {
  id: "greeting",
  sender: "fhaa",
  text: "Halo, Sensei! Isi formulir di bawah untuk mengirim pesan ke Fhaa.",
};
// botcheck = kolom jebakan untuk bot (disembunyikan dari pengguna)
const EMPTY_FORM = {
  name: "",
  email: "",
  subject: "",
  message: "",
  botcheck: "",
};

// ---------- Validasi email ----------
// Menolak alamat asal-asalan (mis. nama@koasdaosjkdoa.com) tanpa membatasi ke satu penyedia:
// 1) format, 2) salah ketik umum, 3) email sementara, 4) domain harus punya server email (cek DNS).
const EMAIL_REGEX = /^[a-z0-9._%+-]+@([a-z0-9-]+(?:\.[a-z0-9-]+)+)$/i;

const TYPO_FIXES = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gmil.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.con": "gmail.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "hotmial.com": "hotmail.com",
  "outlok.com": "outlook.com",
};

const DISPOSABLE = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "yopmail.com",
  "trashmail.com",
  "sharklasers.com",
]);

// Tanya DNS lewat DNS-over-HTTPS (tanpa server sendiri). Dicoba Cloudflare dulu, lalu Google.
async function dohQuery(name, type) {
  const urls = [
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`,
    `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`,
  ];
  let lastError;
  for (const url of urls) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/dns-json" },
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error("DNS error");
      return await res.json();
    } catch (err) {
      lastError = err;
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastError;
}

const domainCache = new Map();

// true = domain bisa menerima email (atau tidak bisa dipastikan). false = pasti tidak ada.
async function domainCanReceiveMail(domain) {
  if (domainCache.has(domain)) return domainCache.get(domain);

  let result = true; // jika pengecekan gagal (offline, dll.), jangan blokir pengunjung
  try {
    const mx = await dohQuery(domain, "MX");
    if (mx.Status === 3) {
      result = false; // NXDOMAIN: domain tidak terdaftar
    } else {
      const hasMx = (mx.Answer ?? []).some(
        (a) => a.type === 15 && !/^\d+\s+\.?$/.test(a.data ?? ""), // abaikan "null MX"
      );
      if (hasMx) {
        result = true;
      } else {
        // Tanpa MX, domain masih sah kalau punya alamat server (A/AAAA)
        const a = await dohQuery(domain, "A");
        result = (a.Answer ?? []).some((r) => r.type === 1 || r.type === 28);
      }
    }
  } catch {
    result = true;
  }

  domainCache.set(domain, result);
  return result;
}

async function validateEmail(email) {
  const match = EMAIL_REGEX.exec(email);
  if (!match) {
    return {
      ok: false,
      message: "Format email belum benar, contoh: nama@email.com",
    };
  }
  const domain = match[1].toLowerCase();

  if (TYPO_FIXES[domain]) {
    return {
      ok: false,
      message: `Maksud Anda ${email.split("@")[0]}@${TYPO_FIXES[domain]}?`,
    };
  }
  if (DISPOSABLE.has(domain)) {
    return {
      ok: false,
      message: "Email sementara tidak diterima. Gunakan email aktif Anda.",
    };
  }
  if (!(await domainCanReceiveMail(domain))) {
    return {
      ok: false,
      message: `Domain "${domain}" tidak ditemukan atau tidak bisa menerima email.`,
    };
  }
  return { ok: true };
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function deliver(data) {
  if (WEB3FORMS_KEY) {
    const res = await fetch(WEB3FORMS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        from_name: "Portofolio MomoTalk",
        subject: `[Portofolio] ${data.subject}`,
        name: data.name,
        email: data.email, // otomatis jadi alamat "Reply-To"
        message: data.message,
      }),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.success) {
      throw new Error(json?.message || "Gagal mengirim");
    }
    return;
  }

  // Cadangan (tanpa access key): buka aplikasi email dengan isi yang sudah terisi
  const body = `Nama: ${data.name}\nEmail: ${data.email}\n\n${data.message}`;
  window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(
    data.subject,
  )}&body=${encodeURIComponent(body)}`;
}

// text-base di HP (16px) mencegah iPhone memperbesar halaman saat input difokus
const inputClass =
  "w-full rounded-lg border-2 border-line bg-surface px-3 py-1.5 text-base text-ink outline-hidden transition focus:border-sky-400 sm:text-sm";
const inputErrorClass = inputClass.replace("border-line", "border-red-400");
const labelClass = "mb-0.5 block text-xs font-semibold text-ink-soft";

const socialRowClass =
  "group flex w-full items-center gap-3 border-2 border-line bg-surface p-1.5 pr-3 text-left transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500";

function SocialRow({ social, copied, onCopy }) {
  const { Icon, label, handle, href, color, hover } = social;

  const content = (
    <>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center text-white transition group-hover:scale-105 ${color}`}
      >
        <Icon size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] leading-tight font-bold tracking-wide text-faint uppercase">
          {label}
        </span>
        <span className="block truncate text-sm font-semibold text-ink">
          {handle}
        </span>
      </span>
      <span
        className={`flex shrink-0 items-center gap-1 text-xs font-bold transition ${
          copied ? "text-emerald-500" : "text-faint group-hover:text-muted"
        }`}
      >
        {href ? (
          <ExternalLink size={16} />
        ) : copied ? (
          <>
            <Check size={16} /> Tersalin!
          </>
        ) : (
          <>
            <Copy size={16} /> Salin
          </>
        )}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Buka ${label} ${handle}`}
        className={`${socialRowClass} ${hover}`}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={`Salin username ${label} ${handle}`}
      className={`${socialRowClass} ${hover}`}
    >
      {content}
    </button>
  );
}

export default function MomoTalkContact() {
  const [messages, setMessages] = useState([GREETING]); // { id, sender, text, subject? }
  const [form, setForm] = useState(EMPTY_FORM);
  const [isTyping, setIsTyping] = useState(false); // true selama pesan dikirim
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const scrollRef = useRef(null);
  const emailRef = useRef(null);
  const copyTimer = useRef(null);
  const mounted = useRef(true);

  // Auto-scroll ke pesan terbaru (hanya di dalam kontainer chat)
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  // Penanda komponen masih aktif + bersihkan timer saat dilepas
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      clearTimeout(copyTimer.current);
    };
  }, []);

  const handleCopy = async ({ id, copy }) => {
    try {
      await navigator.clipboard.writeText(copy);
    } catch {
      return; // clipboard tidak tersedia (mis. bukan HTTPS), abaikan
    }
    setCopiedId(id);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopiedId(null), 2000);
  };

  const handleChange = (e) => {
    if (e.target.name === "email") setEmailError("");
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Cek email saat kolom ditinggalkan
  const handleEmailBlur = async () => {
    const value = form.email.trim().toLowerCase();
    if (!value) return;
    const result = await validateEmail(value);
    // Abaikan hasil lama kalau pengunjung sudah mengubah isinya lagi
    if (
      mounted.current &&
      emailRef.current?.value.trim().toLowerCase() === value
    ) {
      setEmailError(result.ok ? "" : result.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isTyping || isChecking) return;

    const data = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    };
    if (!data.name || !data.email || !data.subject || !data.message) return;

    setIsChecking(true);
    const check = await validateEmail(data.email);
    setIsChecking(false);
    if (!mounted.current) return;
    if (!check.ok) {
      setEmailError(check.message);
      emailRef.current?.focus();
      return;
    }

    setError("");
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "user",
        subject: data.subject,
        text: data.message,
      },
    ]);
    const isBot = form.botcheck !== "";
    setForm(EMPTY_FORM);
    setIsTyping(true); // tampilkan "Fhaa is typing..." selama proses kirim

    let ok = true;
    try {
      if (isBot) {
        await sleep(2000); // bot: pura-pura sukses, pesan tidak dikirim
      } else {
        // Tunggu pengiriman selesai DAN minimal 2 detik supaya animasi mengetik terasa natural
        await Promise.all([deliver(data), sleep(2000)]);
      }
    } catch {
      ok = false;
    }

    if (!mounted.current) return;
    setIsTyping(false);

    if (ok) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: "fhaa", text: REPLY_OK },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: "fhaa", text: REPLY_FAIL },
      ]);
      setForm({ ...EMPTY_FORM, ...data }); // kembalikan isi form agar tidak perlu mengetik ulang
      setError(
        `Pesan gagal terkirim. Periksa koneksi lalu coba lagi, atau kirim langsung ke ${EMAIL}.`,
      );
    }
  };

  return (
    <SectionShell id="contact" title="KONTAK" fit>
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Informasi kontak */}
        <div className="self-start drop-shadow-[0_0_15px_rgba(244,114,182,0.6)] lg:col-span-2">
          <div className="clip-chamfered border-4 border-pink-400 bg-surface p-5 pb-8">
            <h3 className="text-lg font-extrabold text-ink">
              Informasi Kontak
            </h3>
            <p className="mb-4 text-sm text-muted">
              Uhe~ Jangan ragu menyapa, Sensei!
            </p>

            <ul className="flex flex-col gap-3">
              {CONTACTS.map(({ Icon, label, value, href, color }) => (
                <li key={label} className="flex items-center gap-3">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center text-white ${color}`}
                  >
                    <Icon size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] leading-tight font-bold tracking-wide text-faint uppercase">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm font-semibold break-all text-ink transition hover:text-sky-500"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-semibold text-ink">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            {/* Media sosial */}
            <div className="mt-4 border-t-2 border-dashed border-pink-200 pt-4 dark:border-pink-400/30">
              <p className="mb-2 text-sm font-bold text-ink-soft">
                Atau temui Fhaa di sini
              </p>
              <ul className="flex flex-col gap-2">
                {SOCIALS.map((social) => (
                  <li key={social.id}>
                    <SocialRow
                      social={social}
                      copied={copiedId === social.id}
                      onCopy={() => handleCopy(social)}
                    />
                  </li>
                ))}
              </ul>
              {/* Pengumuman untuk pembaca layar saat username disalin */}
              <p className="sr-only" role="status" aria-live="polite">
                {copiedId ? "Username berhasil disalin" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Kirim pesan (jendela MomoTalk) */}
        <div className="drop-shadow-[0_8px_20px_rgba(14,165,233,0.25)] lg:col-span-3">
          <div className="clip-chamfered overflow-hidden border-4 border-sky-400 bg-surface">
            {/* Header */}
            <header className="flex items-center gap-3 bg-sky-500 px-4 py-2.5 text-white">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-300 font-bold text-white">
                F
              </div>
              <div>
                <p className="leading-tight font-bold">Kirim Pesan</p>
                <p className="text-xs text-sky-100">MomoTalk · Fhaa Online</p>
              </div>
            </header>

            {/* History chat */}
            <div
              ref={scrollRef}
              className="flex h-28 flex-col gap-2 overflow-y-auto bg-panel p-3"
            >
              {messages.map((m) =>
                m.sender === "user" ? (
                  <div key={m.id} className="flex justify-end">
                    <p className="max-w-[80%] rounded-2xl rounded-br-sm bg-sky-500 px-3 py-1.5 text-sm text-white">
                      {m.subject && (
                        <span className="block font-bold">{m.subject}</span>
                      )}
                      <span className="wrap-break-word whitespace-pre-wrap">
                        {m.text}
                      </span>
                    </p>
                  </div>
                ) : (
                  <div key={m.id} className="flex justify-start">
                    <p className="max-w-[80%] rounded-2xl rounded-bl-sm bg-surface px-3 py-1.5 text-sm text-ink-soft shadow-sm">
                      {m.text}
                    </p>
                  </div>
                ),
              )}

              {isTyping && (
                <div className="flex justify-start">
                  <p className="animate-pulse rounded-2xl rounded-bl-sm bg-surface px-3 py-1.5 text-sm text-faint italic shadow-sm">
                    Fhaa is typing...
                  </p>
                </div>
              )}
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-2 border-t-2 border-line bg-surface p-3 pb-6"
            >
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label htmlFor="c-name" className={labelClass}>
                    Nama Anda
                  </label>
                  <input
                    id="c-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Nama Anda"
                    autoComplete="name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="c-email" className={labelClass}>
                    Email Anda
                  </label>
                  <input
                    id="c-email"
                    ref={emailRef}
                    name="email"
                    type="email"
                    inputMode="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleEmailBlur}
                    placeholder="nama@email.com"
                    autoComplete="email"
                    aria-invalid={emailError ? "true" : undefined}
                    aria-describedby={emailError ? "c-email-error" : undefined}
                    className={emailError ? inputErrorClass : inputClass}
                  />
                  {emailError && (
                    <p
                      id="c-email-error"
                      role="alert"
                      className="mt-0.5 text-xs font-semibold text-red-500"
                    >
                      {emailError}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="c-subject" className={labelClass}>
                  Subjek
                </label>
                <input
                  id="c-subject"
                  name="subject"
                  type="text"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Subjek"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="c-message" className={labelClass}>
                  Pesan Anda
                </label>
                <textarea
                  id="c-message"
                  name="message"
                  required
                  rows={3}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Pesan Anda"
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* Kolom jebakan bot: tidak terlihat dan tidak bisa difokus oleh manusia */}
              <input
                type="text"
                name="botcheck"
                value={form.botcheck}
                onChange={handleChange}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="sr-only"
              />

              {error && (
                <p role="alert" className="text-sm font-semibold text-red-500">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isTyping || isChecking}
                className="flex items-center justify-center gap-2 rounded-lg bg-pink-400 px-6 py-2.5 font-bold text-white transition hover:bg-pink-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={18} />
                {isChecking
                  ? "Memeriksa email..."
                  : isTyping
                    ? "Mengirim..."
                    : "Kirim"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
