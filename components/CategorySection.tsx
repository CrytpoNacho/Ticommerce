"use client"

import Link from "next/link"
import { useCategories } from "@/hooks/use-categories"

export default function CategorySection() {
  const { categories, loading, error } = useCategories({ includeProductCount: true })

  if (loading) {
    return (
      <div className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-serif">Categorías</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-background border border-mist border-opacity-20 rounded-lg p-4 animate-pulse"
            >
              <div className="h-6 bg-mist bg-opacity-20 rounded mb-2"></div>
              <div className="h-4 bg-mist bg-opacity-20 rounded w-2/3"></div>
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
          <h2 className="text-4xl font-serif">Categorías</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-error">Error al cargar categorías: {error}</p>
        </div>
      </div>
    )
  }

  // Mostrar solo las primeras 6 categorías en la página principal
  const displayCategories = categories.slice(0, 6)

  return (
    <div className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-serif">Categorías</h2>
        <Link href="/categorias" className="btn-primary btn-shine text-sm">
          Ver todo
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {displayCategories.map((category) => (
          <Link
            key={category.id}
            href={`/categorias/${category.slug}`}
            className="bg-background border border-mist border-opacity-20 rounded-lg p-4 text-center hover:border-primary transition-all"
          >
            <span className="text-lg block mb-1">{category.name}</span>
            {category.product_count !== undefined && (
              <span className="text-textSecondary text-sm">{category.product_count} productos</span>
            )}
          </Link>
        ))}
      </div>
      {categories.length === 0 && (
        <div className="text-center py-8">
          <p className="text-textSecondary">No hay categorías disponibles en este momento.</p>
        </div>
      )}
    </div>
  )
}
