// Migrado de Supabase a PostgreSQL Local

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 Iniciando creación de producto (sin archivos)...")

    const body = await request.json()
    console.log("📦 Body recibido:", JSON.stringify(body, null, 2))

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
    } = body

    if (!name || !price || !category || !seller_id) {
      return NextResponse.json(
        {
          error: "Nombre, precio, categoría y vendedor son requeridos",
          received: { name: !!name, price: !!price, category: !!category, seller_id: !!seller_id },
        },
        { status: 400 },
      )
    }

    const seller = await prisma.seller.findUnique({ where: { user_id: seller_id } })

    if (!seller) {
      return NextResponse.json({ error: "Vendedor no encontrado" }, { status: 404 })
    }

    let finalBrandId = null
    let finalCustomBrandName = null

    if (brand_type === "existing" && brand_id) {
      finalBrandId = parseInt(brand_id)
    } else if (brand_type === "other" && custom_brand_name) {
      finalCustomBrandName = custom_brand_name
    } else if (brand_type === "own") {
      finalCustomBrandName = brand_name || "Marca Propia"
    }

    const product = await prisma.product.create({
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

    if (has_variants && Array.isArray(variants) && variants.length > 0) {
      for (const variant of variants) {
        if (!variant.type || !variant.value) continue

        const variantPrice = parseFloat(price) + (parseFloat(variant.priceAdjustment || "0"))
        const createdVariant = await prisma.productVariant.create({
          data: {
            product_id: product.id,
            sku: `${product.id}-${variant.type}-${variant.value}`.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
            price: variantPrice,
            stock_quantity: parseInt(variant.stock || "0"),
            is_active: true,
          },
        })

        let variantOption = await prisma.variantOption.findUnique({
          where: { name: variant.type },
        })

        if (!variantOption) {
          variantOption = await prisma.variantOption.create({
            data: { name: variant.type },
          })
        }

        let variantValue = await prisma.variantValue.findFirst({
          where: {
            option_id: variantOption.id,
            value: variant.value,
          },
        })

        if (!variantValue) {
          variantValue = await prisma.variantValue.create({
            data: {
              option_id: variantOption.id,
              value: variant.value,
            },
          })
        }

        await prisma.productVariantValue.create({
          data: {
            variant_id: createdVariant.id,
            value_id: variantValue.id,
          },
        })

        variantsCreated++
      }
    }

    const response = {
      success: true,
      message: "Producto creado exitosamente (sin archivos por ahora)",
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        currency: product.currency,
        has_variants: product.has_variants,
      },
      variants_created: variantsCreated,
      note: "Los archivos se agregarán cuando configures BLOB_READ_WRITE_TOKEN",
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error("💥 Error crítico en create product API:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
        message: error instanceof Error ? error.message : "Error desconocido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
