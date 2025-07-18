"use client"

import { useAuth } from "@/context/AuthContext"
import VendorNavbar from "./VendorNavbar"

export default function VendorNavbarWrapper() {
  const { user, isVendor } = useAuth()

  // Solo mostrar el navbar de vendedor si el usuario está autenticado y es vendedor
  if (!user || !isVendor()) {
    return null
  }

  return <VendorNavbar />
}
