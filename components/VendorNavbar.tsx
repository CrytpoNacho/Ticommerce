"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  Globe,
  BarChart3,
  Settings,
  User,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Store,
  ShoppingBag,
  Zap,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function VendorNavbar() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  // Detectar si estamos en móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    // Cargar preferencia guardada
    const savedState = localStorage.getItem("vendorNavbarState")
    if (savedState) {
      setIsOpen(savedState === "open")
    }

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Función para alternar el estado del sidebar
  const toggleSidebar = () => {
    const newState = !isOpen
    setIsOpen(newState)
    localStorage.setItem("vendorNavbarState", newState ? "open" : "closed")
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(path)

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Navegación específica para vendedores
  const vendorNavItems = [
    {
      href: "/vendedor/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      description: "Panel principal",
    },
    {
      href: "/vendedor/productos",
      icon: Package,
      label: "Productos",
      description: "Gestión de inventario",
    },
    {
      href: "/vendedor/pedidos",
      icon: ShoppingBag,
      label: "Pedidos",
      description: "Gestión de ventas",
    },
    {
      href: "/vendedor/landing",
      icon: Globe,
      label: "Landing Page",
      description: "Página personalizada",
    },
    {
      href: "/vendedor/estadisticas",
      icon: BarChart3,
      label: "Estadísticas",
      description: "Análisis y métricas",
    },
    {
      href: "/vendedor/planes",
      icon: Zap,
      label: "Planes",
      description: "Promociones y upgrades",
    },
    {
      href: "/vendedor/perfil",
      icon: User,
      label: "Perfil",
      description: "Información personal",
    },
    {
      href: "/vendedor/configuracion",
      icon: Settings,
      label: "Configuración",
      description: "Ajustes de cuenta",
    },
  ]

  return (
    <>
      {/* Mobile Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden">
        <div className="flex items-center justify-between p-4 bg-background border-b border-mist border-opacity-10">
          <Link href="/vendedor/dashboard" className="flex items-center">
            <Image src="/logo.png" alt="10KCR Logo" width={100} height={40} />
            <span className="ml-2 text-sm font-medium text-primary">Vendedor</span>
          </Link>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-foreground p-2">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="bg-background border-b border-mist border-opacity-10 p-4 flex flex-col max-h-[80vh] overflow-y-auto">
            {vendorNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 py-3 px-2 rounded-md transition-colors ${
                  isActive(item.href)
                    ? "bg-primary bg-opacity-10 text-primary"
                    : "text-textSecondary hover:text-primary hover:bg-primary hover:bg-opacity-5"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon size={20} />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-textSecondary">{item.description}</div>
                </div>
              </Link>
            ))}

            <div className="border-t border-mist border-opacity-20 mt-4 pt-4">
              <div className="flex items-center gap-3 py-2 px-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User size={16} className="text-background" />
                </div>
                <div>
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-xs text-textSecondary">Vendedor</div>
                </div>
              </div>
              <button
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
                className="flex items-center gap-3 py-2 px-2 text-textSecondary hover:text-primary transition-colors w-full"
              >
                <LogOut size={20} />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-background border-r border-mist border-opacity-10 transition-all duration-300 ${
          isOpen ? "w-72" : "w-20"
        } z-50`}
      >
        {/* Logo y botón de toggle cuando está abierto */}
        {isOpen ? (
          <div className="flex items-center justify-between p-6">
            <Link href="/vendedor/dashboard" className="flex items-center">
              <Image src="/logo.png" alt="10KCR Logo" width={120} height={48} />
              <div className="ml-3">
                <div className="text-sm font-medium text-primary">Panel Vendedor</div>
                <div className="text-xs text-textSecondary">Gestión de negocio</div>
              </div>
            </Link>
            <button onClick={toggleSidebar} className="text-textSecondary hover:text-primary transition-colors z-20">
              <ChevronLeft size={20} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center pt-4">
            <Link href="/vendedor/dashboard">
              <div className="relative w-16 h-16 mb-2">
                <Image src="/logo.png" alt="10KCR Logo" fill className="object-contain" />
              </div>
            </Link>
            <div className="w-8 h-1 bg-primary rounded-full"></div>
          </div>
        )}

        {/* Botón de toggle cuando está cerrado */}
        {!isOpen && (
          <div className="flex justify-center my-4">
            <button
              onClick={toggleSidebar}
              className="text-textSecondary hover:text-primary transition-colors z-20 w-8 h-8 rounded-full border border-mist border-opacity-20 flex items-center justify-center"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

        <nav className="flex flex-col space-y-1 mt-4 px-3">
          {vendorNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center ${isOpen ? "px-3 py-3 rounded-md" : "justify-center py-3 rounded-md"} ${
                isActive(item.href)
                  ? "bg-primary bg-opacity-10 text-primary"
                  : "text-textSecondary hover:text-primary hover:bg-primary hover:bg-opacity-5"
              } transition-all duration-200`}
            >
              <item.icon size={20} />
              {isOpen && (
                <div className="ml-3">
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-textSecondary">{item.description}</div>
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Acceso rápido a la tienda */}
        {isOpen && (
          <div className="mx-6 mt-6 p-4 bg-primary bg-opacity-5 border border-primary border-opacity-20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Store size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">Acceso Rápido</span>
            </div>
            <Link href="/" className="text-xs text-textSecondary hover:text-primary transition-colors">
              Ver tienda como cliente →
            </Link>
          </div>
        )}

        {/* Usuario y logout */}
        <div className="mt-auto mb-6">
          <div className="flex flex-col gap-2">
            <Link
              href="/vendedor/perfil"
              className={`flex items-center ${
                isOpen
                  ? "mx-6 gap-3 p-3 rounded-lg border border-mist border-opacity-20 hover:border-primary"
                  : "justify-center"
              } transition-colors hover:bg-primary hover:bg-opacity-5`}
            >
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <User size={18} className="text-background" />
              </div>
              {isOpen && (
                <div className="flex-1">
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-xs text-textSecondary">Cuenta de vendedor</div>
                </div>
              )}
            </Link>
            {isOpen && (
              <button
                onClick={handleLogout}
                className="mx-6 flex items-center gap-3 p-2 text-textSecondary hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
              >
                <LogOut size={18} />
                <span>Cerrar Sesión</span>
              </button>
            )}
            {!isOpen && (
              <div className="flex justify-center">
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 rounded-full border border-mist border-opacity-20 flex items-center justify-center text-textSecondary hover:text-red-500 hover:border-red-200 transition-colors"
                  title="Cerrar Sesión"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
