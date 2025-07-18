"use client"

import { useEffect, useCallback } from "react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/hooks/use-toast"
import { useCartContext } from "@/context/CartContext"

// Re-export the context hook with the expected name
export function useCart() {
  return useCartContext()
}

export function useCartHook() {
  const cartContext = useCart()
  const { user } = useAuth()
  const { toast } = useToast()

  // Cargar carrito del usuario
  const fetchCart = useCallback(async () => {
    if (!user?.id) {
      cartContext.setCart(null)
      return
    }

    try {
      cartContext.setLoading(true)
      cartContext.setError(null)

      const response = await fetch(`/api/cart?userId=${user.id}`)

      if (!response.ok) {
        throw new Error("Error al cargar el carrito")
      }

      const data = await response.json()
      cartContext.setCart(data.cart)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      cartContext.setError(errorMessage)
      console.error("Error fetching cart:", err)
    } finally {
      cartContext.setLoading(false)
    }
  }, [user?.id, cartContext])

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
      cartContext.setLoading(true)

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

      // Recargar carrito
      await fetchCart()

      toast({
        title: "Producto agregado",
        description: `${data.product.name} ha sido agregado al carrito`,
        variant: "success",
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      cartContext.setError(errorMessage)

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })

      return false
    } finally {
      cartContext.setLoading(false)
    }
  }

  // Actualizar cantidad de un item
  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (!user?.id) return false

    try {
      cartContext.setLoading(true)

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

      // Recargar carrito
      await fetchCart()

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      cartContext.setError(errorMessage)

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })

      return false
    } finally {
      cartContext.setLoading(false)
    }
  }

  // Eliminar item del carrito
  const removeFromCart = async (cartItemId: number) => {
    if (!user?.id) return false

    try {
      cartContext.setLoading(true)

      const response = await fetch(`/api/cart/remove?cartItemId=${cartItemId}&userId=${user.id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar del carrito")
      }

      // Recargar carrito
      await fetchCart()

      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado del carrito",
        variant: "success",
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      cartContext.setError(errorMessage)

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })

      return false
    } finally {
      cartContext.setLoading(false)
    }
  }

  // Limpiar carrito completo
  const clearCart = async () => {
    if (!user?.id) return false

    try {
      cartContext.setLoading(true)

      const response = await fetch(`/api/cart?userId=${user.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al limpiar el carrito")
      }

      cartContext.setCart(null)

      toast({
        title: "Carrito limpiado",
        description: "Todos los productos han sido eliminados del carrito",
        variant: "success",
      })

      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      cartContext.setError(errorMessage)

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })

      return false
    } finally {
      cartContext.setLoading(false)
    }
  }

  // Cargar carrito cuando el usuario cambia
  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  return {
    ...cartContext,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refetch: fetchCart,
  }
}
