"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Header from "@/components/header" // Keep Header for initial load if needed
import Footer from "@/components/footer" // Keep Footer for initial load if needed

export default function HomePage() {
  const router = useRouter()
  // Simulate user role. In a real app, this would come from auth context or a server call.
  const [userRole, setUserRole] = useState<"influencer" | "brand-manager" | null>(null)

  useEffect(() => {
    // Simulate fetching user role after login
    const simulatedUserRole = "influencer" // Change to "brand-manager" to test brand dashboard
    setUserRole(simulatedUserRole)

    if (simulatedUserRole === "influencer") {
      router.push("/creator/dashboard")
    } else if (simulatedUserRole === "brand-manager") {
      router.push("/brand/dashboard")
    }
  }, [router])

  // You can render a loading spinner or message here while redirecting
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground items-center justify-center">
      <Header isLoggedIn={true} userRole={userRole || "influencer"} /> {/* Pass a default role for header */}
      <div className="flex-1 flex items-center justify-center text-2xl">Loading your dashboard...</div>
      <Footer />
    </div>
  )
}
