import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// DELETE - Eliminar item específico del carrito
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cartItemId = searchParams.get("cartItemId")
    const userId = searchParams.get("userId")

    if (!cartItemId || !userId) {
      return NextResponse.json({ error: "ID del item y usuario son requeridos" }, { status: 400 })
    }

    // Verificar que el item pertenece al usuario antes de eliminarlo
    const cartItem = await prisma.cart_items.findFirst({
      where: {
        id: Number(cartItemId),
        user_id: Number(userId),
      },
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Item del carrito no encontrado" }, { status: 404 })
    }

    // Eliminar item
    await prisma.cart_items.delete({
      where: { id: cartItem.id },
    })

    return NextResponse.json(
      {
        message: "Producto eliminado del carrito exitosamente",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in remove from cart API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
