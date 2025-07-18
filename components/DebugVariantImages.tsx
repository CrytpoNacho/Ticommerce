"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface DebugVariantImagesProps {
  productId: number
}

interface MediaFile {
  id: number
  product_id: number
  variant_id: number | null
  file_url: string
  file_name: string
  is_primary: boolean
  display_order: number
}

interface VariantData {
  id: number
  sku: string
  attributes: { [key: string]: string }
  images: MediaFile[]
}

export default function DebugVariantImages({ productId }: DebugVariantImagesProps) {
  const [productData, setProductData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProductData()
  }, [productId])

  const fetchProductData = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`)
      const data = await response.json()
      setProductData(data)
    } catch (error) {
      console.error("Error fetching product data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-4 bg-gray-900 text-white">Cargando debug info...</div>
  }

  if (!productData) {
    return <div className="p-4 bg-red-900 text-white">Error cargando datos del producto</div>
  }

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg space-y-6">
      <h2 className="text-xl font-bold">🔍 Debug: Producto {productId}</h2>

      {/* Imágenes principales del producto */}
      <div>
        <h3 className="text-lg font-semibold mb-3">📸 Imágenes Principales ({productData.product.images.length})</h3>
        <div className="grid grid-cols-4 gap-4">
          {productData.product.images.map((image: MediaFile) => (
            <div key={image.id} className="space-y-2">
              <div className="aspect-square bg-gray-800 rounded overflow-hidden">
                <Image
                  src={image.file_url || "/placeholder.svg"}
                  alt={image.file_name}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-xs">
                <p className="text-green-400">ID: {image.id}</p>
                <p className="text-gray-400 truncate">{image.file_name}</p>
                <p className="text-blue-400">Orden: {image.display_order}</p>
                {image.is_primary && <p className="text-yellow-400">⭐ Principal</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Variantes e imágenes */}
      {productData.variants && productData.variants.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">🎨 Variantes ({productData.variants.length})</h3>
          {productData.variants.map((variant: VariantData) => (
            <div key={variant.id} className="border border-gray-700 rounded-lg p-4 mb-4">
              <div className="mb-3">
                <h4 className="font-medium text-yellow-400">Variante ID: {variant.id}</h4>
                <p className="text-sm text-gray-400">SKU: {variant.sku}</p>
                <p className="text-sm text-blue-400">Atributos: {JSON.stringify(variant.attributes)}</p>
              </div>

              {variant.images && variant.images.length > 0 ? (
                <div>
                  <p className="text-sm text-green-400 mb-2">📸 Imágenes de variante ({variant.images.length})</p>
                  <div className="grid grid-cols-4 gap-2">
                    {variant.images.map((image: MediaFile) => (
                      <div key={image.id} className="space-y-1">
                        <div className="aspect-square bg-gray-800 rounded overflow-hidden">
                          <Image
                            src={image.file_url || "/placeholder.svg"}
                            alt={image.file_name}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="text-xs">
                          <p className="text-green-400">ID: {image.id}</p>
                          <p className="text-gray-400 truncate">{image.file_name}</p>
                          {image.is_primary && <p className="text-yellow-400">⭐</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-red-400 text-sm">❌ Sin imágenes específicas</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Información de conexión blob */}
      <div className="bg-gray-800 p-4 rounded">
        <h4 className="font-semibold mb-2">🔗 Estado de Conexión Blob</h4>
        <div className="text-sm space-y-1">
          <p>✅ Producto tiene imágenes: {productData.product.images.length > 0 ? "Sí" : "No"}</p>
          <p>✅ Producto tiene variantes: {productData.variants.length > 0 ? "Sí" : "No"}</p>
          <p>
            ✅ Variantes con imágenes: {productData.variants.filter((v: VariantData) => v.images.length > 0).length} de{" "}
            {productData.variants.length}
          </p>
        </div>
      </div>
    </div>
  )
}
