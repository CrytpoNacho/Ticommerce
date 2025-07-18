"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import NavbarWrapper from "@/components/NavbarWrapper"
import ProductCard from "@/components/ProductCard"
import AdvancedFilter, { type FilterState, type FilterCategory, type SortOption } from "@/components/AdvancedFilter"
import { Search, ArrowRight, Loader2, Sparkles } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useSearch, type SearchFilters } from "@/hooks/use-search"
import { useCategoriesDynamic } from "@/hooks/use-categories-dynamic"
import { useRecommendedProducts } from "@/hooks/use-recommended-products"
import { Button } from "@/components/ui/button"

// Opciones de ordenación
const sortOptions: SortOption[] = [
  { id: "relevance", label: "Relevancia" },
  { id: "price_asc", label: "Precio: Menor a Mayor" },
  { id: "price_desc", label: "Precio: Mayor a Menor" },
  { id: "newest", label: "Más recientes" },
  { id: "oldest", label: "Más antiguos" },
  { id: "name_asc", label: "Nombre: A-Z" },
  { id: "name_desc", label: "Nombre: Z-A" },
  { id: "stock", label: "Mayor stock" },
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const queryParam = searchParams.get("q") || ""

  const [searchTerm, setSearchTerm] = useState(queryParam)
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1000000],
    categories: {},
    sort: "relevance",
  })
  const [hasActiveFilters, setHasActiveFilters] = useState(false)

  const isMobile = useMediaQuery("(max-width: 768px)")

  // Obtener categorías dinámicamente
  const { categories: dynamicCategories, loading: categoriesLoading } = useCategoriesDynamic()

  // Usar el hook de búsqueda con límite mayor
  const { results, loading, error, pagination, search, loadMore, updateFilters, resetSearch } = useSearch({
    q: queryParam,
  })

  // Obtener productos recomendados para mostrar después de los resultados filtrados
  const { products: recommendedProducts, loading: recommendedLoading } = useRecommendedProducts(50)

  // Crear categorías de filtro dinámicamente
  const filterCategories: FilterCategory[] = [
    {
      id: "category",
      name: "Categoría",
      type: "checkbox",
      options: [
        { id: "all", label: "Todas las categorías" },
        ...dynamicCategories.map((cat) => ({
          id: cat.id,
          label: cat.label,
        })),
      ],
    },
  ]

  // Verificar si hay filtros activos
  useEffect(() => {
    const activeFilters =
      searchTerm !== "" ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 1000000 ||
      Object.keys(filters.categories).some((key) => filters.categories[key].length > 0) ||
      filters.sort !== "relevance"

    setHasActiveFilters(activeFilters)
  }, [searchTerm, filters])

  // Actualizar el término de búsqueda cuando cambia el parámetro de URL
  useEffect(() => {
    setSearchTerm(queryParam)
    if (queryParam) {
      updateFilters({ q: queryParam })
    }
  }, [queryParam])

  // Búsqueda dinámica cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm !== queryParam) {
      const searchFilters = convertFiltersToSearchFilters(filters)
      searchFilters.q = searchTerm
      updateFilters(searchFilters, true) // true para usar debounce
    }
  }, [searchTerm])

  // Convertir FilterState a SearchFilters
  const convertFiltersToSearchFilters = (filterState: FilterState): SearchFilters => {
    const searchFilters: SearchFilters = {
      q: searchTerm,
      sortBy: filterState.sort,
    }

    // Solo agregar precios si son diferentes de los valores por defecto
    if (filterState.priceRange[0] > 0) {
      searchFilters.minPrice = filterState.priceRange[0]
    }
    if (filterState.priceRange[1] < 1000000) {
      searchFilters.maxPrice = filterState.priceRange[1]
    }

    // Convertir categorías seleccionadas
    Object.entries(filterState.categories).forEach(([categoryId, selectedOptions]) => {
      if (selectedOptions.length > 0 && categoryId === "category") {
        // Filtrar "all" y obtener los valores reales de las categorías
        const validCategories = selectedOptions.filter((option) => option !== "all")
        if (validCategories.length > 0) {
          // Buscar los valores reales de las categorías seleccionadas
          const categoryValues = validCategories
            .map((catId) => {
              const category = dynamicCategories.find((cat) => cat.id === catId)
              return category ? category.value : catId
            })
            .filter(Boolean)

          if (categoryValues.length > 0) {
            searchFilters.category = categoryValues.join(",")
          }
        }
      }
    })

    console.log("Converted filters:", searchFilters)
    return searchFilters
  }

  // Manejar cambios en los filtros
  const handleFilterChange = (newFilters: FilterState) => {
    console.log("Filter change:", newFilters)
    setFilters(newFilters)
    const searchFilters = convertFiltersToSearchFilters(newFilters)
    console.log("Calling updateFilters with:", searchFilters)
    updateFilters(searchFilters)
  }

  // Limpiar todos los filtros
  const handleClearAllFilters = () => {
    const defaultFilters: FilterState = {
      priceRange: [0, 1000000],
      categories: {},
      sort: "relevance",
    }

    setFilters(defaultFilters)
    setSearchTerm("")

    // Limpiar URL
    router.push("/busqueda", { scroll: false })

    // Resetear búsqueda
    resetSearch()
  }

  // Manejar la búsqueda manual (cuando presiona Enter o el botón)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const searchFilters = convertFiltersToSearchFilters(filters)
    searchFilters.q = searchTerm
    updateFilters(searchFilters)

    // Actualizar URL
    if (searchTerm) {
      router.push(`/busqueda?q=${encodeURIComponent(searchTerm)}`, { scroll: false })
    }
  }

  // Renderizar ProductCard con datos consistentes
  const renderProductCard = (product: any) => {
    return <ProductCard key={product.id} product={product} />
  }

  return (
    <main>
      <NavbarWrapper />
      <div className="lg:ml-20 transition-all duration-300 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-serif mb-8">
            {searchTerm ? `Resultados para "${searchTerm}"` : "Buscar Productos"}
          </h1>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" size={20} />
              <input
                type="text"
                placeholder="¿Qué estás buscando?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-background border border-mist border-opacity-20 rounded-md py-3 pl-10 pr-4 text-foreground focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary-dark"
                disabled={loading}
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <ArrowRight size={20} />}
              </button>
            </form>

            {!isMobile && (
              <select
                value={filters.sort}
                onChange={(e) => {
                  const newFilters = { ...filters, sort: e.target.value }
                  setFilters(newFilters)
                  handleFilterChange(newFilters)
                }}
                className="bg-background border border-mist border-opacity-20 rounded-md py-3 px-4 text-foreground focus:outline-none focus:border-primary"
                disabled={loading}
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
              {!categoriesLoading && (
                <AdvancedFilter
                  minPrice={0}
                  maxPrice={1000000}
                  categories={filterCategories}
                  sortOptions={sortOptions}
                  initialFilters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearAllFilters}
                  isMobile={isMobile}
                />
              )}
            </div>

            {/* Resultados */}
            <div className="lg:w-3/4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>
              )}

              {/* Sección de resultados de búsqueda */}
              {loading && results.length === 0 ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="animate-spin text-primary" size={32} />
                  <span className="ml-2 text-textSecondary">Buscando productos...</span>
                </div>
              ) : results.length > 0 ? (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <div className="text-textSecondary">
                      {typeof pagination?.total === "number" && pagination.total > 0 && (
                        <p>
                          Mostrando {results.length} de {pagination.total} productos
                          {searchTerm && ` para "${searchTerm}"`}
                        </p>
                      )}
                    </div>

                    {/* Botón de limpiar filtros también en resultados */}
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearAllFilters}
                        className="border-primary text-primary hover:bg-primary hover:text-background"
                      >
                        Limpiar búsqueda
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map(renderProductCard)}
                  </div>

                 {/* Botón cargar más */}
                  {typeof pagination?.hasMore === "boolean" && pagination.hasMore && (
                    <div className="flex justify-center mt-8">
                      <Button
                        onClick={loadMore}
                        disabled={loading}
                        variant="outline"
                        className="border-primary text-primary hover:bg-primary hover:text-background"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="animate-spin mr-2" size={16} />
                            Cargando...
                          </>
                        ) : (
                          "Cargar más productos"
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Sección de productos recomendados después de los resultados */}
                  {hasActiveFilters && (
                    <div className="mt-16 border-t border-mist pt-8">
                      <h2 className="text-2xl font-serif mb-6 flex items-center">
                        <Sparkles className="mr-2 text-primary" size={24} />
                        Puedes seguir encontrando fascinantes productos de lujo
                      </h2>

                      {recommendedLoading ? (
                        <div className="flex justify-center items-center py-12">
                          <Loader2 className="animate-spin text-primary" size={32} />
                          <span className="ml-2 text-textSecondary">Cargando productos recomendados...</span>
                        </div>
                      ) : recommendedProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {recommendedProducts.map(renderProductCard)}
                        </div>
                      ) : (
                        <p className="text-center text-textSecondary">
                          No se pudieron cargar productos recomendados. Por favor, intenta de nuevo más tarde.
                        </p>
                      )}
                    </div>
                  )}
                </>
              ) : !loading ? (
                <>
                  {/* Mensaje de no resultados con filtros activos */}
                  {hasActiveFilters && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded mb-6">
                      <div className="flex justify-between items-center">
                        <p>No se encontraron productos que coincidan con tu búsqueda.</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleClearAllFilters}
                          className="border-amber-500 text-amber-700 hover:bg-amber-500 hover:text-white"
                        >
                          Limpiar filtros
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* SIEMPRE mostrar productos recomendados */}
                  <div className="mt-8">
                    <h2 className="text-2xl font-serif mb-6 flex items-center">
                      <Sparkles className="mr-2 text-primary" size={24} />
                      Puedes seguir encontrando fascinantes productos de lujo
                    </h2>

                    {recommendedLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <Loader2 className="animate-spin text-primary" size={32} />
                        <span className="ml-2 text-textSecondary">Cargando productos recomendados...</span>
                      </div>
                    ) : recommendedProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendedProducts.map(renderProductCard)}
                      </div>
                    ) : (
                      <p className="text-center text-textSecondary">
                        No se pudieron cargar productos recomendados. Por favor, intenta de nuevo más tarde.
                      </p>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
