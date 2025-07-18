"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff, Info } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import GoldenCurves from "@/components/GoldenCurves"
import NavbarWrapper from "@/components/NavbarWrapper"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login, user, isVendor } = useAuth()

  // Si el usuario ya está autenticado, redirigir según su rol
  useEffect(() => {
    if (user) {
      if (isVendor()) {
        router.push("/vendedor/dashboard")
      } else {
        router.push("/")
      }
    }
  }, [user, isVendor, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const success = await login(email, password)
      if (!success) {
        setError("Credenciales inválidas. Por favor, inténtalo de nuevo.")
      }
    } catch (err) {
      setError("Ocurrió un error durante el inicio de sesión. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const fillDemoCredentials = (userType: "user" | "vendor") => {
    if (userType === "user") {
      setEmail("demo@luxcr.com")
      setPassword("demo123")
    } else {
      setEmail("vendedor@luxcr.com")
      setPassword("vendedor123")
    }
  }

  return (
    <main>
      <NavbarWrapper />
      <div className="lg:ml-20 transition-all duration-300 min-h-screen flex items-center justify-center relative overflow-hidden">
        <GoldenCurves />

        <div className="w-full max-w-md z-10 px-4">
          <div className="text-center mb-10">
            <Image src="/logo.png" alt="LuxCR Logo" width={200} height={80} className="mx-auto mb-4" />
            <h2 className="text-xl text-primary">Productos de lujo en Costa Rica</h2>
          </div>

          <div className="bg-background bg-opacity-70 backdrop-blur-sm border border-primary border-opacity-20 rounded-lg p-8 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <h2 className="text-2xl font-serif text-center mb-6 text-primary">Inicia Sesión</h2>

            {/* Credenciales de demostración */}
            <div className="mb-6 p-4 bg-primary bg-opacity-10 rounded-lg border border-primary border-opacity-30">
              <div className="flex items-center mb-2">
                <Info size={16} className="text-primary mr-2" />
                <span className="text-sm font-medium text-primary">Credenciales de Demostración</span>
              </div>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials("user")}
                  className="w-full text-left text-sm text-textSecondary hover:text-primary transition-colors"
                >
                  <strong>Usuario:</strong> demo@luxcr.com / demo123
                </button>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials("vendor")}
                  className="w-full text-left text-sm text-textSecondary hover:text-primary transition-colors"
                >
                  <strong>Vendedor:</strong> vendedor@luxcr.com / vendedor123
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email address"
                  className="w-full bg-background border border-primary border-opacity-30 rounded-md py-3 pl-10 pr-4 text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  className="w-full bg-background border border-primary border-opacity-30 rounded-md py-3 pl-10 pr-10 text-foreground focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary hover:text-primary-dark focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && <p className="text-error text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-background font-medium py-3 px-6 rounded-md hover:bg-opacity-90 transition-all disabled:opacity-70"
              >
                {isLoading ? "Iniciando sesión..." : "Sign in"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/forgot-password" className="text-primary hover:underline text-sm">
                Olvidé mi contraseña
              </Link>
            </div>

            <div className="mt-8 text-center">
              <p className="text-textSecondary">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Regístrate
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
