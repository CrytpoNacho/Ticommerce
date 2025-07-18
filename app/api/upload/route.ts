// Migrado de Supabase a PostgreSQL Local (sin uso directo de base de datos)

import { type NextRequest, NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: NextRequest) {
  try {
    console.log("📤 Iniciando upload de archivo...")

    const formData = await request.formData()
    const file = formData.get("file") as File
    const productId = formData.get("productId") as string
    const variantId = formData.get("variantId") as string | null

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó archivo" }, { status: 400 })
    }

    console.log("📁 Archivo recibido:", {
      name: file.name,
      size: file.size,
      type: file.type,
      productId,
      variantId,
    })

    // Generar nombre único para el archivo
    const timestamp = Date.now()
    const fileExtension = file.name.split(".").pop()
    const fileName = `products/${productId}/${variantId || "main"}/${timestamp}.${fileExtension}`

    console.log("🏷️ Nombre de archivo generado:", fileName)

    // Subir a Vercel Blob
    const { url } = await put(fileName, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    console.log("✅ Archivo subido a Vercel Blob:", url)

    // Si decides guardar el registro del archivo en la base de datos con Prisma:
    // await prisma.productMedia.create({
    //   data: {
    //     product_id: productId,
    //     variant_id: variantId,
    //     file_url: url,
    //     file_name: file.name,
    //     file_type: "image",
    //     file_size: file.size,
    //     mime_type: file.type,
    //     is_primary: true,
    //     display_order: 0,
    //   },
    // })

    return NextResponse.json(
      {
        success: true,
        url,
        fileName: file.name,
        size: file.size,
        type: file.type,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("❌ Error en upload:", error)
    return NextResponse.json(
      {
        error: "Error al subir archivo",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
