"use client"

import { useState, useEffect, useRef } from "react"
import ProductCard from "./ProductCard"

// Datos de ejemplo para productos
const generateProducts = (start: number, count: number) => {
  return Array.from({ length: count }).map((_, index) => ({
    id: `infinite-${start + index}`,
    name: `Producto ${start + index}`,
    price: Math.floor(Math.random() * 90000) + 10000, // Precio entre 10000 y 100000
    imageUrl: `/placeholder.svg?height=300&width=300&query=luxury+product+${(start + index) % 10}`,
  }))
}

export default function InfiniteProductScroll() {
  const [products, setProducts] = useState(generateProducts(1, 6))
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreProducts()
        }
      },
      { threshold: 1.0 },
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [hasMore, loading])

  const loadMoreProducts = async () => {
    setLoading(true)

    // Simular carga de datos con un retraso
    await new Promise((resolve) => setTimeout(resolve, 800))

    const nextPage = page + 1
    const newProducts = generateProducts(nextPage * 6 - 5, 6)

    setProducts((prevProducts) => [...prevProducts, ...newProducts])
    setPage(nextPage)

    // Limitar a 5 páginas para este ejemplo
    if (nextPage >= 5) {
      setHasMore(false)
    }

    setLoading(false)
  }

  return (
    <div className="py-12">
      <h2 className="text-4xl font-serif mb-8">Descubre más</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            imageUrl={product.imageUrl}
          />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center mt-8">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {hasMore && <div ref={observerTarget} className="h-10 mt-4"></div>}

      {!hasMore && <div className="text-center mt-8 text-textSecondary">Has llegado al final de los productos</div>}
    </div>
  )
}
