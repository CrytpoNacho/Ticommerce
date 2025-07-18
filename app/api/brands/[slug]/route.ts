// Migrado de Supabase a PostgreSQL Local
import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET - Obtener marca por slug
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    const brand = await prisma.brands.findFirst({
      where: {
        slug,
        is_active: true,
      },
    })

    if (!brand) {
      return NextResponse.json({ error: "Marca no encontrada" }, { status: 404 })
    }

    const productCount = await prisma.products.count({
      where: {
        brand_id: brand.id,
        is_active: true,
      },
    })

    const sampleProducts = await prisma.products.findMany({
      where: {
        brand_id: brand.id,
        is_active: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        description: true,
      },
      take: 6,
    })

    const brandWithDetails = {
      ...brand,
      product_count: productCount,
      sample_products: sampleProducts,
    }

    return NextResponse.json({ brand: brandWithDetails }, { status: 200 })
  } catch (error) {
    console.error("Error in brand API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
