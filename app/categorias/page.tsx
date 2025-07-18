"use client"

import NavbarWrapper from "@/components/NavbarWrapper"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useCategories } from "@/hooks/use-categories"

export default function CategoriasPage() {
  const { categories, loading, error } = useCategories({ includeProductCount: true })

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

          <h1 className="text-4xl md:text-5xl font-serif mb-8">Todas las Categorías</h1>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-background border border-mist border-opacity-20 rounded-lg p-6 animate-pulse"
                >
                  <div className="h-6 bg-mist bg-opacity-20 rounded mb-2"></div>
                  <div className="h-4 bg-mist bg-opacity-20 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-error text-lg">Error al cargar categorías: {error}</p>
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categorias/${category.slug}`}
                  className="bg-background border border-mist border-opacity-20 rounded-lg p-6 text-center hover:border-primary hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all"
                >
                  <span className="text-xl block mb-2">{category.name}</span>
                  <span className="text-textSecondary text-sm">{category.product_count || 0} productos</span>
                  {category.description && (
                    <p className="text-textSecondary text-xs mt-2 line-clamp-2">{category.description}</p>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-textSecondary text-lg">No hay categorías disponibles en este momento.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
