"use client"

import { useState } from "react"
import NavbarWrapper from "@/components/NavbarWrapper"
import ProductCard from "@/components/ProductCard"
import AdvancedFilter, { type FilterState, type FilterCategory, type SortOption } from "@/components/AdvancedFilter"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useCategory } from "@/hooks/use-categories"
import { useProducts } from "@/hooks/use-products"

// Categorías de filtro (sin incluir la categoría principal ya que estamos en una categoría específica)
const filterCategories: FilterCategory[] = [
  {
    id: "condition",
    name: "Condición",
    type: "radio",
    options: [
      { id: "all", label: "Todos" },
      { id: "new", label: "Nuevo" },
      { id: "used", label: "Usado" },
    ],
  },
  {
    id: "brand",
    name: "Marca",
    type: "checkbox",
    options: [
      { id: "luxury", label: "Luxury" },
      { id: "premium", label: "Premium" },
      { id: "artisan", label: "Artisan" },
      { id: "designer", label: "Designer" },
    ],
  },
  {
    id: "color",
    name: "Color",
    type: "color",
    options: [
      { id: "#D4AF37", label: "Dorado" },
      { id: "#C0C0C0", label: "Plateado" },
      { id: "#964B00", label: "Marrón" },
      { id: "#FFFFFF", label: "Blanco" },
      { id: "#000000", label: "Negro" },
      { id: "#0000FF", label: "Azul" },
      { id: "#FF0000", label: "Rojo" },
    ],
  },
  {
    id: "rating",
    name: "Calificación",
    type: "radio",
    options: [
      { id: "4.5", label: "4.5 estrellas y más" },
      { id: "4", label: "4 estrellas y más" },
      { id: "3.5", label: "3.5 estrellas y más" },
      { id: "3", label: "3 estrellas y más" },
    ],
  },
]

// Opciones de ordenación
const sortOptions: SortOption[] = [
  { id: "relevance", label: "Relevancia" },
  { id: "price_asc", label: "Precio: Menor a Mayor" },
  { id: "price_desc", label: "Precio: Mayor a Menor" },
  { id: "newest", label: "Más recientes" },
  { id: "rating", label: "Mejor calificados" },
]

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const { category, loading: categoryLoading, error: categoryError } = useCategory(slug)

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 100000],
    categories: {},
    sort: "relevance",
  })

  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts({
    category: slug,
    minPrice: filters.priceRange[0],
    maxPrice: filters.priceRange[1],
    sortBy: filters.sort === "price_asc" ? "price" : filters.sort === "price_desc" ? "price" : "created_at",
    sortOrder: filters.sort === "price_asc" ? "asc" : "desc",
  })

  const isMobile = useMediaQuery("(max-width: 768px)")

  // Manejar cambios en los filtros
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

  if (categoryLoading) {
    return (
      <main>
        <NavbarWrapper />
        <div className="lg:ml-20 min-h-screen">
          <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
              <Link
                href="/categorias"
                className="flex items-center text-textSecondary hover:text-primary transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                Volver a categorías
              </Link>
            </div>

            <div className="animate-pulse">
              <div className="h-12 bg-mist bg-opacity-20 rounded mb-8 w-1/3"></div>
              <div className="h-6 bg-mist bg-opacity-20 rounded mb-8 w-2/3"></div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (categoryError || !category) {
    return (
      <main>
        <NavbarWrapper />
        <div className="lg:ml-20 min-h-screen">
          <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
              <Link
                href="/categorias"
                className="flex items-center text-textSecondary hover:text-primary transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                Volver a categorías
              </Link>
            </div>
            <div className="text-center py-12">
              <h1 className="text-4xl font-serif mb-4">Categoría no encontrada</h1>
              <p className="text-textSecondary">La categoría que buscas no existe o no está disponible.</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main>
      <NavbarWrapper />
      <div className="lg:ml-20 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <Link
              href="/categorias"
              className="flex items-center text-textSecondary hover:text-primary transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Volver a categorías
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-serif mb-4">{category.name}</h1>
            {category.description && <p className="text-textSecondary text-lg">{category.description}</p>}
            <p className="text-textSecondary mt-2">{category.product_count || 0} productos disponibles</p>
          </div>

          <div className="flex items-center justify-between mb-8">
            {!isMobile && (
              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="bg-background border border-mist border-opacity-20 rounded-md py-2 px-4 text-foreground focus:outline-none focus:border-primary"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filtros */}
            <div className="lg:w-1/4">
              <AdvancedFilter
                minPrice={0}
                maxPrice={100000}
                categories={filterCategories}
                sortOptions={sortOptions}
                initialFilters={filters}
                onFilterChange={handleFilterChange}
                isMobile={isMobile}
              />
            </div>

            {/* Resultados */}
            <div className="lg:w-3/4">
              {productsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="bg-background rounded-lg overflow-hidden animate-pulse">
                      <div className="aspect-square bg-mist bg-opacity-20"></div>
                      <div className="p-4">
                        <div className="h-4 bg-mist bg-opacity-20 rounded mb-2"></div>
                        <div className="h-6 bg-mist bg-opacity-20 rounded"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : productsError ? (
                <div className="text-center py-12">
                  <p className="text-error text-lg">Error al cargar productos: {productsError}</p>
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-textSecondary text-lg">
                    No se encontraron productos en esta categoría que coincidan con tus filtros.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
