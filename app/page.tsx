import NavbarWrapper from "@/components/NavbarWrapper"
import Hero from "@/components/Hero"
import FeaturedProducts from "@/components/FeaturedProducts"
import ProductCarousel from "@/components/ProductCarousel"
import CategorySection from "@/components/CategorySection"
import BrandsSection from "@/components/BrandsSection"
import InfiniteProductScroll from "@/components/InfiniteProductScroll"
import ScrollToTopButton from "@/components/ScrollToTopButton"

export default function Home() {
  return (
    <main>
      <NavbarWrapper />
      <div className="lg:ml-20 min-h-screen">
        <div className="container mx-auto px-4 pt-16 lg:pt-0">
          <Hero />
          <ProductCarousel title="Tendencias" viewAllLink="/trending" limit={8} />
          <BrandsSection />
          <CategorySection />
          <FeaturedProducts title="Nuevos Productos" viewAllLink="/nuevos-productos" limit={6} />
          <InfiniteProductScroll />
          <ScrollToTopButton />
        </div>
      </div>
    </main>
  )
}
