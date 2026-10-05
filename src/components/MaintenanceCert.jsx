import { useEffect, useState } from 'react';
import { Wrench, RotateCcw } from 'lucide-react';
import SectionShell from './SectionShell';

// 99:59:59 (99:99:99 bukan waktu yang valid, jadi dibulatkan ke yang terdekat)
const START_SECONDS = 99 * 3600 + 59 * 60 + 59;

const pad = (n) => String(n).padStart(2, '0');

function formatTime(total) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function MaintenanceCert() {
  const [seconds, setSeconds] = useState(START_SECONDS);
  const [runId, setRunId] = useState(0); // naik setiap restart

  // Hitung mundur tiap detik. Dependency runId = interval dibuat ulang saat restart,
  // jadi detik pertama setelah restart tetap genap 1 detik.
  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, [runId]);

  const handleRestart = () => {
    setSeconds(START_SECONDS);
    setRunId((n) => n + 1);
  };

  return (
    <SectionShell id="certificates" title="SERTIFIKAT">
      <div className="mx-auto max-w-4xl drop-shadow-[0_8px_20px_rgba(14,165,233,0.35)] dark:drop-shadow-[0_0_26px_rgba(56,189,248,0.45)]">
        <div className="clip-chamfered overflow-hidden bg-slate-900">
          <div className="tape-move h-5" aria-hidden="true" />

          <div className="flex flex-col items-center gap-6 px-6 py-14 text-center">
            {/* Kunci inggris bergoyang + Zzz melayang */}
            <div className="relative" aria-hidden="true">
              <Wrench size={52} className="animate-wrench text-yellow-400" />
              {['Z', 'z', 'z'].map((ch, i) => (
                <span
                  key={i}
                  className="animate-zzz absolute font-mono font-bold text-sky-300"
                  style={{
                    top: `${-4 - i * 6}px`,
                    left: `${52 + i * 12}px`,
                    animationDelay: `${i * 0.8}s`,
                    fontSize: `${16 + i * 4}px`,
                  }}
                >
                  {ch}
                </span>
              ))}
            </div>

            <p className="max-w-xl text-lg font-semibold leading-relaxed text-slate-100 sm:text-xl">
              <span className="font-mono text-yellow-400">[SERVER MAINTENANCE]</span>{' '}
              Uhe~ Ojisan masih mengumpulkan sertifikat. Kembali lagi nanti... Zzz...
            </p>

            <div>
              <p className="mb-2 font-mono text-xs tracking-widest text-slate-400">
                ESTIMASI SELESAI
              </p>
              {/* key = runId: animasi glitch diputar ulang setiap restart */}
              <div
                key={runId}
                role="timer"
                aria-label={`Sisa waktu maintenance ${formatTime(seconds)}`}
                className="animate-glitch border-2 border-yellow-400 px-8 py-3 font-mono text-4xl font-bold tracking-widest text-yellow-400 tabular-nums sm:text-5xl"
              >
                {formatTime(seconds)}
              </div>
            </div>

            <button
              type="button"
              onClick={handleRestart}
              className="flex items-center gap-2 rounded-full border-2 border-yellow-400 px-6 py-2 font-semibold text-yellow-400 transition hover:bg-yellow-400 hover:text-slate-900 active:scale-95"
            >
              <RotateCcw size={18} />
              Mulai Ulang
            </button>
          </div>

          <div className="tape-move h-5 [animation-direction:reverse]" aria-hidden="true" />
        </div>
      </div>
    </SectionShell>
  );
}