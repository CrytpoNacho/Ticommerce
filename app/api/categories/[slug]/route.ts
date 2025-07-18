// Migrado de Supabase a PostgreSQL Local

import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET - Obtener categoría por slug
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    const category = await prisma.category.findUnique({
      where: { slug },
    })

    if (!category) {
      return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 })
    }

    const productCount = await prisma.product.count({
      where: {
        category: slug,
        is_active: true,
      },
    })

    const categoryWithCount = {
      ...category,
      product_count: productCount || 0,
    }

    return NextResponse.json({ category: categoryWithCount }, { status: 200 })
  } catch (error) {
    console.error("Error in category API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
