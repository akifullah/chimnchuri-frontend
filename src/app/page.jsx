
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
          <MenuSection/>
          {/* <div className="group text-center max-w-xl mx-auto text-white grid justify-center text-5xl md:text-9xl space-y-4 font-bold uppercase">
            <img src="https://framerusercontent.com/images/lqVLSf1L7iXRjlle5r0lSDziZJc.png?scale-down-to=512" alt="" />
            <div className="h-0 grid items-center overflow-hidden group-hover:h-[200] group-hover:md:h-[500] transition-all duration-500">
              <Link href="/categories" className="hover:scale-125 hover:text-brand text-shadow-lg transition-all duration-500">Menu</Link>
              <Link href="/categories" className="hover:scale-125 hover:text-brand text-shadow-lg transition-all duration-500">Order</Link>
              <Link href="/" className="hover:scale-125 hover:text-brand text-shadow-lg transition-all duration-500">Team</Link>
            </div>
            <img src="https://framerusercontent.com/images/IBVmg3xN8SihQw2iTYArGQgLrU.png?scale-down-to=512" alt="" />
          </div> */}
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
