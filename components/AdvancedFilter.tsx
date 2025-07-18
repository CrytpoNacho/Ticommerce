"use client"

import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, X, FilterIcon, Check, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import PriceRangeSlider from "./PriceRangeSlider"

// Tipos para los filtros
export type PriceRange = [number, number]
export type FilterOption = {
  id: string
  label: string
}

export type FilterCategory = {
  id: string
  name: string
  type: "checkbox" | "radio" | "color"
  options: FilterOption[]
}

export type SortOption = {
  id: string
  label: string
}

export type FilterState = {
  priceRange: PriceRange
  categories: Record<string, string[]>
  sort: string
}

interface AdvancedFilterProps {
  minPrice?: number
  maxPrice?: number
  categories: FilterCategory[]
  sortOptions: SortOption[]
  initialFilters?: FilterState
  onFilterChange: (filters: FilterState) => void
  onClearFilters?: () => void
  className?: string
  isMobile?: boolean
}

export default function AdvancedFilter({
  minPrice = 0,
  maxPrice = 100000,
  categories,
  sortOptions,
  initialFilters,
  onFilterChange,
  onClearFilters,
  className,
  isMobile = false,
}: AdvancedFilterProps) {
  // Estado para los filtros
  const [priceRange, setPriceRange] = useState<PriceRange>([minPrice, maxPrice])
  const [selectedCategories, setSelectedCategories] = useState<Record<string, string[]>>({})
  const [sort, setSort] = useState<string>(sortOptions[0]?.id || "")
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Inicializar los filtros con los valores iniciales
  useEffect(() => {
    if (initialFilters) {
      setPriceRange(initialFilters.priceRange)
      setSelectedCategories(initialFilters.categories)
      setSort(initialFilters.sort)
    }

    // Inicializar todas las secciones como expandidas
    const sections: Record<string, boolean> = {}
    // Asegurarse de que la sección de precio siempre esté abierta
    sections["price"] = true

    categories.forEach((category) => {
      sections[category.id] = true
    })
    setExpandedSections(sections)
  }, [initialFilters, categories])

  // Manejar cambios en el rango de precio
  const handlePriceChange = (newRange: PriceRange) => {
    console.log("Price range changed:", newRange)
    setPriceRange(newRange)
    updateFilters({ priceRange: newRange })
  }

  // Manejar cambios en las categorías
  const handleCategoryChange = (categoryId: string, optionId: string, checked: boolean) => {
    const category = categories.find((c) => c.id === categoryId)
    if (!category) return

    let newSelectedOptions = [...(selectedCategories[categoryId] || [])]

    if (category.type === "radio") {
      // Para radio buttons, solo puede haber una opción seleccionada
      newSelectedOptions = checked ? [optionId] : []
    } else {
      // Para checkboxes, puede haber múltiples opciones
      if (checked) {
        if (!newSelectedOptions.includes(optionId)) {
          newSelectedOptions.push(optionId)
        }
      } else {
        newSelectedOptions = newSelectedOptions.filter((id) => id !== optionId)
      }
    }

    const newSelectedCategories = {
      ...selectedCategories,
      [categoryId]: newSelectedOptions,
    }

    setSelectedCategories(newSelectedCategories)
    updateFilters({ categories: newSelectedCategories })
  }

  // Manejar cambios en la ordenación
  const handleSortChange = (sortId: string) => {
    setSort(sortId)
    updateFilters({ sort: sortId })
  }

  // Actualizar los filtros y notificar al componente padre
  const updateFilters = (partialFilters: Partial<FilterState>) => {
    const newFilters: FilterState = {
      priceRange,
      categories: selectedCategories,
      sort,
      ...partialFilters,
    }
    console.log("Updating filters:", newFilters)
    onFilterChange(newFilters)
  }

  // Alternar la expansión de una sección (excepto la de precio que siempre está abierta)
  const toggleSection = (sectionId: string) => {
    // No permitir cerrar la sección de precio
    if (sectionId === "price") return

    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  // Limpiar todos los filtros
  const clearAllFilters = () => {
    const defaultFilters: FilterState = {
      priceRange: [minPrice, maxPrice],
      categories: {},
      sort: sortOptions[0]?.id || "",
    }

    setPriceRange([minPrice, maxPrice])
    setSelectedCategories({})
    setSort(sortOptions[0]?.id || "")

    // Llamar al callback de limpiar filtros si existe
    if (onClearFilters) {
      onClearFilters()
    } else {
      onFilterChange(defaultFilters)
    }
  }

  // Contar filtros activos
  const countActiveFilters = () => {
    let count = 0

    // Verificar si el rango de precio es diferente al predeterminado
    if (priceRange[0] !== minPrice || priceRange[1] !== maxPrice) {
      count += 1
    }

    // Contar categorías seleccionadas
    Object.values(selectedCategories).forEach((options) => {
      count += options.length
    })

    return count
  }

  const activeFiltersCount = countActiveFilters()

  // Renderizar el contenido del filtro
  const filterContent = (
    <div className={cn("bg-background border border-mist border-opacity-10 rounded-lg p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif text-primary">Filtrar por</h2>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-primary hover:text-primary hover:bg-primary hover:bg-opacity-10 flex items-center gap-2"
          >
            <RotateCcw size={14} />
            Limpiar ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Botón de limpiar filtros más prominente */}
      {activeFiltersCount > 0 && (
        <div className="mb-6 p-3 bg-primary bg-opacity-5 rounded-lg border border-primary border-opacity-20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-primary font-medium">
              {activeFiltersCount} filtro{activeFiltersCount > 1 ? "s" : ""} activo{activeFiltersCount > 1 ? "s" : ""}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="border-primary text-primary hover:bg-primary hover:text-background flex items-center gap-2"
            >
              <RotateCcw size={14} />
              Limpiar todo
            </Button>
          </div>
        </div>
      )}

      {/* Rango de precio - Siempre visible */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Rango de Precio</h3>
        </div>

        <PriceRangeSlider
          min={minPrice}
          max={maxPrice}
          value={priceRange}
          onChange={handlePriceChange}
          className="mt-2"
        />
      </div>

      {/* Categorías de filtro */}
      {categories.map((category) => (
        <div key={category.id} className="mb-6 border-t border-mist border-opacity-10 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">{category.name}</h3>
            <button onClick={() => toggleSection(category.id)} className="text-textSecondary hover:text-primary">
              {expandedSections[category.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {expandedSections[category.id] && (
            <div className="space-y-3">
              {category.type === "radio" ? (
                <RadioGroup
                  value={selectedCategories[category.id]?.[0] || ""}
                  onValueChange={(value) => handleCategoryChange(category.id, value, true)}
                >
                  {category.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={option.id}
                        id={`${category.id}-${option.id}`}
                        className="border-primary text-primary"
                      />
                      <Label htmlFor={`${category.id}-${option.id}`} className="text-foreground cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : category.type === "color" ? (
                <div className="flex flex-wrap gap-2">
                  {category.options.map((option) => {
                    const isSelected = selectedCategories[category.id]?.includes(option.id)
                    return (
                      <button
                        key={option.id}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isSelected ? "ring-2 ring-primary" : ""
                        }`}
                        style={{ backgroundColor: option.id }}
                        onClick={() => handleCategoryChange(category.id, option.id, !isSelected)}
                        aria-label={option.label}
                      >
                        {isSelected && <Check size={16} className="text-white" />}
                      </button>
                    )
                  })}
                </div>
              ) : (
                category.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${category.id}-${option.id}`}
                      checked={selectedCategories[category.id]?.includes(option.id) || false}
                      onCheckedChange={(checked) => handleCategoryChange(category.id, option.id, checked === true)}
                      className="border-mist data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <Label htmlFor={`${category.id}-${option.id}`} className="text-foreground cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ))}

      {/* Ordenar por (solo en móvil) */}
      {isMobile && (
        <div className="mt-6 border-t border-mist border-opacity-10 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Ordenar por</h3>
            <button onClick={() => toggleSection("sort")} className="text-textSecondary hover:text-primary">
              {expandedSections["sort"] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {expandedSections["sort"] && (
            <RadioGroup value={sort} onValueChange={handleSortChange}>
              {sortOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={`sort-${option.id}`} className="border-primary text-primary" />
                  <Label htmlFor={`sort-${option.id}`} className="text-foreground cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>
      )}
    </div>
  )

  // Versión móvil con botón para mostrar/ocultar filtros
  if (isMobile) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            variant="outline"
            className="flex items-center gap-2 border-primary text-primary"
          >
            <FilterIcon size={16} />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="bg-primary text-background rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-textSecondary">Ordenar por:</span>
            <select
              value={sort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-background border border-mist border-opacity-20 rounded-md py-1 px-2 text-foreground focus:outline-none focus:border-primary text-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {showMobileFilters && (
          <div className="fixed inset-0 bg-background z-50 overflow-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium">Filtros</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)}>
                  <X size={24} />
                </Button>
              </div>

              {filterContent}

              <div className="sticky bottom-0 bg-background pt-4 pb-6 flex gap-4">
                <Button variant="outline" className="flex-1 border-primary text-primary" onClick={clearAllFilters}>
                  Limpiar
                </Button>
                <Button className="flex-1 bg-primary text-background" onClick={() => setShowMobileFilters(false)}>
                  Ver resultados
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Versión de escritorio
  return filterContent
}
