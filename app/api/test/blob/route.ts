// Migrado de Supabase a PostgreSQL Local (sin uso directo de base de datos)

import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function GET() {
  try {
    console.log("🧪 Probando Vercel Blob...")

    // Crear un archivo de prueba
    const testContent = `Prueba de Vercel Blob - ${new Date().toISOString()}`
    const fileName = `test/prueba-${Date.now()}.txt`

    console.log("📤 Subiendo archivo de prueba:", fileName)

    const { url } = await put(fileName, testContent, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    console.log("✅ Archivo subido exitosamente:", url)

    return NextResponse.json(
      {
        success: true,
        message: "Vercel Blob funciona correctamente",
        testFile: {
          fileName,
          url,
          content: testContent,
        },
        config: {
          tokenConfigured: !!process.env.BLOB_READ_WRITE_TOKEN,
        },
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("❌ Error probando Vercel Blob:", error)
    return NextResponse.json(
      {
        error: "Error en Vercel Blob",
        details: error instanceof Error ? error.message : "Error desconocido",
        config: {
          tokenConfigured: !!process.env.BLOB_READ_WRITE_TOKEN,
        },
      },
      { status: 500 },
    )
  }
}
