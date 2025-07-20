"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"
import PersonCard from "@/components/person-card"
import Footer from "@/components/footer"
import { BoltIcon as Bat, Gem, Feather, Zap, Leaf } from "lucide-react"
import { useState } from "react"

export default function CreatorDashboardPage() {
  // Simulate user login state and role
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Set to true for demonstration
  const [userRole, setUserRole] = useState<"influencer" | "brand-manager">("influencer") // Default role

  const people = [
    {
      name: "Jamie L.",
      handle: "(@jamielifts)",
      description:
        "Fitness Creator — 180K Followers. Jamie built a loyal fitness community on Instagram and YouTube. She partnered with sportswear brands to launch limited-edition collections that sold out within hours.",
      avatarSrc: "/placeholder.svg?height=100&width=100",
      avatarAlt: "Jamie L. avatar",
    },
    {
      name: "Alex T.",
      handle: "(@codewithalex)",
      description:
        "Tech Educator — 90K on TikTok, 22K on YouTube. Alex creates bite-sized tech tutorials and coding lessons. Their collaboration with a SaaS startup drove a 40% uptick in trial signups.",
      avatarSrc: "/placeholder.svg?height=100&width=100",
      avatarAlt: "Alex T. avatar",
    },
    {
      name: "Chris & Mel",
      handle: "(@voyagevlog)",
      description:
        "Travel Couple — 250K Followers. This adventurous duo travel the world. They recently did a collab with an eco-friendly tourism board, creating a content series that got over 1M views.",
      avatarSrc: "/placeholder.svg?height=100&width=100",
      avatarAlt: "Chris & Mel avatar",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header isLoggedIn={isLoggedIn} userRole={userRole} />

      <main className="flex-1">
        {/* Hero Section (reused from landing for visual consistency) */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
          <div className="container px-4 md:px-6 grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                Welcome, <span className="text-primary">Creator!</span>
              </h1>
              <p className="max-w-[700px] text-lg md:text-xl text-muted-foreground">
                This is your personalized dashboard. Explore new campaigns, connect with brands, and manage your
                profile.
              </p>
            </div>
            <div className="hidden lg:flex justify-center items-center">
              <div className="w-[400px] h-[400px] rounded-full border-4 border-primary animate-pulse" />
            </div>
          </div>
        </section>

        {/* Partner Logos Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6 flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <Bat className="h-12 w-12 text-foreground" />
            <Gem className="h-12 w-12 text-foreground" />
            <Zap className="h-12 w-12 text-foreground" />
            <Feather className="h-12 w-12 text-foreground" />
            <Leaf className="h-12 w-12 text-foreground" />
          </div>
        </section>

        {/* Our People Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-primary">Featured</span> Brands
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {people.map((person, index) => (
                <PersonCard key={index} {...person} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6 grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="hidden lg:block">
              <Image
                src="/placeholder.svg?height=500&width=500"
                width={600}
                height={400}
                alt="Abstract background"
                className="rounded-xl object-cover w-full h-full"
              />
            </div>
            <div className="bg-card p-8 rounded-xl shadow-lg">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="text-primary">Contact</span> Us
              </h2>
              <form className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
                />
                <Input
                  type="text"
                  placeholder="Name"
                  className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3"
                />
                <textarea
                  placeholder="Message"
                  rows={5}
                  className="w-full bg-muted border-none text-foreground placeholder:text-muted-foreground rounded-lg p-3 resize-y"
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="w-full rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 py-3 text-lg bg-transparent"
                >
                  Submit Response
                </Button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
