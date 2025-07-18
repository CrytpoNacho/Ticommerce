// Migrado de Supabase a PostgreSQL Local
import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    console.log(`🔍 Obteniendo producto ID: ${id}`)

    const product = await prisma.products.findUnique({
      where: { id: parseInt(id) },
      include: {
        sellers: {
          include: {
            users: true,
          },
        },
        brands: true,
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    console.log(`✅ Producto encontrado: ${product.name}`)

    const productImages = await prisma.product_media.findMany({
      where: {
        product_id: product.id,
        variant_id: null,
      },
      orderBy: {
        display_order: "asc",
      },
    })

    let variants = []

    if (product.has_variants) {
      console.log("🔍 Buscando variantes...")

      const productVariants = await prisma.product_variants.findMany({
        where: {
          product_id: product.id,
          is_active: true,
        },
        orderBy: {
          id: "asc",
        },
      })

      console.log(`📊 Variantes encontradas: ${productVariants.length}`)

      variants = await Promise.all(
        productVariants.map(async (variant) => {
          const variantImages = await prisma.product_media.findMany({
            where: {
              variant_id: variant.id,
            },
            orderBy: {
              display_order: "asc",
            },
          })

          return {
            id: variant.id,
            sku: variant.sku,
            price: variant.price,
            stock_quantity: variant.stock_quantity,
            is_active: variant.is_active,
            attributes: variant.attributes ?? {},
            images: variantImages,
          }
        }),
      )

      console.log(`✅ Total variantes procesadas: ${variants.length}`)
    }

    const response = {
      product: {
        ...product,
        currency: product.currency || "CRC",
        images: productImages,
      },
      variants,
      reviews: [],
      stats: {
        avgRating: 4.5,
        reviewCount: 24,
      },
    }

    console.log(`🎉 Respuesta final - Variantes: ${variants.length}`)
    return NextResponse.json(response, { status: 200 })
  } catch (error: any) {
    console.error("❌ Error in product API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
