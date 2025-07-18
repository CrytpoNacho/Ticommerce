"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

interface CartIndicatorProps {
  showText?: boolean
}

export default function CartIndicator({ showText = false }: CartIndicatorProps) {
  const { cart } = useCart()

  return (
    <div className="relative flex items-center">
      <ShoppingCart size={20} />
      {cart && cart.totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-primary text-background text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {cart.totalItems > 99 ? "99+" : cart.totalItems}
        </span>
      )}
      {showText && <span className="ml-3">Carrito</span>}
    </div>
  )
}
