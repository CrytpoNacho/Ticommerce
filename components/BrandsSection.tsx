"use client"

import Image from "next/image"
import Link from "next/link"
import { useBrands } from "@/hooks/use-brands"

export default function BrandsSection() {
  const { brands, loading, error } = useBrands({
    includeProductCount: true,
    isActive: true,
    limit: 6,
  })

  if (loading) {
    return (
      <div className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-serif">Marcas</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-background border border-mist border-opacity-20 rounded-lg p-6 animate-pulse"
            >
              <div className="w-16 h-16 bg-mist bg-opacity-20 rounded mb-4 mx-auto"></div>
              <div className="h-4 bg-mist bg-opacity-20 rounded"></div>
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
          <h2 className="text-4xl font-serif">Marcas</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-error">Error al cargar marcas: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-serif">Marcas</h2>
        <Link href="/marcas" className="btn-primary btn-shine text-sm">
          Ver todo
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/marcas/${brand.slug}`}
            className="bg-background border border-mist border-opacity-20 rounded-lg p-6 text-center hover:border-primary transition-all flex flex-col items-center justify-center gap-4"
          >
            <div className="relative w-16 h-16 mb-2">
              <Image src={brand.image_url || "/placeholder.svg"} alt={brand.name} fill className="object-contain" />
            </div>
            <span className="text-lg">{brand.name}</span>
            {brand.product_count !== undefined && (
              <span className="text-textSecondary text-sm">{brand.product_count} productos</span>
            )}
          </Link>
        ))}
      </div>
      {brands.length === 0 && (
        <div className="text-center py-8">
          <p className="text-textSecondary">No hay marcas disponibles en este momento.</p>
        </div>
      )}
    </div>
  )
}
