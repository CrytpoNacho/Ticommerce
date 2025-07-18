"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ProductCard from "./ProductCard"
import { useProducts } from "@/hooks/use-products"

interface ProductCarouselProps {
  title: string
  viewAllLink: string
  category?: string
  limit?: number
}

export default function ProductCarousel({ title, viewAllLink, category, limit = 8 }: ProductCarouselProps) {
  const { products, loading, error } = useProducts({
    category,
    limit,
    sortBy: "created_at",
    sortOrder: "desc",
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [visibleProducts, setVisibleProducts] = useState(3)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Determinar cuántos productos mostrar según el ancho de la pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleProducts(1)
      } else if (window.innerWidth < 1024) {
        setVisibleProducts(2)
      } else if (window.innerWidth < 1280) {
        setVisibleProducts(3)
      } else {
        setVisibleProducts(4)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const totalSlides = Math.max(0, products.length - visibleProducts)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === totalSlides ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? totalSlides : prevIndex - 1))
  }

  // Manejo de gestos táctiles
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Deslizar a la izquierda
      nextSlide()
    }

    if (touchStart - touchEnd < -100) {
      // Deslizar a la derecha
      prevSlide()
    }
  }

  // Auto-scroll cada 5 segundos
  useEffect(() => {
    if (products.length <= visibleProducts) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000)
    return () => clearInterval(interval)
  }, [currentIndex, totalSlides, products.length, visibleProducts])

  if (loading) {
    return (
      <div className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-serif">{title}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
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

  if (products.length === 0) {
    return (
      <div className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-serif">{title}</h2>
        </div>
        <div className="text-center py-8">
          <p className="text-textSecondary">No hay productos disponibles en este momento.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-serif">{title}</h2>
        <Link href={viewAllLink} className="btn-primary btn-shine text-sm">
          Ver todo
        </Link>
      </div>

      <div className="relative">
        {/* Botones de navegación */}
        {products.length > visibleProducts && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-background border border-mist border-opacity-20 flex items-center justify-center text-primary hover:border-primary transition-all"
              aria-label="Anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-background border border-mist border-opacity-20 flex items-center justify-center text-primary hover:border-primary transition-all"
              aria-label="Siguiente"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Contenedor del carrusel */}
        <div
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={carouselRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleProducts)}%)`,
            }}
          >
            {products.map((product) => (
              <div key={product.id} className="px-3 flex-shrink-0" style={{ width: `${100 / visibleProducts}%` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Indicadores */}
        {totalSlides > 0 && (
          <div className="flex justify-center mt-6">
            {Array.from({ length: totalSlides + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 mx-1 rounded-full ${
                  currentIndex === index ? "bg-primary" : "bg-mist bg-opacity-30"
                }`}
                aria-label={`Ir a slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
