"use client"

import { useState, useEffect } from "react"

export interface Brand {
  id: string | number
  name: string
  slug: string
  description?: string
  image_url?: string
  website_url?: string
  is_active?: boolean
  product_count?: number
  sample_products?: Array<{
    id: string | number
    name: string
    price: number
    description?: string
  }>
  created_at?: string
}

interface UseBrandsOptions {
  includeProductCount?: boolean
  isActive?: boolean
  limit?: number
}

export function useBrands(options: UseBrandsOptions = {}) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBrands()
  }, [options.includeProductCount, options.isActive, options.limit])

  const fetchBrands = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.includeProductCount) {
        params.append("includeProductCount", "true")
      }
      if (options.isActive !== undefined) {
        params.append("isActive", options.isActive.toString())
      }
      if (options.limit) {
        params.append("limit", options.limit.toString())
      }

      const response = await fetch(`/api/brands?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Error al cargar marcas")
      }

      const data = await response.json()

      if (data.brands && Array.isArray(data.brands)) {
        setBrands(data.brands)
      } else {
        setBrands([])
        console.warn("No se encontraron marcas o el formato de respuesta es incorrecto")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
      console.error("Error fetching brands:", err)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchBrands()
  }

  return {
    brands,
    loading,
    error,
    refetch,
  }
}

export function useBrand(slug: string) {
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    fetchBrand()
  }, [slug])

  const fetchBrand = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/brands/${slug}`)

      if (!response.ok) {
        throw new Error("Marca no encontrada")
      }

      const data = await response.json()

      if (data.brand) {
        setBrand(data.brand)
      } else {
        setBrand(null)
        console.warn("No se encontró la marca o el formato de respuesta es incorrecto")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
      console.error("Error fetching brand:", err)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchBrand()
  }

  return {
    brand,
    loading,
    error,
    refetch,
  }
}
