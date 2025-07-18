// Migrado de Supabase a PostgreSQL Local

import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Iniciando creación de producto...")
    const formData = await request.formData()
    const productDataStr = formData.get("productData") as string
    const productData = JSON.parse(productDataStr)

    const {
      name,
      description,
      price,
      currency,
      category,
      seller_id,
      brand_id,
      brand_type,
      brand_name,
      custom_brand_name,
      stock_quantity,
      has_variants,
      variants,
      is_active,
      is_promoted,
    } = productData

    if (!name || !price || !category || !seller_id) {
      return NextResponse.json({ error: "Nombre, precio, categoría y vendedor son requeridos" }, { status: 400 })
    }

    const seller = await prisma.sellers.findUnique({ where: { user_id: seller_id } })
    if (!seller) {
      return NextResponse.json({ error: "Vendedor no encontrado" }, { status: 404 })
    }

    let finalBrandId: number | null = null
    let finalCustomBrandName: string | null = null

    if (brand_type === "existing" && brand_id) {
      finalBrandId = parseInt(brand_id)
    } else if (brand_type === "other" && custom_brand_name) {
      finalCustomBrandName = custom_brand_name
    } else if (brand_type === "own") {
      finalCustomBrandName = brand_name || "Marca Propia"
    }

    const newProduct = await prisma.products.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        price: parseFloat(price),
        currency: currency || "CRC",
        category,
        seller_id,
        brand_id: finalBrandId,
        brand_type: brand_type || null,
        custom_brand_name: finalCustomBrandName,
        stock_quantity: has_variants ? 0 : parseInt(stock_quantity || "0"),
        has_variants: Boolean(has_variants),
        is_active: is_active !== undefined ? is_active : true,
        is_promoted: is_promoted !== undefined ? is_promoted : false,
        created_at: new Date(),
      },
    })

    let variantsCreated = 0
    const createdVariants: any[] = []

    if (has_variants && Array.isArray(variants) && variants.length > 0) {
      for (const variant of variants) {
        if (!variant.type || !variant.value) continue

        const variantPrice = parseFloat(price) + (parseFloat(variant.priceAdjustment || "0"))
        const attributes = { [variant.type]: variant.value }

        const createdVariant = await prisma.product_variants.create({
          data: {
            product_id: newProduct.id,
            sku: `${newProduct.id}-${variant.type}-${variant.value}`.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
            price: variantPrice,
            stock_quantity: parseInt(variant.stock || "0"),
            is_active: true,
            attributes,
          },
        })

        createdVariants.push({ ...createdVariant, originalId: variant.id })
        variantsCreated++
      }
    }

    const uploadedFiles: any[] = []
    const fileEntries = Array.from(formData.entries()).filter(([key]) => key.startsWith("file_"))

    for (const [key, file] of fileEntries) {
      if (!(file instanceof File)) continue

      const keyParts = key.split("_")
      const isVariant = keyParts[1] === "variant"
      const variantOriginalId = isVariant ? keyParts[2] : null
      const fileIndex = keyParts[keyParts.length - 1]

      const timestamp = Date.now()
      const fileExtension = file.name.split(".").pop()
      const fileName = `product-${newProduct.id}${variantOriginalId ? `-variant-${variantOriginalId}` : ""}-${timestamp}-${fileIndex}.${fileExtension}`

      const blob = await put(fileName, file, { access: "public" })

      let realVariantId = null
      if (isVariant && variantOriginalId) {
        const matchingVariant = createdVariants.find((v) => v.originalId === variantOriginalId)
        realVariantId = matchingVariant?.id || null
      }

      const savedMedia = await prisma.product_media.create({
        data: {
          product_id: newProduct.id,
          variant_id: realVariantId,
          file_url: blob.url,
          file_name: file.name,
          file_type: "image",
          file_size: file.size,
          mime_type: file.type,
          is_primary: fileIndex === "0",
          display_order: parseInt(fileIndex),
        },
      })

      uploadedFiles.push(savedMedia)
    }

    return NextResponse.json({
      success: true,
      message: "Producto creado exitosamente",
      product: {
        id: newProduct.id,
        name: newProduct.name,
        price: newProduct.price,
        currency: newProduct.currency,
        has_variants: newProduct.has_variants,
      },
      variants_created: variantsCreated,
      files_uploaded: uploadedFiles.length,
    }, { status: 201 })
  } catch (error) {
    console.error("💥 Error crítico en create product API:", error)
    return NextResponse.json({
      success: false,
      error: "Error interno del servidor",
      message: error instanceof Error ? error.message : "Error desconocido",
      timestamp: new Date().toISOString(),
      stack: process.env.NODE_ENV === "development" && error instanceof Error ? error.stack : null,
    }, { status: 500 })
  }
}
