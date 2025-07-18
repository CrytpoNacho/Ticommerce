"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import NavbarWrapper from "@/components/NavbarWrapper"
import { useAuth } from "@/context/AuthContext"
import { User, ShoppingBag, Heart, Settings, LogOut } from "lucide-react"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null // No renderizar nada mientras redirige
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <main>
      <NavbarWrapper />
      <div className="lg:ml-20 transition-all duration-300 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-serif mb-8">Mi Perfil</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-background border border-mist border-opacity-10 rounded-lg p-6">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-primary bg-opacity-10 flex items-center justify-center mb-4">
                    <User size={40} className="text-primary" />
                  </div>
                  <h2 className="text-xl font-medium">{user.name}</h2>
                  <p className="text-textSecondary">{user.email}</p>

                  <div className="w-full mt-8">
                    <button className="w-full flex items-center gap-3 py-3 px-4 text-left text-textSecondary hover:text-primary transition-colors">
                      <User size={20} />
                      <span>Información Personal</span>
                    </button>
                    <button className="w-full flex items-center gap-3 py-3 px-4 text-left text-textSecondary hover:text-primary transition-colors">
                      <ShoppingBag size={20} />
                      <span>Mis Pedidos</span>
                    </button>
                    <button className="w-full flex items-center gap-3 py-3 px-4 text-left text-textSecondary hover:text-primary transition-colors">
                      <Heart size={20} />
                      <span>Favoritos</span>
                    </button>
                    <button className="w-full flex items-center gap-3 py-3 px-4 text-left text-textSecondary hover:text-primary transition-colors">
                      <Settings size={20} />
                      <span>Configuración</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 py-3 px-4 text-left text-error hover:text-error hover:opacity-80 transition-colors"
                    >
                      <LogOut size={20} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-background border border-mist border-opacity-10 rounded-lg p-6">
                <h2 className="text-xl font-medium mb-6">Información Personal</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-1">Nombre</label>
                    <input
                      type="text"
                      value={user.name}
                      readOnly
                      className="w-full bg-background border border-mist border-opacity-20 rounded-md py-2 px-4 text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-1">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      readOnly
                      className="w-full bg-background border border-mist border-opacity-20 rounded-md py-2 px-4 text-foreground focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="pt-4">
                    <p className="text-textSecondary text-center">
                      Esta es una página de perfil de demostración. La funcionalidad completa estará disponible
                      próximamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
