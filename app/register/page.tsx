"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import GoldenCurves from "@/components/GoldenCurves"
import NavbarWrapper from "@/components/NavbarWrapper"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (!acceptTerms) {
      setError("Debes aceptar los términos y condiciones")
      return
    }

    setIsLoading(true)

    try {
      const success = await register(name, email, password)
      if (success) {
        router.push("/")
      } else {
        setError("Error al registrar usuario. Por favor, inténtalo de nuevo.")
      }
    } catch (err) {
      setError("Ocurrió un error durante el registro. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <main>
      <NavbarWrapper />
      <div className="lg:ml-20 transition-all duration-300 min-h-screen flex items-center justify-center relative overflow-hidden py-10">
        <GoldenCurves />

        <div className="w-full max-w-md z-10 px-4">
          <div className="text-center mb-10">
            <Image src="/logo.png" alt="LuxCR Logo" width={200} height={80} className="mx-auto mb-4" />
            <h2 className="text-xl text-primary">Productos de lujo en Costa Rica</h2>
          </div>

          <div className="bg-background bg-opacity-70 backdrop-blur-sm border border-primary border-opacity-20 rounded-lg p-8 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <h1 className="text-3xl font-serif text-center mb-8 text-primary">Registro de Usuario</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Nombre"
                  className="w-full bg-background border border-primary border-opacity-30 rounded-md py-3 pl-10 pr-4 text-foreground focus:outline-none focus:border-primary"
                />
              </div>

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
                  placeholder="Correo Electrónico"
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
                  placeholder="Contraseña"
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

              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock className="w-5 h-5 text-primary" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Confirmar Contraseña"
                  className="w-full bg-background border border-primary border-opacity-30 rounded-md py-3 pl-10 pr-10 text-foreground focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary hover:text-primary-dark focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center">
                <input
                  id="acceptTerms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="w-4 h-4 text-primary bg-background border-primary focus:ring-primary"
                />
                <label htmlFor="acceptTerms" className="ml-2 text-sm text-textSecondary">
                  Acepto los términos y condiciones
                </label>
              </div>

              {error && <p className="text-error text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-background font-medium py-3 px-6 rounded-md hover:bg-opacity-90 transition-all disabled:opacity-70"
              >
                {isLoading ? "Registrando..." : "Crear cuenta"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-textSecondary">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Iniciar sesión
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-mist border-opacity-20 text-center">
              <p className="text-textSecondary mb-2">¿Eres un vendedor?</p>
              <Link href="/vendedor/register" className="text-primary hover:underline font-medium">
                Regístrate aquí como vendedor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
