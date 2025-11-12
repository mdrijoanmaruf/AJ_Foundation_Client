"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import WhatsApp from "@/components/WhatsApp/WhatsApp";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}
      <div className="">{children}</div>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <WhatsApp />}
    </>
  );
}