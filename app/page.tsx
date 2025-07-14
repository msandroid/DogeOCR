import HeroSection from "@/components/hero-section"
import HowItWorksSection from "@/components/how-it-works-section" // Import the new component
import FeaturesSection from "@/components/features-section"
import Footer from "@/components/footer" // Import the Footer component

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection /> {/* Add the new how it works section here */}
        <FeaturesSection />
      </main>
      <Footer /> {/* Add the Footer component here */}
    </div>
  )
}
