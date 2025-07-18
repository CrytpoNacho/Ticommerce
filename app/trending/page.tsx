"use client"

import { useState, useEffect } from "react"
import NavbarWrapper from "@/components/NavbarWrapper"
import ProductCard from "@/components/ProductCard"
import AdvancedFilter, { type FilterState, type FilterCategory, type SortOption } from "@/components/AdvancedFilter"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-media-query"

// Actualizar los precios de ejemplo para que sean más variados
const trendingProducts = [
  {
    id: "1",
    name: "Reloj Elegante",
    price: 75000,
    imageUrl: "/placeholder.svg?key=uoh3c",
    category: "relojes",
    condition: "new",
    brand: "luxury",
    color: "gold",
    rating: 4.5,
    trending: true,
  },
  {
    id: "2",
    name: "Bolso de Cuero",
    price: 45000,
    imageUrl: "/placeholder.svg?key=sy6dn",
    category: "accesorios",
    condition: "new",
    brand: "premium",
    color: "brown",
    rating: 4.2,
    trending: true,
  },
  {
    id: "3",
    name: "Vela Aromática",
    price: 12000,
    imageUrl: "/placeholder.svg?key=uszcs",
    category: "decoracion",
    condition: "new",
    brand: "artisan",
    color: "white",
    rating: 4.8,
    trending: true,
  },
  {
    id: "4",
    name: "Collar de Plata",
    price: 35000,
    imageUrl: "/placeholder.svg?key=14dks",
    category: "accesorios",
    condition: "new",
    brand: "luxury",
    color: "silver",
    rating: 4.7,
    trending: true,
  },
  {
    id: "5",
    name: "Set de Té",
    price: 28000,
    imageUrl: "/luxury-tea-set.png",
    category: "decoracion",
    condition: "new",
    brand: "premium",
    color: "white",
    rating: 4.9,
    trending: true,
  },
  {
    id: "6",
    name: "Billetera de Cuero",
    price: 18500,
    imageUrl: "/luxury-leather-wallet.png",
    category: "accesorios",
    condition: "used",
    brand: "luxury",
    color: "brown",
    rating: 4.0,
    trending: true,
  },
  {
    id: "7",
    name: "Pulsera de Oro",
    price: 65000,
    imageUrl: "/placeholder.svg?key=p7s9d",
    category: "accesorios",
    condition: "new",
    brand: "luxury",
    color: "gold",
    rating: 4.6,
    trending: true,
  },
  {
    id: "8",
    name: "Perfume de Lujo",
    price: 42000,
    imageUrl: "/placeholder.svg?key=l2k4j",
    category: "belleza",
    condition: "new",
    brand: "premium",
    color: "transparent",
    rating: 4.3,
    trending: true,
  },
]

// Categorías de filtro
const filterCategories: FilterCategory[] = [
  {
    id: "category",
    name: "Categoría",
    type: "checkbox",
    options: [
      { id: "relojes", label: "Relojes" },
      { id: "accesorios", label: "Accesorios" },
      { id: "decoracion", label: "Decoración" },
      { id: "belleza", label: "Belleza" },
      { id: "moda", label: "Moda" },
      { id: "tecnologia", label: "Tecnología" },
    ],
  },
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
]

// Opciones de ordenación
const sortOptions: SortOption[] = [
  { id: "trending", label: "Más populares" },
  { id: "price_asc", label: "Precio: Menor a Mayor" },
  { id: "price_desc", label: "Precio: Mayor a Menor" },
  { id: "newest", label: "Más recientes" },
  { id: "rating", label: "Mejor calificados" },
]

export default function TrendingPage() {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 100000],
    categories: {},
    sort: "trending",
  })
  const [filteredProducts, setFilteredProducts] = useState(trendingProducts)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Aplicar filtros cuando cambien
  useEffect(() => {
    let results = [...trendingProducts]

    // Filtrar por rango de precio
    results = results.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
    )

    // Filtrar por categorías
    Object.entries(filters.categories).forEach(([categoryId, selectedOptions]) => {
      if (selectedOptions.length > 0) {
        switch (categoryId) {
          case "category":
            if (selectedOptions.length > 0 && !selectedOptions.includes("all")) {
              results = results.filter((product) => selectedOptions.includes(product.category))
            }
            break
          case "condition":
            if (selectedOptions.length > 0 && !selectedOptions.includes("all")) {
              results = results.filter((product) => selectedOptions.includes(product.condition))
            }
            break
          case "brand":
            if (selectedOptions.length > 0) {
              results = results.filter((product) => selectedOptions.includes(product.brand))
            }
            break
          case "color":
            if (selectedOptions.length > 0) {
              // Aquí necesitaríamos una lógica más compleja para mapear los códigos de color a los nombres de color
              // Por simplicidad, solo filtramos por los colores que coinciden exactamente
              results = results.filter((product) => {
                const colorMap: Record<string, string> = {
                  "#D4AF37": "gold",
                  "#C0C0C0": "silver",
                  "#964B00": "brown",
                  "#FFFFFF": "white",
                  "#000000": "black",
                  "#0000FF": "blue",
                  "#FF0000": "red",
                }
                return selectedOptions.some((colorCode) => colorMap[colorCode] === product.color)
              })
            }
            break
        }
      }
    })

    // Ordenar productos
    switch (filters.sort) {
      case "price_asc":
        results.sort((a, b) => a.price - b.price)
        break
      case "price_desc":
        results.sort((a, b) => b.price - a.price)
        break
      case "newest":
        // En un caso real, ordenaríamos por fecha
        // Aquí solo invertimos el orden como ejemplo
        results.reverse()
        break
      case "rating":
        results.sort((a, b) => b.rating - a.rating)
        break
      default:
        // Trending (orden predeterminado)
        break
    }

    setFilteredProducts(results)
  }, [filters])

  // Manejar cambios en los filtros
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
  }

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

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-serif">Tendencias</h1>

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
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      imageUrl={product.imageUrl}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-textSecondary text-lg">
                    No se encontraron productos que coincidan con tus filtros.
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
