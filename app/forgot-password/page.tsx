"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Mail } from "lucide-react"
import GoldenCurves from "@/components/GoldenCurves"
import NavbarWrapper from "@/components/NavbarWrapper"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulación de envío de correo
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitted(true)
    setIsLoading(false)
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
            {!isSubmitted ? (
              <>
                <h1 className="text-2xl font-serif text-center mb-6 text-primary">Recuperar Contraseña</h1>
                <p className="text-textSecondary text-center mb-6">
                  Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña.
                </p>

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
                      placeholder="Correo Electrónico"
                      className="w-full bg-background border border-primary border-opacity-30 rounded-md py-3 pl-10 pr-4 text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary text-background font-medium py-3 px-6 rounded-md hover:bg-opacity-90 transition-all disabled:opacity-70"
                  >
                    {isLoading ? "Enviando..." : "Enviar Instrucciones"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mx-auto mb-4">
                  <Mail size={32} className="text-primary" />
                </div>
                <h2 className="text-xl font-medium mb-2">Revisa tu correo</h2>
                <p className="text-textSecondary mb-6">
                  Hemos enviado instrucciones para restablecer tu contraseña a <strong>{email}</strong>
                </p>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link href="/login" className="text-primary hover:underline">
                Volver a Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
