// Migrado de Supabase a PostgreSQL Local
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { legalName, brandName, identification, phone, email, password } = await request.json()

    if (!legalName || !brandName || !identification || !phone || !email || !password) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    const existingUser = await prisma.users.findUnique({
      where: { email },
      select: { id: true },
    })

    if (existingUser) {
      return NextResponse.json({ error: "El usuario ya existe" }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const userData = await prisma.users.create({
      data: {
        name: legalName,
        email,
        password_hash: passwordHash,
        role: "seller",
        created_at: new Date(),
        is_verified: false,
      },
    })

    const sellerData = await prisma.sellers.create({
      data: {
        user_id: userData.id,
        seller_type: "individual",
        landing_description: `Tienda de ${brandName}`,
        fe_active: false,
      },
    })

    return NextResponse.json(
      {
        message: "Vendedor registrado exitosamente",
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error al registrar vendedor:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
