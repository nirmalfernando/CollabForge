import Header from "@/components/header"
import Footer from "@/components/footer"
import HeroSection from "@/components/hero-section"
import PartnerLogos from "@/components/partner-logos"
import OurPeopleSection from "@/components/our-people-section"
import ContactUsSection from "@/components/contact-us-section"

export default function HomePage() {
  // In a real application, you would fetch the user's data from your authentication context or API
  const isAuthenticated = true // This page is only accessible to authenticated users
  const userName = "CollabUser"
  const userProfileImage = "/placeholder.svg?height=40&width=40"

  return (
    <div className="flex flex-col min-h-screen bg-collab-dark">
      <Header isAuthenticated={isAuthenticated} userName={userName} userProfileImage={userProfileImage} />
      <main className="flex-1">
        <HeroSection isAuthenticated={isAuthenticated} />
        <PartnerLogos />
        <OurPeopleSection />
        <ContactUsSection />
      </main>
      <Footer />
    </div>
  )
}
