"use client"

import type React from "react"
import { useNavbar } from "@/context/NavbarContext"

interface PageContainerProps {
  children: React.ReactNode
}

export default function PageContainer({ children }: PageContainerProps) {
  const { isOpen } = useNavbar()

  return (
    <div className={`transition-all duration-300 min-h-screen ${isOpen ? "lg:ml-64" : "lg:ml-20"}`}>{children}</div>
  )
}
