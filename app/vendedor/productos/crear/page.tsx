"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import VendorProtectedRoute from "@/components/VendorProtectedRoute"
import VendorNavbarWrapper from "@/components/VendorNavbarWrapper"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useBrandsForForm } from "@/hooks/use-brands-for-form"
import FileUpload from "@/components/FileUpload"
import {
  ArrowLeft,
  Package,
  DollarSign,
  Tag,
  Save,
  Eye,
  Star,
  EyeIcon,
  Building2,
  Plus,
  Trash2,
  Palette,
  ImageIcon,
} from "lucide-react"

interface ProductVariant {
  id: string
  type: string
  value: string
  stock: string
  priceAdjustment: string
}

interface ProductFormData {
  name: string
  description: string
  price: string
  currency: "CRC" | "USD"
  category: string
  brand_type: "own" | "existing" | "other" | ""
  brand_id: string
  custom_brand_name: string
  stock_quantity: string
  has_variants: boolean
  variants: ProductVariant[]
  is_active: boolean
  is_promoted: boolean
  productFiles: any[]
  variantFiles: { [key: string]: any[] }
}

export default function CrearProducto() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const { brands, loading: brandsLoading } = useBrandsForForm()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    currency: "CRC",
    category: "",
    brand_type: "",
    brand_id: "",
    custom_brand_name: "",
    stock_quantity: "0",
    has_variants: false,
    variants: [],
    is_active: true,
    is_promoted: false,
    productFiles: [],
    variantFiles: {},
  })

  const categories = [
    "Electrónicos",
    "Ropa y Accesorios",
    "Hogar y Jardín",
    "Deportes y Recreación",
    "Salud y Belleza",
    "Libros y Medios",
    "Juguetes y Juegos",
    "Automóviles",
    "Servicios",
    "Otros",
  ]

  const variantTypes = [
    { value: "color", label: "Color", placeholder: "Ej: Rojo, Azul, Negro" },
    { value: "talla", label: "Talla", placeholder: "Ej: XS, S, M, L, XL" },
    { value: "tamaño", label: "Tamaño", placeholder: "Ej: 32GB, 64GB, 128GB" },
    { value: "material", label: "Material", placeholder: "Ej: Algodón, Poliéster" },
    { value: "sabor", label: "Sabor", placeholder: "Ej: Vainilla, Chocolate" },
    { value: "modelo", label: "Modelo", placeholder: "Ej: Pro, Standard, Lite" },
    { value: "capacidad", label: "Capacidad", placeholder: "Ej: 500ml, 1L, 2L" },
    { value: "otro", label: "Otro", placeholder: "Especifica el tipo" },
  ]

  // Conversión aproximada CRC a USD
  const exchangeRate = 520
  const convertPrice = (price: string, fromCurrency: string) => {
    const numPrice = Number.parseFloat(price)
    if (isNaN(numPrice)) return ""

    if (fromCurrency === "CRC") {
      return (numPrice / exchangeRate).toFixed(2)
    } else {
      return (numPrice * exchangeRate).toFixed(0)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleBrandTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const brandType = e.target.value as ProductFormData["brand_type"]
    setFormData((prev) => ({
      ...prev,
      brand_type: brandType,
      brand_id: "",
      custom_brand_name: "",
    }))
  }

  const handleCheckboxChange = (name: keyof ProductFormData, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
      // Si desactiva variantes, limpiar la lista
      ...(name === "has_variants" && !checked && { variants: [] }),
    }))
  }

  // Funciones para manejar variantes
  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: Date.now().toString(),
      type: "",
      value: "",
      stock: "0",
      priceAdjustment: "0",
    }
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }))
  }

  const removeVariant = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((variant) => variant.id !== id),
    }))
  }

  const updateVariant = (id: string, field: keyof ProductVariant, value: string) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant) => (variant.id === id ? { ...variant, [field]: value } : variant)),
    }))
  }

  // Funciones para manejar archivos
  const handleProductFilesChange = (files: any[]) => {
    setFormData((prev) => ({
      ...prev,
      productFiles: files,
    }))
  }

  const handleVariantFilesChange = (variantId: string, files: any[]) => {
    setFormData((prev) => ({
      ...prev,
      variantFiles: {
        ...prev.variantFiles,
        [variantId]: files,
      },
    }))
  }

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del producto es requerido",
        variant: "destructive",
      })
      return false
    }

    if (!formData.price || Number.parseFloat(formData.price) <= 0) {
      toast({
        title: "Error",
        description: "El precio debe ser mayor a 0",
        variant: "destructive",
      })
      return false
    }

    if (!formData.category.trim()) {
      toast({
        title: "Error",
        description: "La categoría es requerida",
        variant: "destructive",
      })
      return false
    }

    if (!formData.has_variants && (!formData.stock_quantity || Number.parseInt(formData.stock_quantity) < 0)) {
      toast({
        title: "Error",
        description: "La cantidad en stock no puede ser negativa",
        variant: "destructive",
      })
      return false
    }

    // Validar marca según el tipo seleccionado
    if (formData.brand_type === "existing" && !formData.brand_id) {
      toast({
        title: "Error",
        description: "Debes seleccionar una marca existente",
        variant: "destructive",
      })
      return false
    }

    if (formData.brand_type === "other" && !formData.custom_brand_name.trim()) {
      toast({
        title: "Error",
        description: "Debes especificar el nombre de la marca",
        variant: "destructive",
      })
      return false
    }

    // Validar variantes si están habilitadas
    if (formData.has_variants) {
      if (formData.variants.length === 0) {
        toast({
          title: "Error",
          description: "Debes agregar al menos una variante",
          variant: "destructive",
        })
        return false
      }

      for (const variant of formData.variants) {
        if (!variant.type || !variant.value) {
          toast({
            title: "Error",
            description: "Todas las variantes deben tener tipo y valor",
            variant: "destructive",
          })
          return false
        }

        if (!variant.stock || Number.parseInt(variant.stock) < 0) {
          toast({
            title: "Error",
            description: "El stock de cada variante debe ser mayor o igual a 0",
            variant: "destructive",
          })
          return false
        }
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)

    try {
      // Convertir precio a USD si está en CRC
      let priceInUSD = Number.parseFloat(formData.price)
      if (formData.currency === "CRC") {
        priceInUSD = priceInUSD / exchangeRate
      }

      // Determinar brand_id según el tipo de marca
      let finalBrandId = null
      let brandName = null

      if (formData.brand_type === "own") {
        finalBrandId = null
        brandName = user?.name || "Marca Propia"
      } else if (formData.brand_type === "existing") {
        finalBrandId = Number.parseInt(formData.brand_id)
      } else if (formData.brand_type === "other") {
        finalBrandId = null
        brandName = formData.custom_brand_name
      }

      // Procesar variantes
      const processedVariants = formData.has_variants
        ? formData.variants.map((variant) => ({
            id: variant.id, // Mantener ID temporal para asociar archivos
            type: variant.type,
            value: variant.value,
            stock: Number.parseInt(variant.stock),
            price_adjustment: Number.parseFloat(variant.priceAdjustment) || 0,
          }))
        : []

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: priceInUSD,
        currency: formData.currency,
        category: formData.category,
        seller_id: user?.id,
        brand_id: finalBrandId,
        brand_name: brandName,
        brand_type: formData.brand_type,
        stock_quantity: formData.has_variants ? 0 : Number.parseInt(formData.stock_quantity),
        has_variants: formData.has_variants,
        variants: processedVariants,
        is_active: formData.is_active,
        is_promoted: formData.is_promoted,
      }

      console.log("📦 Enviando datos del producto:", productData)

      // Crear FormData para enviar archivos
      const submitFormData = new FormData()

      // Agregar datos del producto como JSON
      submitFormData.append("productData", JSON.stringify(productData))

      // Agregar archivos principales
      formData.productFiles.forEach((file, index) => {
        if (file.file) {
          submitFormData.append(`file_main_${index}`, file.file)
        }
      })

      // Agregar archivos de variantes
      Object.entries(formData.variantFiles).forEach(([variantId, files]) => {
        files.forEach((file, index) => {
          if (file.file) {
            submitFormData.append(`file_variant_${variantId}_${index}`, file.file)
          }
        })
      })

      console.log("📤 Enviando FormData con archivos...")

      const response = await fetch("/api/products/create", {
        method: "POST",
        body: submitFormData, // No Content-Type header para FormData
      })

      console.log("📥 Respuesta recibida:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      })

      // Verificar si la respuesta es JSON
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text()
        console.error("❌ Respuesta no es JSON:", textResponse)
        throw new Error(
          `Error del servidor: ${response.status} ${response.statusText}. Respuesta: ${textResponse.substring(0, 200)}...`,
        )
      }

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Error al crear el producto")
      }

      toast({
        title: "¡Éxito!",
        description: `Producto creado exitosamente${formData.has_variants ? ` con ${formData.variants.length} variantes` : ""} y ${result.files_uploaded || 0} archivos`,
      })

      console.log("✅ Producto creado:", result)

      router.push("/vendedor/dashboard")
    } catch (error) {
      console.error("❌ Error al crear producto:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear el producto",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <VendorProtectedRoute>
      <main className="bg-black min-h-screen">
        <VendorNavbarWrapper />
        <div className="lg:ml-20 min-h-screen bg-black">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.back()}
                  className="flex items-center bg-black border-gray-600 text-white hover:bg-gray-900 hover:border-gray-500"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Volver
                </Button>
                <div>
                  <h1 className="text-3xl font-serif text-white">Crear Nuevo Producto</h1>
                  <p className="text-gray-400">Agrega un nuevo producto a tu tienda</p>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Información Básica */}
                <div className="bg-black rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center mb-6">
                    <Package className="mr-3 text-yellow-500" size={24} />
                    <h2 className="text-xl font-semibold text-white">Información Básica</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <Label htmlFor="name" className="text-gray-300 font-medium">
                        Nombre del Producto *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Ej: iPhone 15 Pro Max 256GB"
                        required
                        className="mt-1 bg-black border-gray-600 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="description" className="text-gray-300 font-medium">
                        Descripción
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe tu producto, características, beneficios, especificaciones técnicas..."
                        rows={4}
                        className="mt-1 bg-black border-gray-600 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500 resize-none"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category" className="text-gray-300 font-medium">
                        Categoría *
                      </Label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="mt-1 w-full px-3 py-2 bg-black border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      >
                        <option value="" className="bg-black text-gray-400">
                          Selecciona una categoría
                        </option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat} className="bg-black text-white">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tipo de Marca */}
                    <div>
                      <Label htmlFor="brand_type" className="text-gray-300 font-medium">
                        Tipo de Marca *
                      </Label>
                      <select
                        id="brand_type"
                        name="brand_type"
                        value={formData.brand_type}
                        onChange={handleBrandTypeChange}
                        required
                        className="mt-1 w-full px-3 py-2 bg-black border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      >
                        <option value="" className="bg-black text-gray-400">
                          Selecciona el tipo de marca
                        </option>
                        <option value="own" className="bg-black text-white">
                          🏪 Marca Propia (Mi emprendimiento)
                        </option>
                        <option value="existing" className="bg-black text-white">
                          🏢 Marca Existente (Apple, Samsung, etc.)
                        </option>
                        <option value="other" className="bg-black text-white">
                          ✏️ Otra Marca (Especificar)
                        </option>
                      </select>
                    </div>

                    {/* Selector de Marca Existente */}
                    {formData.brand_type === "existing" && (
                      <div className="md:col-span-2">
                        <Label htmlFor="brand_id" className="text-gray-300 font-medium">
                          Seleccionar Marca *
                        </Label>
                        <select
                          id="brand_id"
                          name="brand_id"
                          value={formData.brand_id}
                          onChange={handleInputChange}
                          required
                          className="mt-1 w-full px-3 py-2 bg-black border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                          disabled={brandsLoading}
                        >
                          <option value="" className="bg-black text-gray-400">
                            {brandsLoading ? "Cargando marcas..." : "Selecciona una marca"}
                          </option>
                          {brands.map((brand) => (
                            <option key={brand.id} value={brand.id} className="bg-black text-white">
                              {brand.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Campo para Otra Marca */}
                    {formData.brand_type === "other" && (
                      <div className="md:col-span-2">
                        <Label htmlFor="custom_brand_name" className="text-gray-300 font-medium">
                          Nombre de la Marca *
                        </Label>
                        <Input
                          id="custom_brand_name"
                          name="custom_brand_name"
                          value={formData.custom_brand_name}
                          onChange={handleInputChange}
                          placeholder="Ej: Mi Marca Artesanal"
                          required
                          className="mt-1 bg-black border-gray-600 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Especifica el nombre de la marca que no está en nuestra lista
                        </p>
                      </div>
                    )}

                    {/* Información sobre Marca Propia */}
                    {formData.brand_type === "own" && (
                      <div className="md:col-span-2 bg-gray-900 border border-gray-600 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Building2 className="text-yellow-500" size={20} />
                          <h3 className="text-white font-medium">Marca Propia Seleccionada</h3>
                        </div>
                        <p className="text-gray-300 text-sm">
                          Este producto será asociado a tu marca personal: <strong>{user?.name}</strong>
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          Perfecto para emprendedores y productos artesanales
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Precio y Stock */}
                <div className="bg-black rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center mb-6">
                    <DollarSign className="mr-3 text-green-500" size={24} />
                    <h2 className="text-xl font-semibold text-white">Precio y Stock</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="price" className="text-gray-300 font-medium">
                        Precio Base *
                      </Label>
                      <div className="space-y-3 mt-1">
                        {/* Selector de Moneda */}
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, currency: "CRC" }))}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              formData.currency === "CRC"
                                ? "bg-yellow-500 text-black"
                                : "bg-gray-800 text-gray-300 border border-gray-600"
                            }`}
                          >
                            ₡ CRC
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData((prev) => ({ ...prev, currency: "USD" }))}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              formData.currency === "USD"
                                ? "bg-yellow-500 text-black"
                                : "bg-gray-800 text-gray-300 border border-gray-600"
                            }`}
                          >
                            $ USD
                          </button>
                        </div>

                        {/* Campo de Precio */}
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            {formData.currency === "CRC" ? "₡" : "$"}
                          </span>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            step={formData.currency === "CRC" ? "1" : "0.01"}
                            min="0"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder={formData.currency === "CRC" ? "50000" : "100.00"}
                            required
                            className="pl-8 bg-black border-gray-600 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500"
                          />
                        </div>

                        {/* Conversión de Moneda */}
                        {formData.price && (
                          <p className="text-sm text-gray-400">
                            Equivale a:{" "}
                            <span className="text-yellow-500">
                              {formData.currency === "CRC" ? "$" : "₡"}
                              {convertPrice(formData.price, formData.currency)}{" "}
                              {formData.currency === "CRC" ? "USD" : "CRC"}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stock solo si no tiene variantes */}
                    {!formData.has_variants && (
                      <div>
                        <Label htmlFor="stock_quantity" className="text-gray-300 font-medium">
                          Cantidad en Stock *
                        </Label>
                        <Input
                          id="stock_quantity"
                          name="stock_quantity"
                          type="number"
                          min="0"
                          value={formData.stock_quantity}
                          onChange={handleInputChange}
                          placeholder="0"
                          required
                          className="mt-1 bg-black border-gray-600 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500"
                        />
                        <p className="text-sm text-gray-500 mt-1">Unidades disponibles para venta</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Variantes */}
                <div className="bg-black rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center mb-6">
                    <Palette className="mr-3 text-purple-500" size={24} />
                    <h2 className="text-xl font-semibold text-white">Variantes del Producto</h2>
                  </div>

                  {/* Checkbox para habilitar variantes */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="has_variants"
                        checked={formData.has_variants}
                        onCheckedChange={(checked) => handleCheckboxChange("has_variants", checked as boolean)}
                        className="border-gray-600 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                      />
                      <div className="flex flex-col">
                        <Label htmlFor="has_variants" className="text-white font-medium">
                          Este producto tiene variantes
                        </Label>
                        <p className="text-sm text-gray-500">Ej: Diferentes colores, tallas, tamaños, sabores, etc.</p>
                      </div>
                    </div>
                  </div>

                  {/* Grid de variantes */}
                  {formData.has_variants && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-gray-300">Configura las variantes de tu producto:</p>
                        <Button
                          type="button"
                          onClick={addVariant}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                          size="sm"
                        >
                          <Plus size={16} className="mr-2" />
                          Agregar Variante
                        </Button>
                      </div>

                      {formData.variants.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          <Palette size={48} className="mx-auto mb-4 text-gray-600" />
                          <p>No hay variantes configuradas</p>
                          <p className="text-sm">Haz clic en "Agregar Variante" para comenzar</p>
                        </div>
                      )}

                      {formData.variants.map((variant, index) => (
                        <div key={variant.id} className="bg-gray-900 border border-gray-600 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-white font-medium">Variante #{index + 1}</h4>
                            <Button
                              type="button"
                              onClick={() => removeVariant(variant.id)}
                              variant="outline"
                              size="sm"
                              className="bg-red-900 border-red-700 text-red-300 hover:bg-red-800"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Tipo de variante */}
                            <div>
                              <Label className="text-gray-300 text-sm">Tipo *</Label>
                              <select
                                value={variant.type}
                                onChange={(e) => updateVariant(variant.id, "type", e.target.value)}
                                className="mt-1 w-full px-3 py-2 bg-black border border-gray-600 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              >
                                <option value="">Seleccionar</option>
                                {variantTypes.map((type) => (
                                  <option key={type.value} value={type.value}>
                                    {type.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Valor de la variante */}
                            <div>
                              <Label className="text-gray-300 text-sm">Valor *</Label>
                              <Input
                                value={variant.value}
                                onChange={(e) => updateVariant(variant.id, "value", e.target.value)}
                                placeholder={
                                  variant.type
                                    ? variantTypes.find((t) => t.value === variant.type)?.placeholder
                                    : "Ej: Rojo, XL, 64GB"
                                }
                                className="mt-1 bg-black border-gray-600 text-white placeholder-gray-500 text-sm focus:border-purple-500 focus:ring-purple-500"
                              />
                            </div>

                            {/* Stock de la variante */}
                            <div>
                              <Label className="text-gray-300 text-sm">Stock *</Label>
                              <Input
                                type="number"
                                min="0"
                                value={variant.stock}
                                onChange={(e) => updateVariant(variant.id, "stock", e.target.value)}
                                placeholder="0"
                                className="mt-1 bg-black border-gray-600 text-white placeholder-gray-500 text-sm focus:border-purple-500 focus:ring-purple-500"
                              />
                            </div>

                            {/* Ajuste de precio */}
                            <div>
                              <Label className="text-gray-300 text-sm">
                                Ajuste Precio ({formData.currency === "CRC" ? "₡" : "$"})
                              </Label>
                              <Input
                                type="number"
                                step={formData.currency === "CRC" ? "1" : "0.01"}
                                value={variant.priceAdjustment}
                                onChange={(e) => updateVariant(variant.id, "priceAdjustment", e.target.value)}
                                placeholder="0"
                                className="mt-1 bg-black border-gray-600 text-white placeholder-gray-500 text-sm focus:border-purple-500 focus:ring-purple-500"
                              />
                              <p className="text-xs text-gray-500 mt-1">+/- del precio base</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {formData.variants.length > 0 && (
                        <div className="bg-gray-900 border border-gray-600 rounded-lg p-4">
                          <h4 className="text-white font-medium mb-2">Resumen de Stock Total</h4>
                          <p className="text-gray-300">
                            Total de unidades:{" "}
                            <span className="text-yellow-500 font-bold">
                              {formData.variants.reduce(
                                (total, variant) => total + (Number.parseInt(variant.stock) || 0),
                                0,
                              )}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Configuración */}
                <div className="bg-black rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center mb-6">
                    <Tag className="mr-3 text-blue-500" size={24} />
                    <h2 className="text-xl font-semibold text-white">Configuración de Visibilidad</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => handleCheckboxChange("is_active", checked as boolean)}
                        className="border-gray-600 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500 mt-1"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="is_active" className="text-white font-medium">
                            Producto Activo
                          </Label>
                          <EyeIcon size={16} className="text-green-500" />
                        </div>
                        <p className="text-sm text-gray-500">
                          <strong>Activo:</strong> El producto aparece en tu tienda y los clientes pueden comprarlo
                          <br />
                          <strong>Inactivo:</strong> El producto está oculto y no se puede comprar
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="is_promoted"
                        checked={formData.is_promoted}
                        onCheckedChange={(checked) => handleCheckboxChange("is_promoted", checked as boolean)}
                        className="border-gray-600 data-[state=checked]:bg-yellow-500 data-[state=checked]:border-yellow-500 mt-1"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <Label htmlFor="is_promoted" className="text-white font-medium">
                            Producto Promocionado
                          </Label>
                          <Star size={16} className="text-yellow-500" />
                        </div>
                        <p className="text-sm text-gray-500">
                          <strong>Promocionado:</strong> El producto aparece destacado en la página principal
                          <br />
                          <strong>Normal:</strong> El producto aparece en su categoría sin destacar
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Archivos Multimedia */}
                <div className="bg-black rounded-lg border border-gray-700 p-6">
                  <div className="flex items-center mb-6">
                    <ImageIcon className="mr-3 text-pink-500" size={24} />
                    <h2 className="text-xl font-semibold text-white">Archivos Multimedia</h2>
                  </div>

                  {/* Archivos del producto principal */}
                  <div className="mb-8">
                    <FileUpload
                      maxFiles={formData.has_variants ? 8 : 8}
                      onFilesChange={handleProductFilesChange}
                      existingFiles={formData.productFiles}
                      title="Imágenes Principales del Producto"
                      hasVariants={formData.has_variants}
                      totalProductFiles={
                        formData.productFiles.length +
                        Object.values(formData.variantFiles).reduce((acc, files) => acc + files.length, 0)
                      }
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Estas imágenes se mostrarán en la galería principal del producto
                    </p>
                  </div>

                  {/* Archivos por variante */}
                  {formData.has_variants && formData.variants.length > 0 && (
                    <div className="space-y-6">
                      <div className="border-t border-gray-600 pt-6">
                        <h3 className="text-lg font-medium text-white mb-4">Imágenes por Variante</h3>
                        <p className="text-sm text-gray-500 mb-6">
                          Puedes agregar hasta 2 imágenes específicas para cada variante
                        </p>
                      </div>

                      {formData.variants.map((variant, index) => (
                        <div key={variant.id} className="bg-gray-900 border border-gray-600 rounded-lg p-4">
                          <h4 className="text-white font-medium mb-4">
                            Variante: {variant.type} - {variant.value}
                          </h4>
                          <FileUpload
                            maxFiles={2}
                            onFilesChange={(files) => handleVariantFilesChange(variant.id, files)}
                            existingFiles={formData.variantFiles[variant.id] || []}
                            title={`Imágenes para ${variant.value}`}
                            variantId={Number.parseInt(variant.id)}
                            hasVariants={true}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Resumen de archivos */}
                  {(formData.productFiles.length > 0 || Object.keys(formData.variantFiles).length > 0) && (
                    <div className="mt-6 bg-gray-900 border border-gray-600 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-2">Resumen de Archivos</h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>
                          Imágenes principales: <span className="text-yellow-500">{formData.productFiles.length}</span>
                        </p>
                        {Object.entries(formData.variantFiles).map(([variantId, files]) => {
                          const variant = formData.variants.find((v) => v.id === variantId)
                          return (
                            <p key={variantId}>
                              {variant?.value}: <span className="text-yellow-500">{files.length}</span> imágenes
                            </p>
                          )
                        })}
                        <p className="pt-2 border-t border-gray-700">
                          Total:{" "}
                          <span className="text-yellow-500 font-bold">
                            {formData.productFiles.length +
                              Object.values(formData.variantFiles).reduce((acc, files) => acc + files.length, 0)}
                          </span>{" "}
                          archivos
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botones de Acción */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex items-center bg-black border-gray-600 text-white hover:bg-gray-900 hover:border-gray-500"
                  >
                    <Eye size={16} className="mr-2" />
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex items-center bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    ) : (
                      <Save size={16} className="mr-2" />
                    )}
                    {loading ? "Creando..." : "Crear Producto"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </VendorProtectedRoute>
  )
}
