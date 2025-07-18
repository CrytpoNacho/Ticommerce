"use client"

import { useState, useEffect } from "react"

export interface Product {
  id: string | number
  name: string
  description?: string
  price: number
  category?: string
  seller_id?: number
  is_active?: boolean
  is_promoted?: boolean
  stock_quantity?: number
  created_at?: string
}

interface UseProductsOptions {
  category?: string
  limit?: number
  search?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  sortOrder?: "asc" | "desc"
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [
    options.category,
    options.limit,
    options.search,
    options.minPrice,
    options.maxPrice,
    options.sortBy,
    options.sortOrder,
  ])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()

      if (options.category) params.append("category", options.category)
      if (options.limit) params.append("limit", options.limit.toString())
      if (options.search) params.append("search", options.search)
      if (options.minPrice) params.append("minPrice", options.minPrice.toString())
      if (options.maxPrice) params.append("maxPrice", options.maxPrice.toString())
      if (options.sortBy) params.append("sortBy", options.sortBy)
      if (options.sortOrder) params.append("sortOrder", options.sortOrder)

      const response = await fetch(`/api/products?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Error al cargar productos")
      }

      const data = await response.json()

      // Verificar que los productos existan y sean un array
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products)
      } else {
        setProducts([])
        console.warn("No se encontraron productos o el formato de respuesta es incorrecto")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchProducts()
  }

  return {
    products,
    loading,
    error,
    refetch,
  }
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/products/${id}`)

      if (!response.ok) {
        throw new Error("Producto no encontrado")
      }

      const data = await response.json()

      if (data.product) {
        setProduct(data.product)
      } else {
        setProduct(null)
        console.warn("No se encontró el producto o el formato de respuesta es incorrecto")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
      console.error("Error fetching product:", err)
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchProduct()
  }

  return {
    product,
    loading,
    error,
    refetch,
  }
}
