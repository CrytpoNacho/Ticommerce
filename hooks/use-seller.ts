"use client"

import { useState, useEffect } from "react"

export interface Seller {
  user_id: number
  seller_type: string
  profile_picture_url?: string
  landing_description?: string
  social_links?: string
  fe_active: boolean
  users: {
    id: number
    name: string
    email: string
    role: string
  }
}

export interface SellerStats {
  rating: number
  reviewCount: number
  positiveResponseRate: number
  totalSales: number
}

export interface SellerProduct {
  id: number | string
  name: string
  description?: string
  price: number
  category?: string
  is_active?: boolean
  is_promoted?: boolean
  stock_quantity?: number
  created_at?: string
}

export function useSeller(id: string) {
  const [seller, setSeller] = useState<Seller | null>(null)
  const [products, setProducts] = useState<SellerProduct[]>([])
  const [stats, setStats] = useState<SellerStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    fetchSeller()
  }, [id])

  const fetchSeller = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔍 Fetching seller data for ID:", id)

      const response = await fetch(`/api/sellers/${id}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Vendedor no encontrado")
      }

      const data = await response.json()

      console.log("✅ Seller data received:", data)

      if (data.seller) {
        setSeller(data.seller)
        setProducts(data.products || [])
        setStats(data.stats || null)
      } else {
        throw new Error("Formato de respuesta incorrecto")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      setError(errorMessage)
      console.error("❌ Error fetching seller:", err)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchSeller()
  }

  return {
    seller,
    products,
    stats,
    loading,
    error,
    refetch,
  }
}
