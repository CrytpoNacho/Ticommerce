"use client"

import type React from "react"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface VendorProtectedRouteProps {
  children: React.ReactNode
}

export default function VendorProtectedRoute({ children }: VendorProtectedRouteProps) {
  const { user, isLoading, isVendor } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // No hay usuario autenticado, redirigir al login
        console.log("❌ No hay usuario autenticado - Redirigiendo al login")
        router.push("/login")
        return
      }

      if (!isVendor()) {
        // Usuario autenticado pero no es vendedor
        console.log("❌ Usuario no es vendedor - Acceso denegado")
        console.log("Tipo de usuario:", user.userType)
        router.push("/")
        return
      }

      console.log("✅ Acceso autorizado para vendedor:", user.name)
    }
  }, [user, isLoading, isVendor, router])

  // Mostrar loading mientras se verifica
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-textSecondary">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  // No mostrar contenido si no hay usuario o no es vendedor
  if (!user || !isVendor()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-error mb-4">Acceso Denegado</h2>
          <p className="text-textSecondary mb-4">No tienes permisos para acceder a esta área.</p>
          <button
            onClick={() => router.push("/")}
            className="bg-primary text-background px-6 py-2 rounded-md hover:bg-opacity-90"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    )
  }

  // Usuario autorizado, mostrar contenido
  return <>{children}</>
}
