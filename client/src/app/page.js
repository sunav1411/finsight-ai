import HeroSection from "@/components/landing/HeroSection";
import Navbar from "@/components/landing/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(87,199,255,0.18),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(246,201,106,0.16),_transparent_24%),linear-gradient(135deg,_#030712,_#08111f_45%,_#111827)]">
      <Navbar />
      <HeroSection />
    </main>
  );
}
