
import Link from "next/link";
import { FaEnvelope, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import MenuSection from "./MenuSection";


export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-between min-h-dvh">
        <section>
          <div className="bg-brand py-10 lg:py-20">
            <h1 className="text-white text-[13vw] font-bold uppercase text-center text-shadow-lg">Chimnchurri</h1>
          </div>
        </section>

        <section className="py-10 lg:py-20 ">
          <MenuSection />
        </section>
        <div className="pb-4">
          <section className="py-10 lg:py-20">
            <div className="max-w-xl mx-auto text-center  font-bold uppercase">
              <h3 className="text-3xl md:text-5xl text-brand text-shadow-lg">Chimncurri</h3>

              <div className="flex flex-wrap items-center justify-center gap-5 font-bold text-md mt-5">
                <Link href="/" className="text-white hover:text-brand transition-all duration-500">Home</Link>
                <Link href="/categories" className="text-white hover:text-brand transition-all duration-500">Menu</Link>
                <Link href="/categories" className="text-white hover:text-brand transition-all duration-500">Our Food</Link>
                <a href="#" className="text-white hover:text-brand transition-all duration-500">Team</a>
              </div>


              <div className="flex items-center justify-center gap-5 mt-5">
                <a href="#" className="text-white hover:text-brand transition-all duration-500"><FaInstagram size={22} /></a>
                <a href="#" className="text-white hover:text-brand transition-all duration-500"><FaTiktok size={22} /></a>
                <a href="#" className="text-white hover:text-brand transition-all duration-500"><FaEnvelope size={22} /></a>
                <a href="#" className="text-white hover:text-brand transition-all duration-500"><FaWhatsapp size={22} /></a>
              </div>
            </div>
          </section>
          <div className="text-center">
            <p>{new Date().getFullYear()} © Chimnchurri. Developed by <a href="https://webspires.com.pk/?utm_source=chimnchurri" className="text-white hover:text-brand transition-all duration-500">Webspires</a></p>

          </div>
        </div>
      </div>
    </>
  );
}
