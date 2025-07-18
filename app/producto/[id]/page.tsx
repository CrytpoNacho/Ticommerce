"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import NavbarWrapper from "@/components/NavbarWrapper"
import ProductImageGallery from "@/components/ProductImageGallery"
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  ArrowLeft,
  Store,
  ExternalLink,
  MessageCircle,
  ThumbsUp,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"

interface ProductImage {
  id: number
  file_url: string
  file_name: string
  file_type: string
  display_order: number
}

interface ProductVariant {
  id: number
  sku: string
  price: number
  stock_quantity: number
  is_active: boolean
  attributes: { [key: string]: string }
  images: ProductImage[]
}

interface ProductData {
  id: string | number
  name: string
  description?: string
  price: number
  currency?: string
  category?: string
  stock_quantity?: number
  has_variants?: boolean
  images: ProductImage[]
  sellers: {
    user_id: number
    seller_type: string
    users: {
      id: number
      name: string
      email: string
    }
  }
  brands?: {
    id: number
    name: string
    slug: string
  }
}

interface Review {
  id: number
  user_name: string
  rating: number
  comment: string
  created_at: string
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<ProductData | null>(null)
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedAttributes, setSelectedAttributes] = useState<{ [key: string]: string }>({})
  const [currentImages, setCurrentImages] = useState<ProductImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableAttributes, setAvailableAttributes] = useState<{ [key: string]: string[] }>({})
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [reviews, setReviews] = useState<Review[]>([])

  const { toast } = useToast()
  const { addToCart } = useCart()

  useEffect(() => {
    fetchProduct()
    fetchRelatedProducts()
    fetchReviews()
  }, [params.id])

  useEffect(() => {
    if (selectedVariant && selectedVariant.images.length > 0) {
      setCurrentImages(selectedVariant.images)
    } else if (product) {
      setCurrentImages(product.images)
    }
  }, [selectedVariant, product])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/products/${params.id}`)
      if (!response.ok) {
        throw new Error("Producto no encontrado")
      }

      const data = await response.json()

      if (data.product) {
        setProduct(data.product)
        setVariants(data.variants || [])
        setCurrentImages(data.product.images || [])

        if (data.variants && data.variants.length > 0) {
          setVariants(data.variants)

          const attributes: { [key: string]: string[] } = {}
          const validVariants = data.variants.filter(
            (variant: ProductVariant) => Object.keys(variant.attributes).length > 0,
          )

          if (validVariants.length > 0) {
            validVariants.forEach((variant: ProductVariant) => {
              Object.entries(variant.attributes).forEach(([key, value]) => {
                if (!attributes[key]) attributes[key] = []
                if (!attributes[key].includes(value)) {
                  attributes[key].push(value)
                }
              })
            })
            setAvailableAttributes(attributes)

            const firstValidVariant = validVariants[0]
            setSelectedVariant(firstValidVariant)
            setSelectedAttributes(firstValidVariant.attributes)
          }
        }
      } else {
        setError("Producto no encontrado")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(`/api/products?limit=6&exclude=${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setRelatedProducts(data.products || [])
      }
    } catch (err) {
      console.error("Error fetching related products:", err)
    }
  }

  const fetchReviews = async () => {
    // Mock reviews for now
    setReviews([
      {
        id: 1,
        user_name: "María González",
        rating: 5,
        comment: "Excelente producto, muy buena calidad y llegó rápido.",
        created_at: "2024-01-15",
      },
      {
        id: 2,
        user_name: "Carlos Rodríguez",
        rating: 4,
        comment: "Muy buen producto, aunque el empaque podría mejorar.",
        created_at: "2024-01-10",
      },
      {
        id: 3,
        user_name: "Ana Jiménez",
        rating: 5,
        comment: "Perfecto, exactamente lo que esperaba. Lo recomiendo.",
        created_at: "2024-01-08",
      },
    ])
  }

  const handleVariantChange = (attributeType: string, value: string) => {
    const newAttributes = { ...selectedAttributes, [attributeType]: value }
    setSelectedAttributes(newAttributes)

    const matchingVariant = variants.find((variant) => {
      return Object.entries(newAttributes).every(([key, val]) => variant.attributes[key] === val)
    })

    if (matchingVariant) {
      setSelectedVariant(matchingVariant)
    }
  }

  const handleSimpleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant)
    setSelectedAttributes(variant.attributes)
  }

  const getCurrentPrice = () => {
    if (selectedVariant) {
      return selectedVariant.price
    }
    return product?.price || 0
  }

  const getCurrentStock = () => {
    if (selectedVariant) {
      return selectedVariant.stock_quantity
    }
    return product?.stock_quantity || 0
  }

  const getCurrencySymbol = () => {
    return product?.currency === "USD" ? "$" : "₡"
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString()
  }

  const handleAddToCart = () => {
    if (product) {
      const currentPrice = getCurrentPrice()
      const currentStock = getCurrentStock()

      if (currentStock <= 0) {
        toast({
          title: "Producto agotado",
          description: "Este producto no está disponible en este momento",
          variant: "destructive",
        })
        return
      }

      addToCart({
        id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
        name: product.name,
        price: currentPrice,
        quantity: 1,
        variant: selectedVariant ? selectedAttributes : undefined,
      })

      toast({
        title: "Producto añadido",
        description: `${product.name} ha sido añadido al carrito`,
        variant: "success",
      })
    }
  }

  const handleAddToWishlist = () => {
    if (product) {
      toast({
        title: "Añadido a favoritos",
        description: `${product.name} ha sido añadido a tus favoritos`,
        variant: "success",
      })
    }
  }

  const handleShare = () => {
    if (navigator.share && product) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Enlace copiado",
        description: "El enlace del producto ha sido copiado al portapapeles",
        variant: "success",
      })
    }
  }

  const hasValidVariants = variants.some((variant) => Object.keys(variant.attributes).length > 0)
  const hasVariantsWithoutAttributes = variants.some((variant) => Object.keys(variant.attributes).length === 0)

  if (loading) {
    return (
      <main className="bg-black min-h-screen">
        <NavbarWrapper />
        <div className="lg:ml-20 transition-all duration-300 min-h-screen">
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="relative aspect-square bg-gray-800 rounded-lg animate-pulse max-h-96"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-800 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-800 rounded animate-pulse w-1/2"></div>
                <div className="h-6 bg-gray-800 rounded animate-pulse w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="bg-black min-h-screen text-white">
        <NavbarWrapper />
        <div className="lg:ml-20 transition-all duration-300 min-h-screen">
          <div className="container mx-auto px-4 py-6">
            <div className="mb-6">
              <Link href="/" className="flex items-center text-gray-400 hover:text-yellow-500 transition-colors">
                <ArrowLeft size={18} className="mr-2" />
                Volver al inicio
              </Link>
            </div>
            <div className="text-center py-8">
              <h1 className="text-xl font-serif mb-3">Producto no encontrado</h1>
              <p className="text-gray-400 mb-4">{error || "El producto que buscas no existe o no está disponible."}</p>
              <Link
                href="/"
                className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const sellerName = product.sellers?.users?.name || "Vendedor"
  const sellerType = product.sellers?.seller_type || "tienda"
  const brandName = product.brands?.name || ""
  const brandSlug = product.brands?.slug || ""
  const showBrand = product.brands && product.brands.name

  return (
    <main className="bg-black min-h-screen text-white">
      <NavbarWrapper />
      <div className="lg:ml-20 transition-all duration-300">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Link href="/" className="flex items-center text-gray-400 hover:text-yellow-500 transition-colors text-sm">
              <ArrowLeft size={16} className="mr-1" />
              Volver al inicio
            </Link>
          </div>

          {/* Sección principal del producto */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-40">
            {/* Galería de imágenes - más compacta */}
            <div className="max-h-96">
              <ProductImageGallery images={currentImages} productName={product.name} />
            </div>

            {/* Detalles del producto - más compacto */}
            <div className="space-y-4">
              <h1 className="text-2xl font-serif text-white">{product.name}</h1>

              <div className="flex items-center">
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                  <Star className="w-3 h-3 text-yellow-500" />
                </div>
                <span className="ml-2 text-gray-400 text-xs">(24 reviews)</span>
              </div>

              {/* Precio */}
              <div className="flex items-center">
                <span className="text-2xl font-serif text-white">
                  <span className="text-yellow-500">{getCurrencySymbol()}</span>
                  {formatPrice(getCurrentPrice())}
                </span>
                {product.currency === "USD" && (
                  <span className="ml-3 text-gray-400 text-sm">≈ ₡{formatPrice(getCurrentPrice() * 520)}</span>
                )}
              </div>

              {/* Stock */}
              <div>
                <span className={`text-xs ${getCurrentStock() > 0 ? "text-green-400" : "text-red-400"}`}>
                  {getCurrentStock() > 0 ? `${getCurrentStock()} disponibles` : "Agotado"}
                </span>
              </div>

              {/* Descripción más corta */}
              {product.description && <p className="text-gray-300 text-sm line-clamp-3">{product.description}</p>}

              {/* Variantes con atributos - más compacto */}
              {product.has_variants && hasValidVariants && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-white">Opciones:</h3>
                  {Object.entries(availableAttributes).map(([attributeType, values]) => (
                    <div key={attributeType} className="space-y-2">
                      <label className="block text-xs font-medium text-gray-300 capitalize">{attributeType}:</label>
                      <div className="flex flex-wrap gap-2">
                        {values.map((value) => (
                          <button
                            key={value}
                            onClick={() => handleVariantChange(attributeType, value)}
                            className={`px-3 py-1 rounded text-xs border transition-all font-medium capitalize ${
                              selectedAttributes[attributeType] === value
                                ? "bg-yellow-500 text-black border-yellow-500"
                                : "bg-gray-800 text-white border-gray-600 hover:border-yellow-500"
                            }`}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {selectedVariant && (
                    <div className="bg-gray-900 border border-gray-700 rounded p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-400">SKU: {selectedVariant.sku}</p>
                          <p className="text-xs text-gray-400">Stock: {selectedVariant.stock_quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-serif text-white">
                            <span className="text-yellow-500">{getCurrencySymbol()}</span>
                            {formatPrice(selectedVariant.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Variantes sin atributos - grid compacto con scroll */}
              {product.has_variants && hasVariantsWithoutAttributes && !hasValidVariants && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-white">Variantes:</h3>
                  <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    <div className="grid grid-cols-2 gap-2 pr-2">
                      {variants.map((variant) => (
                        <button
                          key={variant.id}
                          onClick={() => handleSimpleVariantChange(variant)}
                          className={`p-2 rounded border text-left text-xs transition-all ${
                            selectedVariant?.id === variant.id
                              ? "bg-yellow-500 text-black border-yellow-500"
                              : "bg-gray-800 text-white border-gray-600 hover:border-yellow-500"
                          }`}
                        >
                          <div className="flex justify-between items-center gap-1">
                            <div className="min-w-0 flex-1">
                              <p className="font-medium truncate">{variant.sku}</p>
                              <p className="text-xs opacity-75">Stock: {variant.stock_quantity}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-serif text-xs">
                                <span className="text-yellow-500">{getCurrencySymbol()}</span>
                                {formatPrice(variant.price)}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Información del vendedor - más compacta */}
              <div className="border border-gray-700 rounded p-4 bg-gray-900">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-1">Vendido por</p>
                    <Link
                      href={`/vendedor/${product.sellers.user_id}`}
                      className="group flex items-center hover:text-yellow-500 transition-colors"
                    >
                      <Store size={14} className="mr-1 text-yellow-500" />
                      <h3 className="text-sm font-medium text-white group-hover:text-yellow-500">{sellerName}</h3>
                      <ExternalLink size={10} className="ml-1 opacity-50 group-hover:opacity-100" />
                    </Link>
                    <p className="text-xs text-gray-400 capitalize">{sellerType}</p>

                    {showBrand && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-400 mb-1">Marca</p>
                        <Link
                          href={`/marcas/${brandSlug}`}
                          className="group flex items-center hover:text-yellow-500 transition-colors"
                        >
                          <h3 className="text-sm font-medium text-white group-hover:text-yellow-500">{brandName}</h3>
                          <ExternalLink size={10} className="ml-1 opacity-50 group-hover:opacity-100" />
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="ml-3">
                    <Link
                      href={`/vendedor/${product.sellers.user_id}`}
                      className="bg-gray-800 text-white px-3 py-1 rounded border border-gray-600 hover:border-yellow-500 transition-colors text-xs"
                    >
                      Ver tienda
                    </Link>
                  </div>
                </div>
                <div className="flex items-center mt-3 pt-3 border-t border-gray-700">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 mr-1" />
                    <span className="text-xs font-medium text-white">4.8</span>
                    <span className="text-xs text-gray-400 ml-1">(124)</span>
                  </div>
                  <div className="ml-4 text-xs text-gray-400">
                    <span className="font-medium text-white">98%</span> positivas
                  </div>
                </div>
              </div>

              {/* Botones de acción - más compactos */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={getCurrentStock() <= 0}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded font-medium transition-colors text-sm ${
                    getCurrentStock() > 0
                      ? "bg-yellow-500 text-black hover:bg-yellow-600"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart size={16} />
                  {getCurrentStock() > 0 ? "Agregar al carrito" : "Agotado"}
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className="w-10 h-10 rounded border border-gray-600 flex items-center justify-center hover:border-yellow-500 transition-colors"
                >
                  <Heart size={16} className="text-gray-400" />
                </button>
                <button
                  onClick={handleShare}
                  className="w-10 h-10 rounded border border-gray-600 flex items-center justify-center hover:border-yellow-500 transition-colors"
                >
                  <Share2 size={16} className="text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Sección inferior: Comentarios y Productos Relacionados */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Comentarios - 2/3 del ancho */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle size={20} className="text-yellow-500" />
                  <h2 className="text-lg font-serif text-white">Comentarios y Reseñas</h2>
                </div>

                {/* Resumen de calificaciones */}
                <div className="flex items-center gap-4 mb-6 p-4 bg-gray-800 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">4.6</div>
                    <div className="flex items-center justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${star <= 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-400"}`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-gray-400">24 reseñas</div>
                  </div>
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-400 w-2">{rating}</span>
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <div className="flex-1 bg-gray-700 rounded-full h-1">
                          <div
                            className="bg-yellow-500 h-1 rounded-full"
                            style={{ width: `${rating === 5 ? 60 : rating === 4 ? 30 : 10}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400 w-6">{rating === 5 ? 15 : rating === 4 ? 7 : 2}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lista de comentarios */}
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-700 pb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                          {review.user_name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white text-sm">{review.user_name}</span>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${
                                    star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-400"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-400">{review.created_at}</span>
                          </div>
                          <p className="text-gray-300 text-sm">{review.comment}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-yellow-500">
                              <ThumbsUp size={12} />
                              Útil (3)
                            </button>
                            <button className="text-xs text-gray-400 hover:text-yellow-500">Responder</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botón para ver más comentarios */}
                <div className="text-center mt-4">
                  <button className="text-yellow-500 hover:text-yellow-400 text-sm">Ver todos los comentarios</button>
                </div>
              </div>
            </div>

            {/* Productos Relacionados - 1/3 del ancho */}
            <div>
              <div className="bg-gray-900 rounded-lg p-4">
                <h2 className="text-lg font-serif text-white mb-4">Productos Relacionados</h2>
                <div className="space-y-3">
                  {relatedProducts.slice(0, 4).map((relatedProduct) => (
                    <div
                      key={relatedProduct.id}
                      className="bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors"
                    >
                      <Link href={`/producto/${relatedProduct.id}`} className="block">
                        <div className="flex gap-3">
                          <div className="w-16 h-16 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                            <img
                              src={
                                relatedProduct.primary_image ||
                                `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(relatedProduct.name) || "/placeholder.svg"}`
                              }
                              alt={relatedProduct.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-white line-clamp-2 mb-1">{relatedProduct.name}</h3>
                            <p className="text-yellow-500 font-serif text-sm">
                              ₡{relatedProduct.price?.toLocaleString()}
                            </p>
                            <div className="flex items-center mt-1">
                              <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star key={star} className="w-2 h-2 text-yellow-500 fill-yellow-500" />
                                ))}
                              </div>
                              <span className="text-xs text-gray-400 ml-1">(12)</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-4">
                  <Link href="/trending" className="text-yellow-500 hover:text-yellow-400 text-sm">
                    Ver más productos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
