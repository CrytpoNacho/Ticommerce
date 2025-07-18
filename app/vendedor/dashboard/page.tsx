"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Package,
  DollarSign,
  Users,
  ShoppingBag,
  PlusCircle,
  BarChart2,
  Clock,
  AlertCircle,
  TrendingUp,
  Eye,
  MousePointer,
} from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import VendorNavbarWrapper from "@/components/VendorNavbarWrapper"

export default function VendedorDashboard() {
  const { user, isVendor } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("🔍 VendorDashboard - Verificando acceso:")
    console.log("  - Usuario actual:", user)
    console.log("  - Es vendedor?:", isVendor())

    // Verificar si el usuario está autenticado
    if (!user) {
      console.log("❌ No hay usuario autenticado - Redirigiendo al login")
      router.push("/login")
      return
    }

    // Verificar si es vendedor
    if (!isVendor()) {
      console.log("❌ ACCESO DENEGADO - Usuario no es vendedor")
      console.log("  - Nombre:", user.name)
      console.log("  - Email:", user.email)
      console.log("  - UserType:", user.userType)
      console.log("  - Redirigiendo al inicio...")

      // Mostrar alerta y redirigir
      alert("Acceso denegado. No tienes permisos de vendedor.")
      router.push("/")
      return
    }

    console.log("✅ Acceso autorizado para vendedor")
    setLoading(false)
  }, [user, isVendor, router])

  // Si no es vendedor, mostrar mensaje de error
  if (user && !isVendor()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg border-2 border-red-200">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acceso Denegado</h1>
          <p className="text-gray-600 mb-4">No tienes permisos para acceder al portal de vendedor.</p>
          <p className="text-sm text-gray-500 mb-6">
            Tu rol actual: <strong>{user.userType}</strong>
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-textSecondary">Verificando permisos de vendedor...</p>
        </div>
      </div>
    )
  }

  // Datos de ejemplo para el dashboard
  const dashboardData = {
    totalProducts: 12,
    pendingOrders: 5,
    totalSales: 2450,
    totalCustomers: 18,
    monthlyVisits: 1250,
    conversionRate: 3.2,
    recentOrders: [
      { id: 1, customer: "Juan Pérez", amount: 350, status: "Pendiente", date: "2023-06-05" },
      { id: 2, customer: "María López", amount: 520, status: "Completado", date: "2023-06-04" },
      { id: 3, customer: "Carlos Rodríguez", amount: 180, status: "Enviado", date: "2023-06-03" },
    ],
    lowStockProducts: [
      { id: 1, name: "Reloj de Oro", stock: 2, price: 1200 },
      { id: 2, name: "Pulsera de Plata", stock: 3, price: 350 },
    ],
  }

  return (
    <main>
      <VendorNavbarWrapper />
      <div className="lg:ml-20 min-h-screen">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif mb-2">Dashboard de Vendedor</h1>
              <p className="text-textSecondary">Bienvenido de nuevo, {user?.name}</p>
              <p className="text-xs text-gray-400">Rol: {user?.userType}</p>
            </div>
            <button
              onClick={() => router.push("/vendedor/productos/crear")}
              className="mt-4 md:mt-0 flex items-center bg-primary text-background px-4 py-2 rounded-md hover:bg-opacity-90 transition-all"
            >
              <PlusCircle size={18} className="mr-2" />
              Nuevo Producto
            </button>
          </div>

          {/* Tarjetas de estadísticas principales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-background border border-mist border-opacity-20 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Productos</h3>
                <div className="p-2 bg-primary bg-opacity-10 rounded-full">
                  <Package size={20} className="text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold">{dashboardData.totalProducts}</p>
              <p className="text-textSecondary text-sm mt-2">Total de productos</p>
            </div>

            <div className="bg-background border border-mist border-opacity-20 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Pedidos</h3>
                <div className="p-2 bg-amber-500 bg-opacity-10 rounded-full">
                  <ShoppingBag size={20} className="text-amber-500" />
                </div>
              </div>
              <p className="text-3xl font-bold">{dashboardData.pendingOrders}</p>
              <p className="text-textSecondary text-sm mt-2">Pedidos pendientes</p>
            </div>

            <div className="bg-background border border-mist border-opacity-20 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Ventas</h3>
                <div className="p-2 bg-emerald-500 bg-opacity-10 rounded-full">
                  <DollarSign size={20} className="text-emerald-500" />
                </div>
              </div>
              <p className="text-3xl font-bold">${dashboardData.totalSales}</p>
              <p className="text-textSecondary text-sm mt-2">Ingresos totales</p>
            </div>

            <div className="bg-background border border-mist border-opacity-20 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Clientes</h3>
                <div className="p-2 bg-blue-500 bg-opacity-10 rounded-full">
                  <Users size={20} className="text-blue-500" />
                </div>
              </div>
              <p className="text-3xl font-bold">{dashboardData.totalCustomers}</p>
              <p className="text-textSecondary text-sm mt-2">Clientes totales</p>
            </div>
          </div>

          {/* Estadísticas adicionales */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-background border border-mist border-opacity-20 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Visitas</h3>
                <div className="p-2 bg-purple-500 bg-opacity-10 rounded-full">
                  <Eye size={20} className="text-purple-500" />
                </div>
              </div>
              <p className="text-2xl font-bold">{dashboardData.monthlyVisits}</p>
              <p className="text-textSecondary text-sm mt-2">Este mes</p>
            </div>

            <div className="bg-background border border-mist border-opacity-20 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Conversión</h3>
                <div className="p-2 bg-indigo-500 bg-opacity-10 rounded-full">
                  <MousePointer size={20} className="text-indigo-500" />
                </div>
              </div>
              <p className="text-2xl font-bold">{dashboardData.conversionRate}%</p>
              <p className="text-textSecondary text-sm mt-2">Tasa de conversión</p>
            </div>

            <div className="bg-background border border-mist border-opacity-20 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Crecimiento</h3>
                <div className="p-2 bg-green-500 bg-opacity-10 rounded-full">
                  <TrendingUp size={20} className="text-green-500" />
                </div>
              </div>
              <p className="text-2xl font-bold">+12%</p>
              <p className="text-textSecondary text-sm mt-2">vs mes anterior</p>
            </div>
          </div>

          {/* Gráfico y Pedidos Recientes */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 bg-background border border-mist border-opacity-20 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium">Resumen de Ventas</h3>
                <div className="flex items-center text-textSecondary text-sm">
                  <BarChart2 size={16} className="mr-1" />
                  Últimos 30 días
                </div>
              </div>
              <div className="h-64 flex items-center justify-center border-t border-mist border-opacity-10 pt-6">
                <div className="text-center text-textSecondary">
                  <p className="mb-2">Gráfico de ventas en desarrollo</p>
                  <p className="text-sm">Próximamente podrás ver tus estadísticas aquí</p>
                </div>
              </div>
            </div>

            <div className="bg-background border border-mist border-opacity-20 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-medium">Pedidos Recientes</h3>
                <div className="flex items-center text-textSecondary text-sm">
                  <Clock size={16} className="mr-1" />
                  Últimos 7 días
                </div>
              </div>
              <div className="space-y-4">
                {dashboardData.recentOrders.map((order) => (
                  <div key={order.id} className="border-b border-mist border-opacity-10 pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-textSecondary">{order.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${order.amount}</p>
                        <p
                          className={`text-sm ${
                            order.status === "Completado"
                              ? "text-emerald-500"
                              : order.status === "Enviado"
                                ? "text-blue-500"
                                : "text-amber-500"
                          }`}
                        >
                          {order.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Productos con poco stock */}
          <div className="bg-background border border-mist border-opacity-20 rounded-lg p-6 shadow-sm mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-medium">Productos con Poco Stock</h3>
              <div className="flex items-center text-amber-500 text-sm">
                <AlertCircle size={16} className="mr-1" />
                Requieren atención
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-mist border-opacity-10">
                    <th className="text-left py-3 px-4 font-medium">Producto</th>
                    <th className="text-center py-3 px-4 font-medium">Stock</th>
                    <th className="text-right py-3 px-4 font-medium">Precio</th>
                    <th className="text-right py-3 px-4 font-medium">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.lowStockProducts.map((product) => (
                    <tr key={product.id} className="border-b border-mist border-opacity-10">
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4 text-center text-amber-500">{product.stock}</td>
                      <td className="py-3 px-4 text-right">${product.price}</td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-primary hover:underline text-sm">Actualizar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mensaje de desarrollo */}
          <div className="bg-primary bg-opacity-5 border border-primary border-opacity-20 rounded-lg p-6 text-center">
            <h3 className="text-xl font-medium text-primary mb-2">Panel de Vendedor Autorizado</h3>
            <p className="text-textSecondary mb-4">
              Acceso confirmado para vendedor: {user?.name} ({user?.email})
            </p>
            <p className="text-xs text-gray-400">UserType: {user?.userType}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
