"use client"
import Link from "next/link"
import Image from "next/image"
import NavbarWrapper from "@/components/NavbarWrapper"
import { ArrowLeft, Star, Store, Calendar, ExternalLink } from "lucide-react"
import ProductCard from "@/components/ProductCard"
import { useSeller } from "@/hooks/use-seller"

export default function VendorPage({ params }: { params: { id: string } }) {
  const { seller, products, stats, loading, error } = useSeller(params.id)

  if (loading) {
    return (
      <main>
        <NavbarWrapper />
        <div className="lg:ml-20 transition-all duration-300 min-h-screen">
          <div className="container mx-auto px-4 py-12">
            <div className="animate-pulse">
              <div className="h-8 bg-mist bg-opacity-20 rounded w-1/3 mb-8"></div>
              <div className="h-32 bg-mist bg-opacity-20 rounded mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-mist bg-opacity-20 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !seller) {
    return (
      <main>
        <NavbarWrapper />
        <div className="lg:ml-20 transition-all duration-300 min-h-screen">
          <div className="container mx-auto px-4 py-12">
            <div className="mb-8">
              <Link href="/" className="flex items-center text-textSecondary hover:text-primary transition-colors">
                <ArrowLeft size={20} className="mr-2" />
                Volver al inicio
              </Link>
            </div>
            <div className="text-center py-12">
              <h1 className="text-2xl font-serif mb-4">Vendedor no encontrado</h1>
              <p className="text-textSecondary mb-6">
                {error || "El vendedor que buscas no existe o no está disponible."}
              </p>
              <Link href="/" className="btn-primary">
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  // Generar avatar si no hay imagen de perfil
  const avatarImage =
    seller.profile_picture_url || `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(seller.users.name)}`

  // Formatear fecha de registro
  const memberSince = new Date().getFullYear() - 1 // Placeholder, luego usaremos created_at real

  return (
    <main>
      <NavbarWrapper />
      <div className="lg:ml-20 transition-all duration-300 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <Link href="/" className="flex items-center text-textSecondary hover:text-primary transition-colors">
              <ArrowLeft size={20} className="mr-2" />
              Volver al inicio
            </Link>
          </div>

          {/* Header del Vendedor */}
          <div className="bg-background rounded-lg border border-mist border-opacity-20 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar del Vendedor */}
              <div className="w-24 h-24 relative rounded-full overflow-hidden border-2 border-primary border-opacity-20">
                <Image src={avatarImage || "/placeholder.svg"} alt={seller.users.name} fill className="object-cover" />
              </div>

              {/* Información del Vendedor */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-serif">{seller.users.name}</h1>
                  {seller.fe_active && (
                    <span className="bg-primary text-background text-xs px-2 py-1 rounded-full">Verificado</span>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-4 text-textSecondary">
                  <div className="flex items-center">
                    <Store size={16} className="mr-1" />
                    <span className="capitalize">{seller.seller_type}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" />
                    <span>Miembro desde {memberSince}</span>
                  </div>
                </div>

                {seller.landing_description && (
                  <p className="text-textSecondary mb-4 max-w-2xl">{seller.landing_description}</p>
                )}

                <div className="flex flex-wrap items-center gap-6 text-sm text-textSecondary">
                  {stats && (
                    <>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-primary fill-primary mr-1" />
                        <span className="font-medium text-textPrimary">{stats.rating.toFixed(1)}</span>
                        <span className="ml-1">({stats.reviewCount} reviews)</span>
                      </div>
                      <div>
                        <span className="font-medium text-textPrimary">{stats.positiveResponseRate}%</span> respuestas
                        positivas
                      </div>
                      <div>
                        <span className="font-medium text-textPrimary">{stats.totalSales}</span> productos vendidos
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-col gap-3">
                <button className="btn-primary flex items-center gap-2">
                  <Star size={16} />
                  Seguir tienda
                </button>
                <button className="btn-secondary flex items-center gap-2">
                  <ExternalLink size={16} />
                  Contactar
                </button>
              </div>
            </div>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-background border border-mist border-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">{products.length}</div>
              <div className="text-sm text-textSecondary">Productos</div>
            </div>
            <div className="bg-background border border-mist border-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats?.rating.toFixed(1) || "4.8"}</div>
              <div className="text-sm text-textSecondary">Rating</div>
            </div>
            <div className="bg-background border border-mist border-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats?.reviewCount || "0"}</div>
              <div className="text-sm text-textSecondary">Reviews</div>
            </div>
            <div className="bg-background border border-mist border-opacity-20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-primary">{stats?.positiveResponseRate || "98"}%</div>
              <div className="text-sm text-textSecondary">Satisfacción</div>
            </div>
          </div>

          {/* Productos del Vendedor */}
          <div>
            <h2 className="text-2xl font-serif mb-6">
              Productos de {seller.users.name} ({products.length})
            </h2>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-background border border-mist border-opacity-20 rounded-lg">
                <Store size={48} className="mx-auto text-mist mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay productos disponibles</h3>
                <p className="text-textSecondary">{seller.users.name} aún no ha publicado productos en su tienda.</p>
              </div>
            )}
          </div>

          {/* Información de Debug */}
          <div className="mt-8 p-4 border border-primary border-opacity-30 rounded-lg bg-primary bg-opacity-5">
            <p className="text-center text-primary text-sm">✨ Información real del vendedor ID: {seller.user_id} ✨</p>
          </div>
        </div>
      </div>
    </main>
  )
}
