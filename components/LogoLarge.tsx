import Image from "next/image"
import Link from "next/link"

export default function LogoLarge() {
  return (
    <Link href="/" className="block">
      <div className="relative w-16 h-16">
        <Image src="/logo.png" alt="10KCR Logo" fill className="object-contain" />
      </div>
    </Link>
  )
}
