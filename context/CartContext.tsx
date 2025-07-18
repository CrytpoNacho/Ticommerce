"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"

export interface CartItem {
  id: number
  quantity: number
  added_at: string
  updated_at: string
  products: {
    id: number
    name: string
    description?: string
    price: number
    category: string
    stock_quantity: number
    is_active: boolean
    brands?: {
      name: string
      slug: string
    }
  }
}

export interface CartSummary {
  items: CartItem[]
  totalItems: number
  subtotal: number
  itemCount: number
}

interface CartContextType {
  cart: CartSummary | null
  loading: boolean
  error: string | null
  addToCart: (productId: number, quantity?: number) => Promise<boolean>
  updateQuantity: (cartItemId: number, quantity: number) => Promise<boolean>
  removeFromCart: (cartItemId: number) => Promise<boolean>
  clearCart: () => Promise<boolean>
  refetch: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFetch, setLastFetch] = useState<number>(0)
  const { user } = useAuth()
  const { toast } = useToast()

  // Cache duration: 30 seconds
  const CACHE_DURATION = 30 * 1000

  // Cargar carrito del usuario con cache
  const fetchCart = useCallback(
    async (forceRefresh = false) => {
      if (!user?.id) {
        setCart(null)
        return
      }

      // Verificar cache
      const now = Date.now()
      if (!forceRefresh && lastFetch && now - lastFetch < CACHE_DURATION) {
        return // Usar datos en cache
      }

      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/cart?userId=${user.id}`)

        if (!response.ok) {
          // Si es un error 429 (Too Many Requests), esperar antes de reintentar
          if (response.status === 429) {
            console.warn("Rate limit reached, using cached data")
            return
          }
          throw new Error("Error al cargar el carrito")
        }

        const data = await response.json()
        setCart(data.cart)
        setLastFetch(now)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error desconocido"
        setError(errorMessage)
        console.error("Error fetching cart:", err)

        // No mostrar toast para errores de rate limit
        if (!errorMessage.includes("Too Many")) {
          toast({
            title: "Error",
            description: "No se pudo cargar el carrito",
            variant: "destructive",
          })
        }
      } finally {
        setLoading(false)
      }
    },
    [user?.id, lastFetch, toast],
  )

  // Agregar producto al carrito
  const addToCart = async (productId: number, quantity = 1) => {
    if (!user?.id) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar productos al carrito",
        variant: "destructive",
      })
      return false
    }

    try {
      setLoading(true)

      const response = await fetch("/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          productId,
          quantity,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al agregar al carrito")
      }

      // Actualizar carrito localmente para respuesta inmediata
      if (cart) {
        const existingItemIndex = cart.items.findIndex((item) => item.products.id === productId)

        if (existingItemIndex >= 0) {
          // Actualizar cantidad existente
          const updatedItems = [...cart.items]
          updatedItems[existingItemIndex].quantity += quantity

          const newCart = {
            ...cart,
            items: updatedItems,
            totalItems: cart.totalItems + quantity,
            subtotal: cart.subtotal + data.product.price * quantity,
          }
          setCart(newCart)
        } else {
          // Agregar nuevo item (simplificado - el fetch completo vendrá después)
          await fetchCart(true)
        }
      } else {
        await fetchCart(true)
      }

      toast({
        title: "Producto agregado",
        description: `${data.product.name} ha sido agregado al carrito`,
        variant: "success",
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMessage)

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })

      return false
    } finally {
      setLoading(false)
    }
  }

  // Actualizar cantidad de un item
  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (!user?.id) return false

    try {
      setLoading(true)

      const response = await fetch("/api/cart/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItemId,
          quantity,
          userId: user.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar cantidad")
      }

      // Actualizar carrito localmente
      if (cart) {
        const updatedItems = cart.items.map((item) => {
          if (item.id === cartItemId) {
            const oldQuantity = item.quantity
            const quantityDiff = quantity - oldQuantity
            const priceDiff = item.products.price * quantityDiff

            return { ...item, quantity }
          }
          return item
        })

        const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)
        const newSubtotal = updatedItems.reduce((sum, item) => sum + item.products.price * item.quantity, 0)

        setCart({
          ...cart,
          items: updatedItems,
          totalItems: newTotalItems,
          subtotal: newSubtotal,
        })
      }

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMessage)

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })

      return false
    } finally {
      setLoading(false)
    }
  }

  // Eliminar item del carrito
  const removeFromCart = async (cartItemId: number) => {
    if (!user?.id) return false

    try {
      setLoading(true)

      const response = await fetch(`/api/cart/remove?cartItemId=${cartItemId}&userId=${user.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar del carrito")
      }

      // Actualizar carrito localmente
      if (cart) {
        const removedItem = cart.items.find((item) => item.id === cartItemId)
        const updatedItems = cart.items.filter((item) => item.id !== cartItemId)

        if (removedItem) {
          const newTotalItems = cart.totalItems - removedItem.quantity
          const newSubtotal = cart.subtotal - removedItem.products.price * removedItem.quantity

          setCart({
            ...cart,
            items: updatedItems,
            totalItems: newTotalItems,
            subtotal: newSubtotal,
            itemCount: updatedItems.length,
          })
        }
      }

      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado del carrito",
        variant: "success",
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMessage)

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })

      return false
    } finally {
      setLoading(false)
    }
  }

  // Limpiar carrito completo
  const clearCart = async () => {
    if (!user?.id) return false

    try {
      setLoading(true)

      const response = await fetch(`/api/cart?userId=${user.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al limpiar el carrito")
      }

      setCart(null)

      toast({
        title: "Carrito limpiado",
        description: "Todos los productos han sido eliminados del carrito",
        variant: "success",
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMessage)

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })

      return false
    } finally {
      setLoading(false)
    }
  }

  // Cargar carrito cuando el usuario cambia
  useEffect(() => {
    if (user?.id) {
      fetchCart()
    } else {
      setCart(null)
      setLastFetch(0)
    }
  }, [user?.id]) // Solo depende del ID del usuario

  // Refetch periódico pero controlado
  useEffect(() => {
    if (!user?.id) return

    const interval = setInterval(
      () => {
        // Solo hacer fetch si han pasado más de 2 minutos desde el último
        const now = Date.now()
        if (now - lastFetch > 2 * 60 * 1000) {
          fetchCart()
        }
      },
      2 * 60 * 1000,
    ) // Cada 2 minutos

    return () => clearInterval(interval)
  }, [user?.id, lastFetch, fetchCart])

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refetch: () => fetchCart(true),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCartContext() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCartContext must be used within a CartProvider")
  }
  return context
}
