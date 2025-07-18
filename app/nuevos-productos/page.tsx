import NavbarWrapper from "@/components/NavbarWrapper"
import ProductCard from "@/components/ProductCard"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Actualizar los precios de ejemplo en nuevos productos
const newProducts = [
  {
    id: "1",
    name: "Reloj Elegante",
    price: 75000,
    imageUrl: "/placeholder.svg?key=uoh3c",
  },
  {
    id: "2",
    name: "Bolso de Cuero",
    price: 45000,
    imageUrl: "/placeholder.svg?key=sy6dn",
  },
  {
    id: "3",
    name: "Vela Aromática",
    price: 12000,
    imageUrl: "/placeholder.svg?key=uszcs",
  },
  {
    id: "4",
    name: "Collar de Plata",
    price: 35000,
    imageUrl: "/placeholder.svg?key=14dks",
  },
  {
    id: "5",
    name: "Set de Té",
    price: 28000,
    imageUrl: "/luxury-tea-set.png",
  },
  {
    id: "6",
    name: "Billetera de Cuero",
    price: 18500,
    imageUrl: "/luxury-leather-wallet.png",
  },
  {
    id: "7",
    name: "Pulsera de Oro",
    price: 65000,
    imageUrl: "/placeholder.svg?key=p7s9d",
  },
  {
    id: "8",
    name: "Perfume de Lujo",
    price: 42000,
    imageUrl: "/placeholder.svg?key=l2k4j",
  },
]

export default function NuevosProductosPage() {
  return (
    <main>
      <NavbarWrapper />
      <div className="lg:ml-20 min-h-screen">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <Link href="/" className="flex items-center text-textSecondary hover:text-primary transition-colors">
              <ArrowLeft size={20} className="mr-2" />
              Volver al inicio
            </Link>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif mb-8">Nuevos Productos</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {newProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.imageUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
