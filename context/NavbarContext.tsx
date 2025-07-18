"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { usePathname } from "next/navigation"

type NavbarContextType = {
  isOpen: boolean
  toggleSidebar: () => void
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined)

export function NavbarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false) // Cambiar a false por defecto
  const [isHydrated, setIsHydrated] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Marcar como hidratado
    setIsHydrated(true)

    // Verificar si hay una preferencia guardada solo después de la hidratación
    const savedState = localStorage.getItem("navbarState")
    if (savedState) {
      setIsOpen(savedState === "open")
    } else {
      // Si no hay estado guardado, mantener cerrado por defecto
      setIsOpen(false)
    }
  }, [])

  // Cerrar navbar cuando cambia la ruta (solo si está abierto)
  useEffect(() => {
    if (isHydrated && isOpen) {
      console.log("Ruta cambió a:", pathname, "- Cerrando navbar")
      setIsOpen(false)
      localStorage.setItem("navbarState", "closed")
    }
  }, [pathname, isHydrated]) // Removemos isOpen de las dependencias para evitar loops

  const toggleSidebar = () => {
    const newState = !isOpen
    console.log("Toggle navbar:", newState ? "ABIERTO" : "CERRADO")
    setIsOpen(newState)

    if (isHydrated) {
      localStorage.setItem("navbarState", newState ? "open" : "closed")
    }
  }

  return <NavbarContext.Provider value={{ isOpen, toggleSidebar }}>{children}</NavbarContext.Provider>
}

export function useNavbar() {
  const context = useContext(NavbarContext)
  if (context === undefined) {
    throw new Error("useNavbar must be used within a NavbarProvider")
  }
  return context
}
