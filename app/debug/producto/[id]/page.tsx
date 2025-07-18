import DebugVariantImages from "@/components/DebugVariantImages"

export default function DebugProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-8">Debug Producto {params.id}</h1>
        <DebugVariantImages productId={Number.parseInt(params.id)} />
      </div>
    </div>
  )
}
