"use client"

import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import NavbarWrapper from "@/components/NavbarWrapper"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/context/AuthContext"

export default function CartPage() {
  const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null // No renderizar nada mientras redirige
  }

  if (loading) {
    return (
      <main>
        <NavbarWrapper />
        <div className="lg:ml-20 transition-all duration-300 min-h-screen">
          <div className="container mx-auto px-4 py-12">
            <h1 className="text-3xl md:text-4xl font-serif mb-8">Carrito de Compras</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-background border border-mist border-opacity-10 rounded-lg p-6">
                  <div className="animate-pulse space-y-4">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={index} className="flex items-center py-4">
                        <div className="w-16 h-16 bg-mist bg-opacity-20 rounded"></div>
                        <div className="ml-4 flex-1">
                          <div className="h-4 bg-mist bg-opacity-20 rounded mb-2"></div>
                          <div className="h-3 bg-mist bg-opacity-20 rounded w-1/2"></div>
                        </div>
                        <div className="w-20 h-8 bg-mist bg-opacity-20 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-background border border-mist border-opacity-10 rounded-lg p-6">
                  <div className="animate-pulse">
                    <div className="h-6 bg-mist bg-opacity-20 rounded mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-mist bg-opacity-20 rounded"></div>
                      <div className="h-4 bg-mist bg-opacity-20 rounded"></div>
                      <div className="h-6 bg-mist bg-opacity-20 rounded"></div>
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

  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    await updateQuantity(cartItemId, newQuantity)
  }

  const handleRemoveItem = async (cartItemId: number) => {
    await removeFromCart(cartItemId)
  }

  const handleClearCart = async () => {
    if (window.confirm("¿Estás seguro de que quieres eliminar todos los productos del carrito?")) {
      await clearCart()
    }
  }

  // Generar imagen placeholder para productos
  const getProductImage = (product: any) => {
    return `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(product.name || "product")}`
  }

  return (
    <main>
      <NavbarWrapper />
      <div className="lg:ml-20 transition-all duration-300 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl md:text-4xl font-serif">Carrito de Compras</h1>
            {cart && cart.itemCount > 0 && (
              <button
                onClick={handleClearCart}
                className="text-error hover:text-error hover:opacity-80 transition-colors text-sm"
              >
                Limpiar carrito
              </button>
            )}
          </div>

          {cart && cart.itemCount > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-background border border-mist border-opacity-10 rounded-lg overflow-hidden">
                  <div className="p-6">
                    <h2 className="text-xl font-medium mb-4">
                      Productos ({cart.itemCount}) - {cart.totalItems}{" "}
                      {cart.totalItems === 1 ? "artículo" : "artículos"}
                    </h2>

                    <div className="divide-y divide-mist divide-opacity-10">
                      {cart.items.map((item) => (
                        <div key={item.id} className="py-4 flex items-center">
                          <div className="relative w-16 h-16 rounded-md overflow-hidden">
                            <Image
                              src={getProductImage(item.products) || "/placeholder.svg"}
                              alt={item.products.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="ml-4 flex-1">
                            <h3 className="font-medium">{item.products.name}</h3>
                            <p className="text-textSecondary text-sm">₡{item.products.price.toLocaleString()}</p>
                            {item.products.brands && (
                              <p className="text-textSecondary text-xs">Marca: {item.products.brands.name}</p>
                            )}
                            <p className="text-textSecondary text-xs">
                              Stock disponible: {item.products.stock_quantity}
                            </p>
                          </div>

                          <div className="flex items-center mx-4">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 rounded-full border border-mist border-opacity-20 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus size={16} className="text-textSecondary" />
                            </button>
                            <span className="mx-3 min-w-[2rem] text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.products.stock_quantity}
                              className="w-8 h-8 rounded-full border border-mist border-opacity-20 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus size={16} className="text-textSecondary" />
                            </button>
                          </div>

                          <div className="ml-6 text-right">
                            <p className="font-medium">₡{(item.products.price * item.quantity).toLocaleString()}</p>
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-error mt-1 flex items-center text-sm hover:opacity-80 transition-opacity"
                            >
                              <Trash2 size={14} className="mr-1" />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-background border border-mist border-opacity-10 rounded-lg p-6 sticky top-4">
                  <h2 className="text-xl font-medium mb-4">Resumen del pedido</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-textSecondary">
                        Subtotal ({cart.totalItems} {cart.totalItems === 1 ? "artículo" : "artículos"})
                      </span>
                      <span>₡{cart.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-textSecondary">Envío</span>
                      <span className="text-success">Gratis</span>
                    </div>
                    <div className="border-t border-mist border-opacity-10 pt-3 flex justify-between font-medium text-lg">
                      <span>Total</span>
                      <span>₡{cart.subtotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button className="w-full btn-primary mb-4">Proceder al Pago</button>

                  <div className="text-center">
                    <Link href="/" className="text-primary text-sm hover:underline">
                      Continuar Comprando
                    </Link>
                  </div>

                  <div className="mt-6 p-4 bg-primary bg-opacity-5 rounded-lg border border-primary border-opacity-20">
                    <p className="text-center text-primary text-sm">✨ Carrito conectado a la base de datos ✨</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-mist bg-opacity-10 flex items-center justify-center">
                <ShoppingBag size={40} className="text-textSecondary" />
              </div>
              <h2 className="text-2xl font-serif mb-4">Tu carrito está vacío</h2>
              <p className="text-textSecondary text-lg mb-6">Agrega algunos productos para comenzar tu compra</p>
              <Link href="/" className="btn-primary">
                Explorar Productos
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
