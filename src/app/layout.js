import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "./providers/ReactQueryProvider";
import ReduxProvider from "../store/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Chimnchurri",
  description: "Chimnchurri is a restaurant that serves delicious food. We are located in Lahore, Pakistan. We offer a wide variety of dishes, including vegetarian and non-vegetarian options. Our menu is updated regularly to ensure that we always have something new to offer our customers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        cz-shortcut-listen="true"
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
