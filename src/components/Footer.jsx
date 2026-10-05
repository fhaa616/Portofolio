import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import {
  FaGithub,
  FaInstagram,
  FaDiscord,
  FaSteam,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import NameTag from "./NameTag";

const GRID_STYLE = {
  backgroundColor: "var(--canvas)",
  backgroundImage:
    "linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
};

const EMAIL = "alfhafairuz08@gmail.com";

// Warna hover bergantian pink / biru / oranye ala Hoshino
const TONE = {
  pink: "hover:border-pink-400 hover:bg-pink-400 hover:drop-shadow-[0_0_12px_rgba(244,114,182,0.8)]",
  sky: "hover:border-sky-400 hover:bg-sky-400 hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.8)]",
  orange:
    "hover:border-orange-400 hover:bg-orange-400 hover:drop-shadow-[0_0_12px_rgba(251,146,60,0.8)]",
};

// Item dengan `href` membuka tautan, item dengan `copy` menyalin teksnya
const SOCIALS = [
  {
    id: "github",
    label: "GitHub",
    Icon: FaGithub,
    href: "https://github.com/fhaa616",
    tone: "sky",
  },
  {
    id: "instagram",
    label: "Instagram",
    Icon: FaInstagram,
    href: "https://instagram.com/fhaa_turu",
    tone: "pink",
  },
  {
    id: "discord",
    label: "Discord (klik untuk salin username)",
    Icon: FaDiscord,
    copy: "alfhaaaaaa",
    tone: "orange",
  },
  {
    id: "steam",
    label: "Steam",
    Icon: FaSteam,
    href: "https://steamcommunity.com/id/fhaa616/",
    tone: "sky",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    Icon: FaWhatsapp,
    href: "https://wa.me/6282254334950",
    tone: "pink",
  },
  {
    id: "email",
    label: "Email",
    Icon: FaEnvelope,
    href: `mailto:${EMAIL}`,
    tone: "orange",
  },
];

const iconClass =
  "flex h-12 w-12 items-center justify-center border-2 border-sky-400 bg-surface text-ink transition hover:-translate-y-1 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400";

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      return; // clipboard tidak tersedia (mis. bukan HTTPS)
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <footer
      style={GRID_STYLE}
      className="border-t-4 border-pink-400 shadow-[0_-4px_14px_rgba(244,114,182,0.35)] dark:shadow-[0_-4px_24px_rgba(244,114,182,0.45)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-6 py-10 md:flex-row md:justify-between">
        <NameTag />

        <ul className="flex flex-wrap justify-center gap-3">
          {SOCIALS.map(({ id, label, Icon, href, copy, tone }) => (
            <li key={id}>
              {href ? (
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className={`${iconClass} ${TONE[tone]}`}
                >
                  <Icon size={22} />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => handleCopy(copy)}
                  aria-label={label}
                  title={copied ? "Tersalin!" : label}
                  className={`${iconClass} ${TONE[tone]}`}
                >
                  {copied ? <Check size={22} /> : <Icon size={22} />}
                </button>
              )}
            </li>
          ))}
        </ul>

        <p className="text-center text-xs font-extrabold tracking-wide text-muted uppercase md:max-w-60 md:text-right">
          © {new Date().getFullYear()} Awang Alfha Fairuz Amien. Hak cipta
          dilindungi.
        </p>

        <p className="sr-only" role="status" aria-live="polite">
          {copied ? "Username Discord berhasil disalin" : ""}
        </p>
      </div>
    </footer>
  );
}
