import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TerminalSection from "./components/TerminalSection";
import GachaSkills from "./components/GachaSkills";
import MaintenanceCert from "./components/MaintenanceCert";
import MomoTalkContact from "./components/MomoTalkContact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="bg-slate-50">
        <Hero />
        <TerminalSection />
        <GachaSkills />
        <MaintenanceCert />
        <MomoTalkContact />
      </main>
      <Footer />
    </>
  );
}
