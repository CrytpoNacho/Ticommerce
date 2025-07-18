"use client"

import Navbar from "./Navbar"
import { NavbarProvider } from "@/context/NavbarContext"

export default function NavbarWrapper() {
  return (
    <NavbarProvider>
      <Navbar />
    </NavbarProvider>
  )
}
