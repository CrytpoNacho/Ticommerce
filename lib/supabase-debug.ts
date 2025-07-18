import { createClient } from "@supabase/supabase-js"

// Debug de configuración de Supabase
export function debugSupabaseConfig() {
  console.log("🔍 Verificando configuración de Supabase...")

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log("📊 Variables de entorno:")
  console.log("SUPABASE_URL:", supabaseUrl ? "✅ Configurada" : "❌ Faltante")
  console.log("SUPABASE_ANON_KEY:", supabaseKey ? "✅ Configurada" : "❌ Faltante")

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Variables de Supabase faltantes!")
    return null
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    console.log("✅ Cliente Supabase creado correctamente")
    return supabase
  } catch (error) {
    console.error("❌ Error creando cliente Supabase:", error)
    return null
  }
}

// Test de conexión
export async function testSupabaseConnection() {
  console.log("🧪 Probando conexión a Supabase...")

  const supabase = debugSupabaseConfig()
  if (!supabase) return false

  try {
    // Test simple: obtener información de la base de datos
    const { data, error } = await supabase.from("brands").select("count(*)").limit(1)

    if (error) {
      console.error("❌ Error en query de prueba:", error)
      return false
    }

    console.log("✅ Conexión a Supabase exitosa")
    console.log("📊 Resultado de prueba:", data)
    return true
  } catch (error) {
    console.error("❌ Error de conexión:", error)
    return false
  }
}
