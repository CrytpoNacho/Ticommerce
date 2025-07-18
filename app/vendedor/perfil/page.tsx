"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User, Edit, Save, X, Shield, Store } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import VendorNavbarWrapper from "@/components/VendorNavbarWrapper"

export default function VendorProfile() {
  const { user, isVendor } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
    businessType: "",
    description: "",
  })

  useEffect(() => {
    // Verificar si el usuario está autenticado y es vendedor
    if (!user) {
      router.push("/login")
      return
    }

    if (!isVendor()) {
      router.push("/")
      return
    }

    // Cargar datos del usuario
    setFormData({
      name: user.name || "",
      email: user.email || "",
      phone: "+1 234 567 8900", // Datos de ejemplo
      businessName: "Mi Negocio Premium",
      businessType: "Joyería y Accesorios",
      description: "Especialistas en productos de lujo y alta calidad.",
    })

    setLoading(false)
  }, [user, isVendor, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios
    console.log("Guardando cambios:", formData)
    setIsEditing(false)
    // Mostrar mensaje de éxito
  }

  const handleCancel = () => {
    // Restaurar datos originales
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: "+1 234 567 8900",
      businessName: "Mi Negocio Premium",
      businessType: "Joyería y Accesorios",
      description: "Especialistas en productos de lujo y alta calidad.",
    })
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <main>
      <VendorNavbarWrapper />
      <div className="lg:ml-20 min-h-screen">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif mb-2">Mi Perfil</h1>
              <p className="text-textSecondary">Gestiona tu información personal y de negocio</p>
            </div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 md:mt-0 flex items-center bg-primary text-background px-4 py-2 rounded-md hover:bg-opacity-90 transition-all"
              >
                <Edit size={18} className="mr-2" />
                Editar Perfil
              </button>
            ) : (
              <div className="mt-4 md:mt-0 flex gap-2">
                <button
                  onClick={handleSave}
                  className="flex items-center bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition-all"
                >
                  <Save size={18} className="mr-2" />
                  Guardar
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-all"
                >
                  <X size={18} className="mr-2" />
                  Cancelar
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Información Personal */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-background border border-mist border-opacity-20 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary bg-opacity-10 rounded-full">
                    <User size={20} className="text-primary" />
                  </div>
                  <h2 className="text-xl font-medium">Información Personal</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">Nombre Completo</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-mist border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{formData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">Correo Electrónico</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-mist border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{formData.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">Teléfono</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-mist border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{formData.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">Fecha de Registro</label>
                    <p className="text-foreground font-medium">15 de Mayo, 2023</p>
                  </div>
                </div>
              </div>

              {/* Información del Negocio */}
              <div className="bg-background border border-mist border-opacity-20 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-emerald-500 bg-opacity-10 rounded-full">
                    <Store size={20} className="text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-medium">Información del Negocio</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">Nombre del Negocio</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-mist border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    ) : (
                      <p className="text-foreground font-medium">{formData.businessName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">Tipo de Negocio</label>
                    {isEditing ? (
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-mist border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="Joyería y Accesorios">Joyería y Accesorios</option>
                        <option value="Ropa y Moda">Ropa y Moda</option>
                        <option value="Electrónicos">Electrónicos</option>
                        <option value="Hogar y Decoración">Hogar y Decoración</option>
                        <option value="Deportes y Fitness">Deportes y Fitness</option>
                        <option value="Otros">Otros</option>
                      </select>
                    ) : (
                      <p className="text-foreground font-medium">{formData.businessType}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-textSecondary mb-2">Descripción del Negocio</label>
                    {isEditing ? (
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-mist border-opacity-20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    ) : (
                      <p className="text-foreground">{formData.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Panel Lateral */}
            <div className="space-y-6">
              {/* Estado de la Cuenta */}
              <div className="bg-background border border-mist border-opacity-20 rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-emerald-500 bg-opacity-10 rounded-full">
                    <Shield size={20} className="text-emerald-500" />
                  </div>
                  <h3 className="text-lg font-medium">Estado de la Cuenta</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-textSecondary">Estado</span>
                    <span className="text-emerald-500 font-medium">Activa</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-textSecondary">Plan</span>
                    <span className="text-primary font-medium">Básico</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-textSecondary">Verificación</span>
                    <span className="text-emerald-500 font-medium">Verificado</span>
                  </div>
                </div>
              </div>

              {/* Estadísticas Rápidas */}
              <div className="bg-background border border-mist border-opacity-20 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-medium mb-4">Resumen de Actividad</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-textSecondary">Productos</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-textSecondary">Ventas</span>
                    <span className="font-medium">47</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-textSecondary">Ingresos</span>
                    <span className="font-medium">$2,450</span>
                  </div>
                </div>
              </div>

              {/* Acciones Rápidas */}
              <div className="bg-primary bg-opacity-5 border border-primary border-opacity-20 rounded-lg p-6">
                <h3 className="text-lg font-medium text-primary mb-4">Acciones Rápidas</h3>
                <div className="space-y-2">
                  <button className="w-full text-left text-sm text-textSecondary hover:text-primary transition-colors">
                    Cambiar contraseña →
                  </button>
                  <button className="w-full text-left text-sm text-textSecondary hover:text-primary transition-colors">
                    Configurar notificaciones →
                  </button>
                  <button className="w-full text-left text-sm text-textSecondary hover:text-primary transition-colors">
                    Descargar datos →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
