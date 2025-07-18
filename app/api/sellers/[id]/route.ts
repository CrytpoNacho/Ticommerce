// Migrado de Supabase a PostgreSQL Local

import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sellerId = params.id
    console.log("🔍 Obteniendo información del vendedor ID:", sellerId)

    // Obtener información del vendedor junto con usuario relacionado
    const sellerData = await prisma.seller.findUnique({
      where: { user_id: sellerId },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    })

    if (!sellerData) {
      console.log("❌ Vendedor no encontrado")
      return NextResponse.json({ error: "Vendedor no encontrado" }, { status: 404 })
    }

    console.log("✅ Vendedor encontrado:", sellerData.users?.name)

    // Obtener productos del vendedor
    const productsData = await prisma.product.findMany({
      where: {
        seller_id: sellerId,
        is_active: true,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        category: true,
        is_active: true,
        is_promoted: true,
        stock_quantity: true,
        created_at: true,
      },
      orderBy: {
        created_at: "desc",
      },
    })

    console.log("📦 Productos encontrados:", productsData.length)

    // Estadísticas simuladas (puedes reemplazar luego por datos reales)
    const stats = {
      rating: 4.8,
      reviewCount: 124,
      positiveResponseRate: 98,
      totalSales: productsData.length * 15,
    }

    return NextResponse.json({
      seller: sellerData,
      products: productsData,
      stats,
    })
  } catch (error) {
    console.error("💥 Error en API de vendedor:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
