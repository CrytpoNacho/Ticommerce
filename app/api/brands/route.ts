// Migrado de Supabase a PostgreSQL Local
import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// GET - Listar todas las marcas
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Iniciando búsqueda de marcas...")

    const { searchParams } = new URL(request.url)
    const includeProductCount = searchParams.get("includeProductCount") === "true"
    const isActiveParam = searchParams.get("isActive")
    const limitParam = searchParams.get("limit")

    const whereClause =
      isActiveParam !== null ? { is_active: isActiveParam === "true" } : {}

    const take = limitParam && !isNaN(parseInt(limitParam)) ? parseInt(limitParam) : undefined

    const brands = await prisma.brands.findMany({
      where: whereClause,
      orderBy: { name: "asc" },
      take,
    })

    console.log(`✅ Marcas encontradas: ${brands.length}`)

    if (includeProductCount) {
      const brandsWithCount = await Promise.all(
        brands.map(async (brand) => {
          try {
            const count = await prisma.products.count({
              where: {
                brand_id: Number(brand.id),
                is_active: true,
              },
            })

            return {
              ...brand,
              product_count: count,
            }
          } catch (err) {
            console.error(`❌ Error al contar productos de marca ${brand.id}:`, err)
            return {
              ...brand,
              product_count: 0,
            }
          }
        })
      )

      return NextResponse.json({ brands: brandsWithCount }, { status: 200 })
    }

    return NextResponse.json({ brands }, { status: 200 })
  } catch (error) {
    console.error("💥 Error crítico en brands API:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    )
  }
}

// POST - Crear nueva marca
export async function POST(request: NextRequest) {
  try {
    console.log("🆕 Creando nueva marca...")

    const { name, slug, description, image_url, website_url } = await request.json()

    if (!name || !slug) {
      return NextResponse.json({ error: "Nombre y slug son requeridos" }, { status: 400 })
    }

    const existingBrand = await prisma.brands.findUnique({
      where: { slug },
    })

    if (existingBrand) {
      return NextResponse.json({ error: "Ya existe una marca con ese slug" }, { status: 400 })
    }

    const brand = await prisma.brands.create({
      data: {
        name,
        slug,
        description,
        image_url,
        website_url,
        is_active: true,
        created_at: new Date(),
      },
    })

    console.log("✅ Marca creada:", brand.id)

    return NextResponse.json(
      {
        message: "Marca creada exitosamente",
        brand,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("💥 Error crítico en create brand API:", error)
    return NextResponse.json(
      {
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    )
  }
}
