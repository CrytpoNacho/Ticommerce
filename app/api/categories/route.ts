// Migrado de Supabase a PostgreSQL Local

import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET - Listar todas las categorías
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Iniciando búsqueda de categorías...")

    const { searchParams } = new URL(request.url)
    const includeProductCount = searchParams.get("includeProductCount") === "true"

    console.log("📊 Parámetros de búsqueda:", { includeProductCount })

    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    })

    console.log(`✅ Categorías encontradas: ${categories?.length || 0}`)

    if (includeProductCount) {
      console.log("📊 Calculando conteo de productos por categoría...")

      const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
          try {
            const count = await prisma.product.count({
              where: {
                category: category.slug,
                is_active: true,
              },
            })

            return {
              ...category,
              product_count: count,
            }
          } catch (countError) {
            console.error(`❌ Error contando productos para ${category.slug}:`, countError)
            return {
              ...category,
              product_count: 0,
            }
          }
        }),
      )

      return NextResponse.json({ categories: categoriesWithCount }, { status: 200 })
    }

    return NextResponse.json({ categories }, { status: 200 })
  } catch (error) {
    console.error("💥 Error crítico en categories API:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}

// POST - Crear nueva categoría (para administradores)
export async function POST(request: NextRequest) {
  try {
    console.log("🆕 Creando nueva categoría...")

    const { name, slug, description } = await request.json()

    if (!name || !slug) {
      return NextResponse.json({ error: "Nombre y slug son requeridos" }, { status: 400 })
    }

    const existingCategory = await prisma.category.findUnique({ where: { slug } })

    if (existingCategory) {
      return NextResponse.json({ error: "Ya existe una categoría con ese slug" }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        created_at: new Date(),
      },
    })

    console.log("✅ Categoría creada:", category.id)

    return NextResponse.json(
      {
        message: "Categoría creada exitosamente",
        category,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("💥 Error crítico en create category API:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
