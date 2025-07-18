"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export interface SearchFilters {
  q?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: string
}

export interface SearchResult {
  id: number
  name: string
  description?: string
  price: number
  category?: string
  stock_quantity?: number
  created_at?: string
  seller_id?: number
  is_promoted?: boolean
  sellers?: {
    user_id: number
    seller_type: string
    users: { name: string }
  }
  primary_image?: string // importante para la imagen
}

export interface SearchResponse {
  products: SearchResult[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
  query: SearchFilters
}

interface CacheEntry {
  timestamp: number
  data: SearchResponse
}

const searchCache = new Map<string, CacheEntry>()
const CACHE_TTL = 60000 // 1 minuto

export function useSearch(initialFilters: SearchFilters = {}) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false,
  })
  const [filters, setFilters] = useState<SearchFilters>(initialFilters)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  const debounceRef = useRef<NodeJS.Timeout>()
  const abortControllerRef = useRef<AbortController>()

  const getCacheKey = (searchFilters: SearchFilters, append: boolean, offset: number) => {
    const filtersCopy = { ...searchFilters }
    const offsetValue = append ? offset + (pagination?.limit || 50) : 0
    return JSON.stringify({ ...filtersCopy, offset: offsetValue })
  }

  const search = useCallback(
    async (searchFilters: SearchFilters = {}, append = false, immediate = false) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()
      const finalFilters = { ...filters, ...searchFilters }

      const safeOffset = pagination?.offset || 0
      const safeLimit = pagination?.limit || 50
      const cacheKey = getCacheKey(finalFilters, append, safeOffset)
      const now = Date.now()

      const cachedResult = searchCache.get(cacheKey)
      if (cachedResult && now - cachedResult.timestamp < CACHE_TTL) {
        if (append) {
          setResults((prev) => [...prev, ...cachedResult.data.products])
          setPagination((prev) => ({
            ...cachedResult.data.pagination,
            offset: prev.offset + prev.limit,
          }))
        } else {
          setResults(cachedResult.data.products)
          setPagination(cachedResult.data.pagination)
        }
        setFilters(finalFilters)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        Object.entries(finalFilters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "" && value !== 0) {
            if (Array.isArray(value)) {
              if (value.length > 0) params.append(key, value.join(","))
            } else {
              params.append(key, value.toString())
            }
          }
        })

        params.set("offset", append ? (safeOffset + safeLimit).toString() : "0")
        params.set("limit", safeLimit.toString())

        const response = await fetch(`/api/search?${params.toString()}`, {
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          if (response.status === 429 && retryCount < maxRetries) {
            setRetryCount((prev) => prev + 1)
            setTimeout(() => {
              search(searchFilters, append, immediate)
            }, (retryCount + 1) * 1000)
            return
          }
          throw new Error(`Error en la búsqueda: ${response.status}`)
        }

        setRetryCount(0)
        const data: SearchResponse = await response.json()

        searchCache.set(cacheKey, { timestamp: now, data })

        if (append) {
          setResults((prev) => [...prev, ...data.products])
          setPagination((prev) => ({
            ...data.pagination,
            offset: prev.offset + prev.limit,
          }))
        } else {
          setResults(data.products)
          setPagination(data.pagination)
        }

        setFilters(finalFilters)
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return

        if (err instanceof Error && err.message.includes("Too Many")) {
          searchCache.forEach((entry) => {
            if (now - entry.timestamp < CACHE_TTL * 5) {
              if (append) {
                setResults((prev) => [...prev, ...entry.data.products])
              } else {
                setResults(entry.data.products)
                setPagination(entry.data.pagination)
              }
              return
            }
          })
        }

        setError(err instanceof Error ? err.message : "Error desconocido")
        console.error("Error searching:", err)
      } finally {
        setLoading(false)
      }
    },
    [filters, pagination, retryCount, maxRetries],
  )

  const debouncedSearch = useCallback(
    (searchFilters: SearchFilters = {}, delay = 500) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        search(searchFilters, false, true)
      }, delay)
    },
    [search],
  )

  const loadMore = useCallback(() => {
    if (pagination && pagination.hasMore && !loading) {
      search({}, true)
    }
  }, [pagination, loading, search])

  const resetSearch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (abortControllerRef.current) abortControllerRef.current.abort()

    setResults([])
    setPagination({ total: 0, limit: 50, offset: 0, hasMore: false })
    setFilters({})
    setError(null)
    setLoading(false)
    setRetryCount(0)
  }, [])

  const updateFilters = useCallback(
    (newFilters: SearchFilters, useDebounce = false) => {
      if (useDebounce) {
        debouncedSearch(newFilters)
      } else {
        search(newFilters, false)
      }
    },
    [debouncedSearch, search],
  )

  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      search(initialFilters)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      searchCache.forEach((entry, key) => {
        if (now - entry.timestamp > CACHE_TTL) {
          searchCache.delete(key)
        }
      })
    }, CACHE_TTL)

    return () => {
      clearInterval(interval)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      if (abortControllerRef.current) abortControllerRef.current.abort()
    }
  }, [])

  return {
    results,
    loading,
    error,
    pagination,
    filters,
    search,
    loadMore,
    resetSearch,
    updateFilters,
    debouncedSearch,
  }
}
