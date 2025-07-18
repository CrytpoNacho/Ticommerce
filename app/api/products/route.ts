// Migrado de Supabase a PostgreSQL Local
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)

  const limit = parseInt(searchParams.get("limit") || "10")
  const sortBy = searchParams.get("sortBy") || "created_at"
  const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc"
  const category = searchParams.get("category") || undefined
  const search = searchParams.get("search") || undefined
  const minPrice = searchParams.get("minPrice")
    ? parseFloat(searchParams.get("minPrice")!)
    : undefined
  const maxPrice = searchParams.get("maxPrice")
    ? parseFloat(searchParams.get("maxPrice")!)
    : undefined

  try {
    const products = await prisma.products.findMany({
      where: {
        is_active: true,
        ...(category ? { category } : {}),
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(minPrice !== undefined ? { price: { gte: minPrice } } : {}),
        ...(maxPrice !== undefined ? { price: { lte: maxPrice } } : {}),
      },
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        sellers: {
          include: {
            users: true,
          },
        },
        brands: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        product_media: {
          orderBy: {
            display_order: "asc",
          },
        },
      },
    })

    const productsWithImages = products.map((product) => {
      const mediaSinVariante = product.product_media.find((img) => img.variant_id === null)
      const mediaConVariante = product.product_media.find((img) => img.variant_id !== null)

      return {
        ...product,
        primary_image:
          mediaSinVariante?.file_url ||
          mediaConVariante?.file_url ||
          null,
      }
    })

    return NextResponse.json({ products: productsWithImages }, { status: 200 })
  } catch (err: any) {
    console.error("❌ Error cargando productos:", err)
    return NextResponse.json(
      { error: "Error interno del servidor", message: err.message },
      { status: 500 }
    )
  }
}
