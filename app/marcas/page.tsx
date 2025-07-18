"use client"

import NavbarWrapper from "@/components/NavbarWrapper"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { useBrands } from "@/hooks/use-brands"

export default function MarcasPage() {
  const { brands, loading, error } = useBrands({
    includeProductCount: true,
    isActive: true,
  })

  return (
    <main>
      <NavbarWrapper />
      <div className="lg:ml-20 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <Link href="/" className="flex items-center text-textSecondary hover:text-primary transition-colors">
              <ArrowLeft size={20} className="mr-2" />
              Volver al inicio
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif mb-8">Nuestras Marcas</h1>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-background border border-mist border-opacity-20 rounded-lg p-6 animate-pulse"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-mist bg-opacity-20 rounded mr-4"></div>
                    <div className="h-6 bg-mist bg-opacity-20 rounded flex-1"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-mist bg-opacity-20 rounded"></div>
                    <div className="h-4 bg-mist bg-opacity-20 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-error text-lg">Error al cargar marcas: {error}</p>
            </div>
          ) : brands.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {brands.map((brand) => (
                <Link
                  key={brand.id}
                  href={`/marcas/${brand.slug}`}
                  className="bg-background border border-mist border-opacity-20 rounded-lg p-6 hover:border-primary hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all flex flex-col h-[280px]"
                >
                  <div className="flex items-center mb-4">
                    <div className="relative w-16 h-16 mr-4">
                      <Image
                        src={brand.image_url || "/placeholder.svg"}
                        alt={brand.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <h2 className="text-xl font-medium">{brand.name}</h2>
                  </div>
                  <p className="text-textSecondary text-sm line-clamp-6 overflow-hidden flex-1">{brand.description}</p>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-primary text-sm">Ver productos</span>
                    {brand.product_count !== undefined && (
                      <span className="text-textSecondary text-xs">{brand.product_count} productos</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-textSecondary text-lg">No hay marcas disponibles en este momento.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
