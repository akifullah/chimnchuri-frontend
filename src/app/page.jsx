
import Link from "next/link";
import { FaEnvelope, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import MenuSection from "./MenuSection";
import HeroSection from "./_components/HeroSection";
import HomeFooter from "./_components/HomeFooter";


export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-between min-h-dvh">
        <HeroSection />

        <section className="py-10 lg:py-20 ">
          <MenuSection />
        </section>
        <div className="pb-4">
          <HomeFooter />
        </div>
      </div>
    </>
  );
}
