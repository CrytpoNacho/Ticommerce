"use client"

import { useState, useEffect } from "react"

export interface Category {
  id: string
  label: string
  value: string
}

export function useCategoriesDynamic() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/search/categories")

        if (!response.ok) {
          throw new Error("Error al cargar categorías")
        }

        const data = await response.json()
        setCategories(data.categories || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido")
        console.error("Error fetching categories:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}
