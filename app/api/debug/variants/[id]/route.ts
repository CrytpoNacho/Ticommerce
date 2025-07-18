// Migrado de Supabase a PostgreSQL Local

import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    // Obtener variantes básicas del producto
    const variants = await prisma.productVariant.findMany({
      where: { product_id: id },
    })

    // Obtener los IDs de las variantes para buscar sus valores
    const variantIds = variants.map((v) => v.id)

    // Obtener atributos de las variantes
    const variant_values = await prisma.productVariantValue.findMany({
      where: {
        variant_id: { in: variantIds },
      },
      include: {
        variant_values: {
          include: {
            variant_options: true,
          },
        },
      },
    })

    // Obtener todas las opciones de variantes
    const variant_options = await prisma.variantOption.findMany()

    // Obtener todos los valores posibles de variantes
    const all_variant_values = await prisma.variantValue.findMany()

    return NextResponse.json({
      product_id: id,
      variants,
      variant_values,
      variant_options,
      all_variant_values,
      errors: null,
    })
  } catch (error) {
    console.error("Error in debug variants API:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Error desconocido" }, { status: 500 })
  }
}
