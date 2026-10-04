// Pembungkus bersama untuk semua section: latar grid + judul pink chamfered yang rata tengah.
// fit = section dibuat setinggi layar dan isinya dipusatkan (untuk section yang harus muat satu layar).
const GRID_STYLE = {
  backgroundColor: "#f8fafc",
  backgroundImage:
    "linear-gradient(#e0f2fe 1px, transparent 1px), linear-gradient(90deg, #e0f2fe 1px, transparent 1px)",
  backgroundSize: "28px 28px",
};

export default function SectionShell({ id, title, children, fit = false }) {
  return (
    <section
      id={id}
      className={`px-6 ${
        fit ? "flex min-h-screen flex-col justify-center pt-20 pb-6" : "py-20"
      }`}
      style={GRID_STYLE}
    >
      <div className="mx-auto w-full max-w-5xl">
        {/* flex + justify-center = judul selalu di tengah */}
        <div className={`flex justify-center ${fit ? "mb-6" : "mb-10"}`}>
          {/* Wrapper membawa glow, elemen dalam membawa clip-path */}
          <div className="drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]">
            <h2 className="clip-chamfered bg-pink-400 py-2 pr-12 pl-6 text-2xl font-extrabold tracking-wide text-white sm:text-3xl">
              {title}
            </h2>
          </div>
        </div>

        {children}
      </div>
    </section>
  );
}
