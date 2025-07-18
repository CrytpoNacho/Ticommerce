"use client"

import Link from "next/link"
import ProductCard from "./ProductCard"
import { useProducts } from "@/hooks/use-products"

interface FeaturedProductsProps {
  title: string
  viewAllLink?: string
  category?: string
  limit?: number
}

export default function FeaturedProducts({
  title,
  viewAllLink = "/nuevos-productos",
  category,
  limit = 6,
}: FeaturedProductsProps) {
  const { products, loading, error } = useProducts({
    category,
    limit,
    sortBy: "created_at",
    sortOrder: "desc",
  })

  if (loading) {
    return (
      <div className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-serif">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="bg-background rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-square bg-mist bg-opacity-20"></div>
              <div className="p-4">
                <div className="h-4 bg-mist bg-opacity-20 rounded mb-2"></div>
                <div className="h-6 bg-mist bg-opacity-20 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-serif">{title}</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-error">Error al cargar productos: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-serif">{title}</h2>
        {viewAllLink && (
          <Link href={viewAllLink} className="btn-primary btn-shine text-sm">
            Ver todo
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-textSecondary">No hay productos disponibles en este momento.</p>
        </div>
      )}
    </div>
  )
}
