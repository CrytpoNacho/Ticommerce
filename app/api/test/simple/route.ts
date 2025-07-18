// Migrado de Supabase a PostgreSQL Local (sin uso directo de base de datos)

import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("🧪 API de prueba simple ejecutándose...")

    return NextResponse.json(
      {
        message: "API funcionando correctamente",
        timestamp: new Date().toISOString(),
        status: "OK",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("❌ Error en API simple:", error)
    return NextResponse.json(
      {
        error: "Error en API simple",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
