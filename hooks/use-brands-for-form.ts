"use client"

import { useState, useEffect } from "react"

interface Brand {
  id: number
  name: string
  slug: string
  description?: string
  image_url?: string
}

export function useBrandsForForm() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/brands")
      if (!response.ok) {
        throw new Error("Error al cargar marcas")
      }

      const data = await response.json()
      setBrands(data.brands || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
      setBrands([])
    } finally {
      setLoading(false)
    }
  }

  return { brands, loading, error, refetch: fetchBrands }
}
