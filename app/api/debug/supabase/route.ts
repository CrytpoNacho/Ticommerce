import { NextResponse } from "next/server"
import { debugSupabaseConfig, testSupabaseConnection } from "@/lib/supabase-debug"

export async function GET() {
  try {
    console.log("🔧 Iniciando diagnóstico de Supabase...")

    // Verificar configuración
    const configOk = debugSupabaseConfig() !== null

    // Probar conexión
    const connectionOk = await testSupabaseConnection()

    const result = {
      timestamp: new Date().toISOString(),
      config: configOk ? "OK" : "ERROR",
      connection: connectionOk ? "OK" : "ERROR",
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "SET" : "MISSING",
        SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "MISSING",
      },
    }

    console.log("📊 Resultado del diagnóstico:", result)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("💥 Error en diagnóstico:", error)
    return NextResponse.json(
      {
        error: "Error en diagnóstico",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
