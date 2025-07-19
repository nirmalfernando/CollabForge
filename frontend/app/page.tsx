"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import HeroSection from "@/components/hero-section"
import PartnerLogos from "@/components/partner-logos"
import OurPeopleSection from "@/components/our-people-section"
import ContactUsSection from "@/components/contact-us-section"
import WelcomeDashboard from "@/components/welcome-dashboard"

export default function LandingPage() {
  // Simulate authentication status. In a real app, this would come from your auth context.
  const [isAuthenticated, setIsAuthenticated] = useState(false) // Set to true to see dashboard

  // Placeholder user data for authenticated state
  const userName = "CollabUser"
  const userProfileImage = "/placeholder.svg?height=40&width=40"

  return (
    <div className="flex flex-col min-h-screen bg-collab-dark">
      <Header isAuthenticated={isAuthenticated} userName={userName} userProfileImage={userProfileImage} />
      <main className="flex-1">
        {isAuthenticated ? (
          // Authenticated user sees the dashboard
          <WelcomeDashboard userName={userName} />
        ) : (
          // Unauthenticated user sees the marketing landing page
          <>
            <HeroSection />
            <PartnerLogos />
            <OurPeopleSection />
            <ContactUsSection />
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
