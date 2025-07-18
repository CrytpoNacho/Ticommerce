import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// POST - Agregar producto al carrito
export async function POST(request: NextRequest) {
  try {
    const { userId, productId, quantity = 1 } = await request.json()

    if (!userId || !productId) {
      return NextResponse.json({ error: "ID de usuario y producto son requeridos" }, { status: 400 })
    }

    if (quantity < 1) {
      return NextResponse.json({ error: "La cantidad debe ser mayor a 0" }, { status: 400 })
    }

    // Verificar que el producto existe y está activo
    const product = await prisma.products.findUnique({
      where: { id: Number(productId) },
    })

    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    if (!product.is_active) {
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

    const existingItem = await prisma.cart_items.findFirst({
      where: {
        user_id: userId,
        product_id: productId,
      },
    })

    let result

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity

      if (product.stock_quantity < newQuantity) {
        return NextResponse.json(
          {
            error: `Stock insuficiente. Solo hay ${product.stock_quantity} unidades disponibles`,
          },
          { status: 400 },
        )
      }

      result = await prisma.cart_items.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQuantity,
          updated_at: new Date(),
        },
      })
    } else {
      result = await prisma.cart_items.create({
        data: {
          user_id: userId,
          product_id: productId,
          quantity,
          added_at: new Date(),
          updated_at: new Date(),
        },
      })
    }

    return NextResponse.json(
      {
        message: "Producto agregado al carrito exitosamente",
        cartItem: result,
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in add to cart API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
