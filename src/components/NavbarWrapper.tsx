"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // ซ่อน navbar ในหน้า home เพราะ Home page มี custom navbar
  if (pathname === "/") {
    return null;
  }

  return <Navbar />;
}
