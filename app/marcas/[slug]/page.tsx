"use client"

import NavbarWrapper from "@/components/NavbarWrapper"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ExternalLink } from "lucide-react"
import ProductCard from "@/components/ProductCard"
import { useBrand } from "@/hooks/use-brands"
import { useProducts } from "@/hooks/use-products"

export default function BrandPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const { brand, loading: brandLoading, error: brandError } = useBrand(slug)

  // Obtener productos de la marca usando el brand_id
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts({
    // Necesitaremos modificar useProducts para soportar brand_id
    // Por ahora usaremos un filtro temporal
  })

  if (brandLoading) {
    return (
      <main>
        <NavbarWrapper />
        <div className="lg:ml-20 min-h-screen">
          <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
              <Link
                href="/marcas"
                className="flex items-center text-textSecondary hover:text-primary transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                Volver a marcas
              </Link>
            </div>

            <div className="animate-pulse">
              <div className="flex items-center mb-8">
                <div className="w-24 h-24 bg-mist bg-opacity-20 rounded mr-6"></div>
                <div className="h-12 bg-mist bg-opacity-20 rounded w-1/3"></div>
              </div>
              <div className="h-6 bg-mist bg-opacity-20 rounded mb-8 w-2/3"></div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (brandError || !brand) {
    return (
      <main>
        <NavbarWrapper />
        <div className="lg:ml-20 min-h-screen">
          <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
              <Link
                href="/marcas"
                className="flex items-center text-textSecondary hover:text-primary transition-colors"
              >
                <ArrowLeft size={20} className="mr-2" />
                Volver a marcas
              </Link>
            </div>
            <div className="text-center py-12">
              <h1 className="text-4xl font-serif mb-4">Marca no encontrada</h1>
              <p className="text-textSecondary">La marca que buscas no existe o no está disponible.</p>
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
            <Link href="/marcas" className="flex items-center text-textSecondary hover:text-primary transition-colors">
              <ArrowLeft size={20} className="mr-2" />
              Volver a marcas
            </Link>
          </div>

          <div className="flex items-center mb-8">
            <div className="relative w-24 h-24 mr-6">
              <Image src={brand.image_url || "/placeholder.svg"} alt={brand.name} fill className="object-contain" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-serif">{brand.name}</h1>
              {brand.website_url && (
                <a
                  href={brand.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline mt-2"
                >
                  Visitar sitio web
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>

          <div className="bg-background border border-mist border-opacity-20 rounded-lg p-6 mb-12">
            <p className="text-lg">{brand.description}</p>
            <div className="mt-4 text-textSecondary">
              <span>{brand.product_count || 0} productos disponibles</span>
            </div>
          </div>

          <h2 className="text-3xl font-serif mb-8">Productos de {brand.name}</h2>

          {brand.sample_products && brand.sample_products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {brand.sample_products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-textSecondary">No hay productos disponibles para esta marca.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
