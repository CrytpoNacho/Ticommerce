import Link from "next/link"
import ParticleBackground from "./ParticleBackground"
import SmokeEffect from "./SmokeEffect"

export default function Hero() {
  return (
    <div className="relative text-center py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <ParticleBackground />
        <SmokeEffect />
      </div>
      <div className="relative z-10">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-4 tracking-wider">
          PRODUCTOS <br />
          <span className="text-primary text-glow">DE LUJO</span> PARA TI
        </h1>
        <Link href="/categorias" className="inline-block btn-primary mt-8 btn-shine">
          Shop Now
        </Link>
      </div>
    </div>
  )
}
