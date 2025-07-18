import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Simple rate limiting store (en producción usar Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(userId: string, maxRequests = 10, windowMs = 60000) {
  const now = Date.now()
  const key = `cart_${userId}`
  const userLimit = rateLimitStore.get(key)

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (userLimit.count >= maxRequests) {
    return false
  }

  userLimit.count++
  return true
}

// GET - Obtener carrito del usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 })
    }

    // Verificar rate limit
    if (!checkRateLimit(userId)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    // Obtener items del carrito con información del producto y marca
    const cartItems = await prisma.cart_items.findMany({
      where: { user_id: userId },
      include: {
        products: {
          include: {
            brands: {
              select: { name: true, slug: true },
            },
          },
        },
      },
      orderBy: { added_at: "desc" },
    })

    const activeCartItems = cartItems.filter((item) => item.products?.is_active)

    const cartSummary = {
      items: activeCartItems,
      totalItems: activeCartItems.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: activeCartItems.reduce(
        (sum, item) => sum + (item.products?.price || 0) * item.quantity,
        0,
      ),
      itemCount: activeCartItems.length,
    }

    return NextResponse.json({ cart: cartSummary }, { status: 200 })
  } catch (error) {
    console.error("Error in cart API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// DELETE - Limpiar carrito completo
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "ID de usuario requerido" }, { status: 400 })
    }

    if (!checkRateLimit(userId, 5)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    await prisma.cart_items.deleteMany({
      where: { user_id: userId },
    })

    return NextResponse.json({ message: "Carrito limpiado exitosamente" }, { status: 200 })
  } catch (error) {
    console.error("Error in clear cart API:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
