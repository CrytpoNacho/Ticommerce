// Migrado de Supabase a PostgreSQL Local

import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Obtener todas las categorías únicas de productos activos
    const products = await prisma.products.findMany({
      where: {
        is_active: true,
        category: {
          not: null,
        },
      },
      select: {
        category: true,
      },
    })

    // Extraer, limpiar y deduplicar categorías
    const categories = Array.from(
      new Set(
        products
          .map((p) => p.category?.trim())
          .filter((c): c is string => Boolean(c)),
      )
    )
      .sort()
      .map((category) => ({
        id: category.toLowerCase().replace(/\s+/g, "-"),
        label: category,
        value: category,
      }))

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error in categories API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
