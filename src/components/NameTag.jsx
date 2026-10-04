// Name tag bersama untuk Navbar dan Footer: kotak pink bersudut miring + sisa nama
const CHAMFER_SM = {
  clipPath:
    "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)",
};

export default function NameTag({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-3 text-slate-800 ${className}`}
    >
      {/* Wrapper membawa glow, elemen dalam membawa clip-path */}
      <span className="inline-block drop-shadow-[0_0_10px_rgba(244,114,182,0.7)]">
        <span
          style={CHAMFER_SM}
          className="block bg-pink-400 py-1.5 pr-6 pl-3 text-lg font-black tracking-tight text-white sm:text-xl"
        >
          AWANG ALFHA FAIRUZ AMIEN
        </span>
      </span>
    </span>
  );
}
