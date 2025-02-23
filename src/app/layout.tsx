import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/providers/SessionProvider";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { Poppins } from '@next/font/google';

const font = Poppins({
  subsets: ['latin'],
  weight: '400',
  style: 'normal',
});

export const metadata: Metadata = {
  title: "<Title>",
  description: "Research Website of <Title>",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${font} antialiased bg-gray-100`}>
        <SessionProvider>
          <Navbar />
          <div className=" max-w-[2560px] mx-auto mt-16">
            {children}
          </div>
          <Footer />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
