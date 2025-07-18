"use client"

import { useState, useEffect } from "react"

export interface Category {
  id: string | number
  name: string
  slug: string
  description?: string
  product_count?: number
  created_at?: string
}

interface UseCategoriesOptions {
  includeProductCount?: boolean
}

export function useCategories(options: UseCategoriesOptions = {}) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [options.includeProductCount])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (options.includeProductCount) {
        params.append("includeProductCount", "true")
      }

      const response = await fetch(`/api/categories?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Error al cargar categorías")
      }

      const data = await response.json()

      if (data.categories && Array.isArray(data.categories)) {
        setCategories(data.categories)
      } else {
        setCategories([])
        console.warn("No se encontraron categorías o el formato de respuesta es incorrecto")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
      console.error("Error fetching categories:", err)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchCategories()
  }

  return {
    categories,
    loading,
    error,
    refetch,
  }
}

export function useCategory(slug: string) {
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    fetchCategory()
  }, [slug])

  const fetchCategory = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/categories/${slug}`)

      if (!response.ok) {
        throw new Error("Categoría no encontrada")
      }

      const data = await response.json()

      if (data.category) {
        setCategory(data.category)
      } else {
        setCategory(null)
        console.warn("No se encontró la categoría o el formato de respuesta es incorrecto")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
      console.error("Error fetching category:", err)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchCategory()
  }

  return {
    category,
    loading,
    error,
    refetch,
  }
}
