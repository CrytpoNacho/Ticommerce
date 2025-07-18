"use client"

import { useState, useEffect } from "react"
import type { SearchResult } from "./use-search"

export function useRecommendedProducts(limit = 50) {
  const [products, setProducts] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/search?recommended=true&limit=${limit}`)

        if (!response.ok) {
          throw new Error("Error al cargar productos recomendados")
        }

        const data = await response.json()
        setProducts(data.products || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
        console.error("Error fetching recommended products:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendedProducts()
  }, [limit])

  return { products, loading, error }
}
