"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"

interface ProductImage {
  id: number
  file_url: string
  file_name: string
  file_type: string
  display_order: number
}

interface ProductImageGalleryProps {
  images: ProductImage[]
  productName: string
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  useEffect(() => {
    // Reset image index when images array changes
    if (images && images.length > 0 && currentImageIndex >= images.length) {
      setCurrentImageIndex(0)
    }
  }, [images, currentImageIndex])

  // Si no hay imágenes, mostrar placeholder
  if (!images || images.length === 0) {
    const placeholderImage = `/placeholder.svg?height=600&width=600&query=${encodeURIComponent(productName || "product")}`
    return (
      <div className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden border border-gray-700">
        <Image src={placeholderImage || "/placeholder.svg"} alt={productName} fill className="object-contain" />
      </div>
    )
  }

  const currentImage = images && images.length > 0 ? images[currentImageIndex] : null

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <div className="space-y-2 mb-8">
      {/* Imagen principal */}
      <div className="relative aspect-square bg-gray-900 rounded-lg overflow-hidden border border-gray-700 group">
        {currentImage ? (
          <Image
            src={currentImage.file_url || "/placeholder.svg"}
            alt={`${productName} - Imagen ${currentImageIndex + 1}`}
            fill
            className="object-contain transition-transform duration-300"
            priority
          />
        ) : (
          <Image
            src={`/placeholder.svg?height=600&width=600&query=${encodeURIComponent(productName || "product")}`}
            alt={productName}
            fill
            className="object-contain"
          />
        )}

        {/* Controles de navegación */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-opacity opacity-0 group-hover:opacity-100"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-opacity opacity-0 group-hover:opacity-100"
              aria-label="Siguiente imagen"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Botón de zoom */}
        <button
          onClick={() => setIsZoomed(true)}
          className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white transition-opacity opacity-0 group-hover:opacity-100"
          aria-label="Ampliar imagen"
        >
          <ZoomIn size={20} />
        </button>

        {/* Indicador de imagen actual */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 px-3 py-1 rounded-full text-white text-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Miniaturas - más pegadas a la imagen principal */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => goToImage(index)}
              className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                index === currentImageIndex
                  ? "border-yellow-500 ring-2 ring-yellow-500 ring-opacity-50"
                  : "border-gray-600 hover:border-gray-400"
              }`}
            >
              <Image
                src={image.file_url || "/placeholder.svg"}
                alt={`Miniatura ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Modal de zoom */}
      {isZoomed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            {currentImage && (
              <Image
                src={currentImage.file_url || "/placeholder.svg"}
                alt={`${productName} - Imagen ampliada`}
                width={800}
                height={800}
                className="object-contain max-h-[90vh]"
              />
            )}
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full flex items-center justify-center text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
