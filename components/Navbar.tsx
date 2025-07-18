"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  Search,
  User,
  Menu,
  X,
  LogIn,
  TrendingUp,
  Grid,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ArrowRight,
  Diamond,
} from "lucide-react"
import { useNavbar } from "@/context/NavbarContext"
import { useAuth } from "@/context/AuthContext"
import CartIndicator from "./CartIndicator"
import { useCartContext } from "@/context/CartContext"

// Datos de ejemplo para sugerencias de búsqueda
const searchSuggestions = [
  { id: "1", name: "Reloj Elegante", category: "Relojes" },
  { id: "2", name: "Bolso de Cuero", category: "Accesorios" },
  { id: "3", name: "Vela Aromática", category: "Decoración" },
  { id: "4", name: "Collar de Plata", category: "Accesorios" },
  { id: "5", name: "Set de Té", category: "Decoración" },
  { id: "6", name: "Billetera de Cuero", category: "Accesorios" },
  { id: "7", name: "Pulsera de Oro", category: "Accesorios" },
  { id: "8", name: "Perfume de Lujo", category: "Belleza" },
]

export default function Navbar() {
  const { isOpen, toggleSidebar } = useNavbar()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState(searchSuggestions)
  const [isMobile, setIsMobile] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { cart } = useCartContext()

  // Detectar si estamos en móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Filtrar sugerencias cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSuggestions([])
      return
    }

    const filtered = searchSuggestions.filter(
      (suggestion) =>
        suggestion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        suggestion.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredSuggestions(filtered)
  }, [searchTerm])

  // Cerrar sugerencias al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const isActive = (path: string) => pathname === path

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleSearch = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    // Siempre navegar a la página de búsqueda
    if (searchTerm.trim() !== "") {
      // Si hay texto, buscar con filtro
      router.push(`/busqueda?q=${encodeURIComponent(searchTerm)}`)
    } else {
      // Si no hay texto, ir a búsqueda sin filtros
      router.push("/busqueda")
    }

    setShowSuggestions(false)
  }

  const handleSuggestionClick = (suggestion: (typeof searchSuggestions)[0]) => {
    router.push(`/producto/${suggestion.id}`)
    setShowSuggestions(false)
    setSearchTerm("")
  }

  return (
    <>
      {/* Mobile Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden">
        <div className="flex items-center justify-between p-4 bg-background border-b border-mist border-opacity-10">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="10KCR Logo" width={100} height={40} />
          </Link>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-foreground p-2">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="bg-background border-b border-mist border-opacity-10 p-4 flex flex-col">
            {/* Búsqueda móvil */}
            <form onSubmit={handleSearch} className="mb-4 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" size={18} />
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full bg-background border border-mist border-opacity-20 rounded-md py-2 pl-10 pr-10 text-foreground focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary-dark"
                >
                  <ArrowRight size={18} />
                </button>
              </div>

              {showSuggestions && filteredSuggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-10 mt-1 w-full bg-background border border-mist border-opacity-20 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  {filteredSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="px-4 py-2 hover:bg-primary hover:bg-opacity-10 cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="font-medium">{suggestion.name}</div>
                      <div className="text-sm text-textSecondary">{suggestion.category}</div>
                    </div>
                  ))}
                </div>
              )}
            </form>

            <Link
              href="/"
              className={`nav-link ${isActive("/") ? "nav-link-active" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Home size={20} />
              Inicio
            </Link>
            <Link
              href="/trending"
              className={`nav-link ${isActive("/trending") ? "nav-link-active" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <TrendingUp size={20} />
              Tendencias
            </Link>
            <Link
              href="/categorias"
              className={`nav-link ${isActive("/categorias") ? "nav-link-active" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Grid size={20} />
              Categorías
            </Link>
            <Link
              href="/marcas"
              className={`nav-link ${isActive("/marcas") ? "nav-link-active" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Diamond size={20} />
              Marcas
            </Link>
            <Link
              href="/carrito"
              className={`nav-link ${isActive("/carrito") ? "nav-link-active" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <CartIndicator showText />
            </Link>
            <Link
              href="/busqueda"
              className={`nav-link ${isActive("/busqueda") ? "nav-link-active" : ""}`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Search size={20} />
              Buscar
            </Link>
            {user ? (
              <>
                <Link
                  href="/profile"
                  className={`nav-link ${isActive("/profile") ? "nav-link-active" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User size={20} />
                  {user.name}
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="nav-link text-left"
                >
                  <LogOut size={20} />
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={`nav-link ${isActive("/login") ? "nav-link-active" : ""}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LogIn size={20} />
                Iniciar Sesión
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Desktop Sidebar - Siempre visible */}
      <div
        className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-background border-r border-mist border-opacity-10 transition-all duration-300 ${
          isOpen ? "w-64" : "w-20"
        } z-50`}
      >
        {/* Logo y botón de toggle cuando está abierto */}
        {isOpen ? (
          <div className="flex items-center justify-between p-6">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" alt="10KCR Logo" width={120} height={48} />
            </Link>
            <button onClick={toggleSidebar} className="text-textSecondary hover:text-primary transition-colors z-20">
              <ChevronLeft size={20} />
            </button>
          </div>
        ) : (
          /* Solo logo cuando está cerrado - el botón se mueve abajo */
          <div className="flex justify-center items-center pt-4">
            <Link href="/">
              <div className="relative w-16 h-16">
                <Image src="/logo.png" alt="10KCR Logo" fill className="object-contain" />
              </div>
            </Link>
          </div>
        )}

        {/* Botón de toggle entre el logo y la navegación cuando está cerrado */}
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

        <nav className="flex flex-col space-y-2 mt-4">
          <Link
            href="/"
            className={`flex items-center ${isOpen ? "px-6 py-3" : "justify-center py-3"} ${
              isActive("/") ? "text-primary" : "text-textSecondary hover:text-primary"
            } transition-colors`}
          >
            <Home size={20} />
            {isOpen && <span className="ml-3">Inicio</span>}
          </Link>
          <Link
            href="/trending"
            className={`flex items-center ${isOpen ? "px-6 py-3" : "justify-center py-3"} ${
              isActive("/trending") ? "text-primary" : "text-textSecondary hover:text-primary"
            } transition-colors`}
          >
            <TrendingUp size={20} />
            {isOpen && <span className="ml-3">Tendencias</span>}
          </Link>
          <Link
            href="/categorias"
            className={`flex items-center ${isOpen ? "px-6 py-3" : "justify-center py-3"} ${
              isActive("/categorias") ? "text-primary" : "text-textSecondary hover:text-primary"
            } transition-colors`}
          >
            <Grid size={20} />
            {isOpen && <span className="ml-3">Categorías</span>}
          </Link>
          <Link
            href="/marcas"
            className={`flex items-center ${isOpen ? "px-6 py-3" : "justify-center py-3"} ${
              isActive("/marcas") ? "text-primary" : "text-textSecondary hover:text-primary"
            } transition-colors`}
          >
            <Diamond size={20} />
            {isOpen && <span className="ml-3">Marcas</span>}
          </Link>
          <Link
            href="/carrito"
            className={`flex items-center ${isOpen ? "px-6 py-3" : "justify-center py-3"} ${
              isActive("/carrito") ? "text-primary" : "text-textSecondary hover:text-primary"
            } transition-colors`}
          >
            <CartIndicator showText={isOpen} />
          </Link>

          {/* Búsqueda - ahora como último elemento */}
          {isOpen ? (
            <div className="relative px-6 mt-4 mb-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" size={18} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setShowSuggestions(true)
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full bg-background border border-mist border-opacity-20 rounded-md py-2 pl-10 pr-10 text-foreground focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary-dark"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </form>

              {showSuggestions && filteredSuggestions.length > 0 && (
                <div
                  ref={suggestionsRef}
                  className="absolute z-10 left-6 right-6 mt-1 bg-background border border-mist border-opacity-20 rounded-md shadow-lg max-h-60 overflow-auto"
                >
                  {filteredSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="px-4 py-2 hover:bg-primary hover:bg-opacity-10 cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="font-medium">{suggestion.name}</div>
                      <div className="text-sm text-textSecondary">{suggestion.category}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/busqueda"
              className={`flex items-center justify-center py-3 ${
                isActive("/busqueda") ? "text-primary" : "text-textSecondary hover:text-primary"
              } transition-colors`}
            >
              <Search size={20} />
            </Link>
          )}
        </nav>

        <div className="mt-auto mb-6">
          {user ? (
            <div className="flex flex-col gap-2">
              <Link
                href="/profile"
                className={`flex items-center ${
                  isOpen
                    ? "mx-6 gap-3 p-2 rounded-full border border-mist border-opacity-20 hover:border-primary"
                    : "justify-center"
                } transition-colors`}
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User size={16} className="text-background" />
                </div>
                {isOpen && <span>{user.name}</span>}
              </Link>
              {isOpen && (
                <button
                  onClick={handleLogout}
                  className="mx-6 flex items-center gap-3 p-2 text-textSecondary hover:text-primary transition-colors"
                >
                  <LogOut size={20} />
                  <span>Cerrar Sesión</span>
                </button>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className={`flex items-center ${
                isOpen
                  ? "mx-6 gap-3 p-2 rounded-full border border-mist border-opacity-20 hover:border-primary"
                  : "justify-center"
              } transition-colors`}
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <LogIn size={16} className="text-background" />
              </div>
              {isOpen && <span>Iniciar Sesión</span>}
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
