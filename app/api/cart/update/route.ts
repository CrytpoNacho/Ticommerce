// Migrado de Supabase a PostgreSQL Local
import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// PUT - Actualizar cantidad de un item del carrito
export async function PUT(request: NextRequest) {
  try {
    const { cartItemId, quantity, userId } = await request.json()

    if (!cartItemId || !quantity || !userId) {
      return NextResponse.json({ error: "ID del item, cantidad y usuario son requeridos" }, { status: 400 })
    }

    if (quantity < 1) {
      return NextResponse.json({ error: "La cantidad debe ser mayor a 0" }, { status: 400 })
    }

    const cartItem = await prisma.cart_items.findFirst({
      where: {
        id: Number(cartItemId),
        user_id: Number(userId),
      },
      include: {
        products: true,
      },
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Item del carrito no encontrado" }, { status: 404 })
    }

    const product = cartItem.products
    if (!product || !product.is_active) {
      return NextResponse.json({ error: "Producto no disponible" }, { status: 400 })
    }

    if (product.stock_quantity < quantity) {
      return NextResponse.json(
        {
          error: `Stock insuficiente. Solo hay ${product.stock_quantity} unidades disponibles`,
        },
        { status: 400 },
      )
    }

    const updatedItem = await prisma.cart_items.update({
      where: {
        id: cartItem.id,
      },
      data: {
        quantity,
        updated_at: new Date(),
      },
      include: {
        products: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        message: "Cantidad actualizada exitosamente",
        cartItem: updatedItem,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in update cart API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
