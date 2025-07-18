"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"

interface Product {
  id: string | number
  name: string
  description?: string
  price: number
  currency?: string
  category?: string
  seller_id?: number
  is_active?: boolean
  is_promoted?: boolean
  stock_quantity?: number
  created_at?: string
  primary_image?: string
  product_media?: Array<{
    id: number
    file_url: string
    file_name: string
    is_primary: boolean
  }>
}

interface ProductCardProps {
  product?: Product
  id?: string | number
  name?: string
  price?: number
  imageUrl?: string
}

export default function ProductCard({ product, id, name, price, imageUrl }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { addToCart } = useCart()

  // Usar product si está disponible, sino usar props individuales
  const productData = product || {
    id: id || "",
    name: name || "",
    price: price || 0,
    description: "",
    category: "",
    seller_id: 0,
    is_active: true,
    stock_quantity: 0,
    created_at: "",
  }

  // Verificar si el producto existe
  if (!productData || (!productData.id && !id)) {
    return null
  }

  const productId = productData.id || id
  const productName = productData.name || name || "Producto"
  const productPrice = productData.price || price || 0

  const handleCardClick = () => {
    router.push(`/producto/${productId}`)
  }

  const handleAddToCart = async (e: React.MouseEvent) => {
    // Detener la propagación del evento para evitar que se active el clic de la tarjeta
    e.stopPropagation()

    if (!productId) return

    const success = await addToCart(Number(productId), 1)

    // El toast ya se maneja en el hook useCart
    if (success) {
      console.log("Producto agregado al carrito:", productId)
    }
  }

  const getProductImage = () => {
    // Si hay primary_image, usarla
    if (productData.primary_image) {
      return productData.primary_image
    }

    // Si hay product_media, usar la primera
    if (productData.product_media && productData.product_media.length > 0) {
      return productData.product_media[0].file_url
    }

    // Fallback a placeholder
    return `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(productName)}`
  }

  const productImage = getProductImage()

  return (
    <div
      className={`relative bg-background rounded-lg overflow-hidden transition-all duration-300 ${
        isHovered ? "transform scale-105 shadow-[0_0_25px_rgba(212,175,55,0.5)] z-10" : "card-hover"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      {/* Overlay de enfoque */}
      {isHovered && <div className="fixed inset-0 bg-black bg-opacity-50 z-0" style={{ pointerEvents: "none" }} />}

      <div className="relative aspect-square overflow-hidden">
        <Image src={productImage || "/placeholder.svg"} alt={productName} fill className="object-cover" />
      </div>
      <div className="p-4 bg-card">
        <h3 className="text-background font-medium line-clamp-2">{productName}</h3>
        <div className="flex items-center justify-between mt-2">
          <p className="text-background font-serif text-lg">
            <span className="text-primary">₡</span>
            {productPrice ? productPrice.toLocaleString() : "0"}
          </p>
          <button
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-opacity-80 transition-all relative z-20"
            onClick={handleAddToCart}
            aria-label="Añadir al carrito"
          >
            <ShoppingCart size={18} className="text-background" />
          </button>
        </div>
      </div>
    </div>
  )
}
