// Migrado de Supabase a PostgreSQL Local
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    console.log("🔍 LOGIN ATTEMPT:")
    console.log("  - Email recibido:", email)

    if (!email || !password) {
      console.log("❌ Campos faltantes")
      return NextResponse.json({ error: "Email y contraseña son requeridos" }, { status: 400 })
    }

    console.log("🔍 Buscando usuario con email exacto:", email)
    const userData = await prisma.users.findUnique({
      where: { email },
    })

    if (!userData) {
      console.log("❌ Usuario no encontrado para email:", email)
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    console.log("✅ Usuario encontrado:")
    console.log("  - ID:", userData.id)
    console.log("  - Nombre:", userData.name)
    console.log("  - Email:", userData.email)

    const isValidPassword = await bcrypt.compare(password, userData.password_hash || "")

    if (!isValidPassword) {
      console.log("❌ Contraseña inválida para usuario:", userData.email)
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    console.log("✅ Contraseña válida")

    console.log("🔍 Verificando si es vendedor para user_id:", userData.id)
    const sellerData = await prisma.sellers.findUnique({
      where: { user_id: userData.id },
    })

    console.log("🔍 Resultado de consulta sellers:")
    console.log("  - Datos encontrados:", sellerData ? "SÍ" : "NO")

    if (sellerData) {
      console.log("  - Seller ID:", sellerData.id)
      console.log("  - Legal Name:", sellerData.legal_name)
      console.log("  - Brand Name:", sellerData.brand_name)
    }

    const userType = sellerData ? "seller" : "buyer"
    console.log("🎯 DETERMINACIÓN FINAL:")
    console.log("  - User ID:", userData.id)
    console.log("  - Tiene registro en sellers:", sellerData ? "SÍ" : "NO")
    console.log("  - Tipo asignado:", userType)

    return NextResponse.json(
      {
        message: "Login exitoso",
        user: {
          id: userData.id,
          name: userData.name,
          email: userData.email,
        },
        userType,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("💥 Error al hacer login:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
