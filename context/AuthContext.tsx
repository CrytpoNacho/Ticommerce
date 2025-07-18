"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: number
  name: string
  email: string
  userType?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  registerVendor: (data: VendorRegistrationData) => Promise<boolean>
  logout: () => void
  isVendor: () => boolean
  redirectToDashboard: () => void
}

type VendorRegistrationData = {
  legalName: string
  brandName: string
  identification: string
  phone: string
  email: string
  password: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar si hay una sesión guardada en localStorage
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        console.log("🔍 Usuario cargado desde localStorage:", parsedUser)
        console.log("🔍 Tipo de usuario:", parsedUser.userType)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const isVendor = () => {
    const result = user?.userType === "seller"
    console.log("🔍 Verificando si es vendedor:")
    console.log("  - Usuario:", user?.name)
    console.log("  - Email:", user?.email)
    console.log("  - UserType:", user?.userType)
    console.log("  - Es vendedor?:", result)
    return result
  }

  const redirectToDashboard = () => {
    if (isVendor()) {
      router.push("/vendedor/dashboard")
    } else {
      router.push("/profile")
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        const userData = {
          ...data.user,
          userType: data.userType,
        }

        console.log("🔐 Login exitoso:")
        console.log("  - Usuario:", userData.name)
        console.log("  - Email:", userData.email)
        console.log("  - UserType recibido:", data.userType)
        console.log("  - UserType en userData:", userData.userType)

        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        setIsLoading(false)

        // Redirigir según el tipo de usuario con logs de seguridad
        if (data.userType === "seller") {
          console.log("✅ Redirigiendo vendedor al dashboard")
          router.push("/vendedor/dashboard")
        } else if (data.userType === "buyer") {
          console.log("✅ Redirigiendo comprador al inicio")
          router.push("/")
        } else {
          console.log("⚠️ Tipo de usuario desconocido:", data.userType)
          router.push("/")
        }

        return true
      } else {
        console.log("❌ Login fallido:", data.message)
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error("Error during login:", error)
      setIsLoading(false)
      return false
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        const userData = {
          ...data.user,
          userType: "buyer",
        }
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        setIsLoading(false)
        return true
      } else {
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error("Error during registration:", error)
      setIsLoading(false)
      return false
    }
  }

  const registerVendor = async (vendorData: VendorRegistrationData) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register-vendor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(vendorData),
      })

      const data = await response.json()

      if (response.ok) {
        const userData = {
          ...data.user,
          userType: "seller",
        }
        setUser(userData)
        localStorage.setItem("user", JSON.stringify(userData))
        setIsLoading(false)
        return true
      } else {
        setIsLoading(false)
        return false
      }
    } catch (error) {
      console.error("Error during vendor registration:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    console.log("🚪 Cerrando sesión para:", user?.email)
    setUser(null)
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        registerVendor,
        logout,
        isVendor,
        redirectToDashboard,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
